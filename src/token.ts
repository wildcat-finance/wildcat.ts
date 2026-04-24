import { BigNumber, BigNumberish, ContractTransaction } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import type { Abi, Address, PublicClient } from "viem";
import { marketLensAbi, marketLensV2Abi, marketLensV2_5Abi } from "./abi";
import {
  IERC20,
  IERC20__factory,
  TokenMetadataStructOutput,
  TokenMetadataV2_5StructOutput
} from "./typechain";
import { ContractWrapper, SignerOrProvider } from "./types";
import { SupportedChainId, getDeploymentAddress, hasDeploymentAddress } from "./constants";
import { getViemPublicClientFromEthers } from "./internal/ethers-viem";
import { bipMul, formatBnFixed, mulDiv, rayDiv, rayMul } from "./utils";
import { SubgraphMarketDataFragment, SubgraphToken } from "./gql/graphql";

type RhsAmount = BigNumberish | TokenAmount;
type TokenMetadataOutput = TokenMetadataStructOutput | TokenMetadataV2_5StructOutput;
type ViemTokenMetadataObject = {
  token: string;
  name: string;
  symbol: string;
  decimals: bigint | number;
  isMock: boolean;
};
type ViemTokenMetadataField = ViemTokenMetadataObject[keyof ViemTokenMetadataObject];
type ViemTokenMetadataOutput =
  | ViemTokenMetadataObject
  | readonly [string, string, string, bigint | number, boolean];

const getViemTokenMetadataValue = (
  metadata: ViemTokenMetadataOutput,
  key: keyof ViemTokenMetadataObject,
  index: number
): ViemTokenMetadataField => {
  const keyedValue = (metadata as Partial<ViemTokenMetadataObject>)[key];
  return keyedValue ?? (metadata as readonly ViemTokenMetadataField[])[index];
};

const readLensContract = async <Result>(
  publicClient: PublicClient,
  address: string,
  abi: Abi,
  functionName: string,
  args: readonly unknown[]
): Promise<Result> => {
  return publicClient.readContract({
    address: address as Address,
    abi,
    functionName,
    args
  } as Parameters<PublicClient["readContract"]>[0]) as Promise<Result>;
};

export const toBn = (amount: RhsAmount): BigNumber => {
  if (amount instanceof TokenAmount) {
    return amount.raw;
  }
  return BigNumber.from(amount);
};

export const maxTokenAmount = (...amounts: TokenAmount[]): TokenAmount => {
  let max = amounts[0];
  for (let i = 1; i < amounts.length; i++) {
    if (amounts[i].gt(max)) max = amounts[i];
  }
  return max;
};

export const minTokenAmount = (...amounts: TokenAmount[]): TokenAmount => {
  let min = amounts[0];
  for (let i = 1; i < amounts.length; i++) {
    if (amounts[i].lt(min)) min = amounts[i];
  }
  return min;
};

export class TokenAmount {
  constructor(public raw: BigNumber, public token: Token) {}

  get name(): string {
    return this.token.name;
  }

  get symbol(): string {
    return this.token.symbol;
  }

  get decimals(): number {
    return this.token.decimals;
  }

  toFixed(digits = this.decimals): string {
    return formatBnFixed(this.raw, this.decimals, digits);
  }

  format(digits = this.decimals, withSymbol?: boolean): string {
    return `${this.toFixed(digits)}${withSymbol ? " " + this.symbol : ""}`;
  }

  gt(amount: RhsAmount): boolean {
    amount = toBn(amount);
    return this.raw.gt(amount);
  }

  lt(amount: RhsAmount): boolean {
    amount = toBn(amount);
    return this.raw.lt(amount);
  }

  lte(amount: RhsAmount): boolean {
    amount = toBn(amount);
    return this.raw.lte(amount);
  }

  gte(amount: RhsAmount): boolean {
    amount = toBn(amount);
    return this.raw.gte(amount);
  }

  eq(amount: RhsAmount): boolean {
    amount = toBn(amount);
    return this.raw.eq(amount);
  }

  add(amount: RhsAmount): TokenAmount {
    amount = toBn(amount);
    return this.token.getAmount(this.raw.add(amount));
  }

  sub(amount: RhsAmount): TokenAmount {
    amount = toBn(amount);
    return this.token.getAmount(this.raw.sub(amount));
  }

  mul(amount: RhsAmount): TokenAmount {
    amount = toBn(amount);
    return this.token.getAmount(this.raw.mul(amount));
  }

  div(amount: RhsAmount, allowDivideByZero = false): TokenAmount {
    amount = toBn(amount);
    return this.token.getAmount(
      allowDivideByZero && amount.isZero() ? BigNumber.from(0) : this.raw.div(amount)
    );
  }

  mulDiv(numer: RhsAmount, denom: RhsAmount): TokenAmount {
    numer = toBn(numer);
    denom = toBn(denom);
    return this.token.getAmount(mulDiv(this.raw, numer, denom));
  }

  bipMul(amount: RhsAmount): TokenAmount {
    return this.token.getAmount(bipMul(this.raw, toBn(amount)));
  }

