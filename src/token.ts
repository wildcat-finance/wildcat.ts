import type { Abi, Address } from "viem";
import { iERC20Abi, marketLensAbi, marketLensV2Abi, marketLensV2_5Abi } from "./abi";
import {
  IERC20,
  IERC20__factory,
  TokenMetadataStructOutput,
  TokenMetadataV2_5StructOutput
} from "./typechain";
import { ContractWrapper, SignerOrProvider, TransactionHash } from "./types";
import { SupportedChainId, getDeploymentAddress, hasDeploymentAddress } from "./constants";
import { getViemPublicClientFromEthers } from "./internal/ethers-viem";
import { readViemContract } from "./internal/viem-read";
import {
  bipMulBigint,
  formatFixedBigint,
  mulDivBigint,
  parseFixedBigint,
  prepareTransaction,
  rayDivBigint,
  rayMulBigint,
  toBigint,
  toNumber,
  type BigintNumberish
} from "./utils";
import { SubgraphMarketDataFragment, SubgraphToken } from "./gql/graphql";
import { submitPreparedTransaction } from "./internal/viem-write";

type RhsAmount = BigintNumberish | TokenAmount;
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

export const toRawAmount = (amount: RhsAmount): bigint => {
  if (amount instanceof TokenAmount) {
    return amount.raw;
  }
  return toBigint(amount);
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
  constructor(public raw: bigint, public token: Token) {}

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
    return formatFixedBigint(this.raw, this.decimals, digits);
  }

  format(digits = this.decimals, withSymbol?: boolean): string {
    return `${this.toFixed(digits)}${withSymbol ? " " + this.symbol : ""}`;
  }

  gt(amount: RhsAmount): boolean {
    return this.raw > toRawAmount(amount);
  }

  lt(amount: RhsAmount): boolean {
    return this.raw < toRawAmount(amount);
  }

  lte(amount: RhsAmount): boolean {
    return this.raw <= toRawAmount(amount);
  }

  gte(amount: RhsAmount): boolean {
    return this.raw >= toRawAmount(amount);
  }

  eq(amount: RhsAmount): boolean {
    return this.raw === toRawAmount(amount);
  }

  add(amount: RhsAmount): TokenAmount {
    return this.token.getAmount(this.raw + toRawAmount(amount));
  }

  sub(amount: RhsAmount): TokenAmount {
    return this.token.getAmount(this.raw - toRawAmount(amount));
  }

  mul(amount: RhsAmount): TokenAmount {
    return this.token.getAmount(this.raw * toRawAmount(amount));
  }

  div(amount: RhsAmount, allowDivideByZero = false): TokenAmount {
    const divisor = toRawAmount(amount);
    return this.token.getAmount(allowDivideByZero && divisor === 0n ? 0n : this.raw / divisor);
  }

  mulDiv(numer: RhsAmount, denom: RhsAmount): TokenAmount {
    return this.token.getAmount(mulDivBigint(this.raw, toRawAmount(numer), toRawAmount(denom)));
  }

  bipMul(amount: RhsAmount): TokenAmount {
    return this.token.getAmount(bipMulBigint(this.raw, toRawAmount(amount)));
  }

  rayMul(amount: RhsAmount): TokenAmount {
    return this.token.getAmount(rayMulBigint(this.raw, toRawAmount(amount)));
  }

  rayDiv(amount: RhsAmount): TokenAmount {
    return this.token.getAmount(rayDivBigint(this.raw, toRawAmount(amount)));
  }

  satsub(amount: RhsAmount): TokenAmount {
    const b = toRawAmount(amount);
    return this.token.getAmount(this.raw < b ? 0n : this.raw - b);
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

  async faucet(): Promise<TransactionHash> {
    if (!this.isMock) {
      throw Error("Can not use faucet on non-mock token");
    }
    return submitPreparedTransaction(
      this.signer,
      prepareTransaction({
        to: this.address,
        abi: iERC20Abi,
        functionName: "faucet"
      })
    );
  }

  getAmount(amount: RhsAmount): TokenAmount {
    return new TokenAmount(toRawAmount(amount), this);
  }

  parseAmount(amount: number | string): TokenAmount {
    return this.getAmount(parseFixedBigint(amount, this.decimals));
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
      toNumber(metadata.decimals),
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
      const metadata = await readViemContract<ViemTokenMetadataOutput>(
        publicClient,
        getDeploymentAddress(chainId, "MarketLensV2_5"),
        marketLensV2_5Abi as Abi,
        "getTokenInfo",
        [token as Address]
      );
      return Token.fromViemTokenMetadata(chainId, metadata, provider);
    }
    const metadata = await readViemContract<ViemTokenMetadataOutput>(
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
      const metadata = await readViemContract<readonly ViemTokenMetadataOutput[]>(
        publicClient,
        getDeploymentAddress(chainId, "MarketLensV2_5"),
        marketLensV2_5Abi as Abi,
        "getTokensInfo",
        [tokens as Address[]]
      );
      return metadata.map((m) => Token.fromViemTokenMetadata(chainId, m, provider));
    }
    const metadata = await readViemContract<readonly ViemTokenMetadataOutput[]>(
      publicClient,
      getDeploymentAddress(chainId, "MarketLens"),
      marketLensAbi as Abi,
      "getTokensInfo",
      [tokens as Address[]]
    );
    return metadata.map((m) => Token.fromViemTokenMetadata(chainId, m, provider));
  }
}
