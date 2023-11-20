import { BigNumber, BigNumberish, ContractTransaction } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { IERC20, IERC20__factory, TokenMetadataStructOutput } from "./typechain";
import { ContractWrapper, SignerOrProvider } from "./types";
import { getLensContract } from "./constants";
import { bipMul, formatBnFixed, mulDiv, rayDiv, rayMul } from "./utils";
import { SubgraphMarketDataFragment, SubgraphToken } from "./gql/graphql";

type RhsAmount = BigNumberish | TokenAmount;
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

  div(amount: RhsAmount): TokenAmount {
    amount = toBn(amount);
    return this.token.getAmount(this.raw.div(amount));
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
    public address: string,
    public name: string,
    public symbol: string,
    public decimals: number,
    public isMock: boolean,
    provider: SignerOrProvider
  ) {
    super(provider);
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

  static fromTokenMetadata(metadata: TokenMetadataStructOutput, provider: SignerOrProvider): Token {
    return new Token(
      metadata.token,
      metadata.name,
      metadata.symbol,
      metadata.decimals.toNumber(),
      metadata.isMock,
      provider
    );
  }

  static fromSubgraphToken(data: SubgraphToken, provider: SignerOrProvider): Token {
    return new Token(data.address, data.name, data.symbol, data.decimals, data.isMock, provider);
  }

  static fromSubgraphMarketData(
    data: SubgraphMarketDataFragment,
    provider: SignerOrProvider
  ): Token {
    return new Token(data.id, data.name, data.symbol, data.decimals, false, provider);
  }

  static async getTokenData(token: string, provider: SignerOrProvider): Promise<Token> {
    const lens = getLensContract(provider);
    const metadata = await lens.getTokenInfo(token);
    return Token.fromTokenMetadata(metadata, provider);
  }

  static async getTokensData(tokens: string[], provider: SignerOrProvider): Promise<Token[]> {
    const lens = getLensContract(provider);
    return lens
      .getTokensInfo(tokens)
      .then((metadata) => metadata.map((m) => Token.fromTokenMetadata(m, provider)));
  }
}
