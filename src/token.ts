import { BigNumber, BigNumberish } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { TokenMetadataStructOutput } from "./typechain";
import { ContractWrapper, SignerOrProvider } from "./types";
import { getLensContract } from "./constants";
import { IERC20, IERC20__factory } from "./typechain";

type RhsAmount = BigNumberish | TokenAmount;
const toBn = (amount: RhsAmount): BigNumber => {
  if (amount instanceof TokenAmount) {
    return amount.raw;
  }
  return BigNumber.from(amount);
};

export const maxTokenAmount = (...amounts: TokenAmount[]): TokenAmount =>
  amounts.sort((a, b) => +a.lt(b))[0];

export const minTokenAmount = (...amounts: TokenAmount[]): TokenAmount =>
  amounts.sort((a, b) => +a.gt(b))[0];

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

  toFixed(digits = this.decimals): number {
    const str = formatUnits(this.raw, this.decimals);
    return +parseFloat(str).toFixed(digits);
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
    provider: SignerOrProvider
  ) {
    super(provider);
  }

  getAmount(amount: RhsAmount): TokenAmount {
    return new TokenAmount(toBn(amount), this);
  }

  parseAmount(amount: number | string): TokenAmount {
    const bnAmount = parseUnits(amount.toString(), this.decimals);
    return this.getAmount(bnAmount);
  }

  static fromTokenMetadataStruct(
    metadata: TokenMetadataStructOutput,
    provider: SignerOrProvider
  ): Token {
    return new Token(
      metadata.token,
      metadata.name,
      metadata.symbol,
      metadata.decimals.toNumber(),
      provider
    );
  }

  static async getTokenInfo(token: string, provider: SignerOrProvider): Promise<Token> {
    const lens = getLensContract(provider);
    const metadata = await lens.getTokenInfo(token);
    return Token.fromTokenMetadataStruct(metadata, provider);
  }
}