  rayMul(amount: RhsAmount): TokenAmount {
    return this.token.getAmount(rayMul(this.raw, toBn(amount)));
  }

  rayDiv(amount: RhsAmount): TokenAmount {
    return this.token.getAmount(rayDiv(this.raw, toBn(amount)));
  }

  satsub(amount: RhsAmount): TokenAmount {
    amount = toBn(amount);
    const a = this.raw;
    const b = amount;
    if (a.lt(b)) {
      return this.token.getAmount(BigNumber.from(0));
    }
    return this.token.getAmount(a.sub(b));
  }
}

export class Token extends ContractWrapper<IERC20> {
  readonly contractFactory = IERC20__factory;

  constructor(
    public chainId: SupportedChainId,
    public address: string,
    public name: string,
    public symbol: string,
    public decimals: number,
    public isMock: boolean,
    provider: SignerOrProvider
  ) {
    super(provider);
  }

  protected get _contractAddress(): string {
    return this.address;
  }

  async faucet(): Promise<ContractTransaction> {
    if (!this.isMock) {
      throw Error("Can not use faucet on non-mock token");
    }
    return IERC20__factory.connect(this.address, this.signer).faucet();
  }

  getAmount(amount: RhsAmount): TokenAmount {
    return new TokenAmount(toBn(amount), this);
  }

  parseAmount(amount: number | string): TokenAmount {
    const bnAmount = parseUnits(amount.toString(), this.decimals);
    return this.getAmount(bnAmount);
  }

  static fromTokenMetadata(
    chainId: SupportedChainId,
    metadata: TokenMetadataOutput,
    provider: SignerOrProvider
  ): Token {
    return new Token(
      chainId,
      metadata.token,
      metadata.name,
      metadata.symbol,
      metadata.decimals.toNumber(),
      metadata.isMock,
      provider
    );
  }

  static fromViemTokenMetadata(
    chainId: SupportedChainId,
    metadata: ViemTokenMetadataOutput,
    provider: SignerOrProvider
  ): Token {
    const decimals = getViemTokenMetadataValue(metadata, "decimals", 3) as bigint | number;
    return new Token(
      chainId,
      getViemTokenMetadataValue(metadata, "token", 0) as string,
      getViemTokenMetadataValue(metadata, "name", 1) as string,
      getViemTokenMetadataValue(metadata, "symbol", 2) as string,
      Number(decimals),
      getViemTokenMetadataValue(metadata, "isMock", 4) as boolean,
      provider
    );
  }

  static fromSubgraphToken(
    chainId: SupportedChainId,
    data: SubgraphToken,
    provider: SignerOrProvider
  ): Token {
    return new Token(
      chainId,
      data.address,
      data.name,
      data.symbol,
      data.decimals,
      data.isMock,
      provider
    );
  }

  static fromSubgraphMarketData(
    chainId: SupportedChainId,
    data: SubgraphMarketDataFragment,
    provider: SignerOrProvider
  ): Token {
    return new Token(chainId, data.id, data.name, data.symbol, data.decimals, false, provider);
  }

  static async getTokenData(
    chainId: SupportedChainId,
    token: string,
    provider: SignerOrProvider
  ): Promise<Token> {
    const publicClient = getViemPublicClientFromEthers(provider);
    if (hasDeploymentAddress(chainId, "MarketLensV2_5")) {
      const metadata = await readLensContract<ViemTokenMetadataOutput>(
        publicClient,
        getDeploymentAddress(chainId, "MarketLensV2_5"),
        marketLensV2_5Abi as Abi,
        "getTokenInfo",
        [token as Address]
      );
      return Token.fromViemTokenMetadata(chainId, metadata, provider);
    }
    const metadata = await readLensContract<ViemTokenMetadataOutput>(
      publicClient,
      getDeploymentAddress(chainId, "MarketLensV2"),
      marketLensV2Abi as Abi,
      "getTokenInfo",
      [token as Address]
    );
    return Token.fromViemTokenMetadata(chainId, metadata, provider);
  }

  static async getTokensData(
    chainId: SupportedChainId,
    tokens: string[],
    provider: SignerOrProvider
  ): Promise<Token[]> {
    const publicClient = getViemPublicClientFromEthers(provider);
    if (hasDeploymentAddress(chainId, "MarketLensV2_5")) {
      const metadata = await readLensContract<readonly ViemTokenMetadataOutput[]>(
        publicClient,
        getDeploymentAddress(chainId, "MarketLensV2_5"),
        marketLensV2_5Abi as Abi,
        "getTokensInfo",
        [tokens as Address[]]
      );
      return metadata.map((m) => Token.fromViemTokenMetadata(chainId, m, provider));
    }
    const metadata = await readLensContract<readonly ViemTokenMetadataOutput[]>(
      publicClient,
      getDeploymentAddress(chainId, "MarketLens"),
      marketLensAbi as Abi,
      "getTokensInfo",
      [tokens as Address[]]
    );
    return metadata.map((m) => Token.fromViemTokenMetadata(chainId, m, provider));
  }
}
