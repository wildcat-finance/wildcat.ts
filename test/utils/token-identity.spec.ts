import { expect } from "chai";
import { BigNumber } from "ethers";
import { getAddress } from "viem";
import { SupportedChainId } from "../../src/constants";
import { Token, TokenAmount, maxTokenAmount, minTokenAmount, toRawAmount } from "../../src/token";
import { makeAddress, offlineProvider } from "../helpers/review-fixtures";

const makeToken = (overrides: Partial<Pick<Token, "chainId" | "address" | "decimals">> = {}) =>
  new Token(
    overrides.chainId ?? SupportedChainId.Sepolia,
    overrides.address ?? makeAddress(0xabcd),
    "Asset",
    "AST",
    overrides.decimals ?? 6,
    false,
    offlineProvider
  );

describe("TokenAmount identity", () => {
  const token = makeToken();
  const amount = token.getAmount(100n);

  for (const [dimension, overrides] of [
    ["chain", { chainId: SupportedChainId.Mainnet }],
    ["address", { address: makeAddress(2) }],
    ["decimals", { decimals: 18 }]
  ] as const) {
    const other = makeToken(overrides).getAmount(10n);
    const error = new RegExp(`token ${dimension} mismatch`);

    it(`rejects a different ${dimension} during construction, rewrapping, and checked extraction`, () => {
      expect(() => new TokenAmount(other, token)).to.throw(error);
      expect(() => token.getAmount(other)).to.throw(error);
      expect(() => toRawAmount(other, token)).to.throw(error);
      expect(() => token.populateApprove(makeAddress(3), other)).to.throw(error);
      expect(other.raw).to.equal(10n);
      expect(other.token).not.to.equal(token);
    });

    for (const operation of ["gt", "gte", "lt", "lte", "eq", "add", "sub", "satsub"] as const) {
      it(`rejects a different ${dimension} in ${operation}`, () => {
        expect(() => amount[operation](other)).to.throw(error);
        expect(amount.raw).to.equal(100n);
      });
    }

    it(`checks both operands in min/max and multiplication helpers for a different ${dimension}`, () => {
      expect(() => minTokenAmount(amount, other)).to.throw(error);
      expect(() => maxTokenAmount(other, amount)).to.throw(error);
      for (const operation of ["mul", "div", "bipMul", "rayMul", "rayDiv"] as const) {
        expect(() => amount[operation](other)).to.throw(error);
      }
      expect(() => amount.mulDiv(other, 2n)).to.throw(error);
      expect(() => amount.mulDiv(2n, other)).to.throw(error);
      expect(() => amount.div(other.token.getAmount(0n), true)).to.throw(error);
    });
  }

  it("accepts matching identities across token objects, address casing, and display metadata", () => {
    const equivalent = makeToken({ address: getAddress(token.address) });
    equivalent.name = "Another label";
    equivalent.symbol = "LABEL";
    const rhs = equivalent.getAmount(10n);
    expect(token.getAmount(rhs).token).to.equal(token);
    expect(new TokenAmount(rhs, token).raw).to.equal(10n);
    expect(amount.add(rhs).raw).to.equal(110n);
    expect(amount.gt(rhs)).to.equal(true);
    expect(amount.mulDiv(rhs, rhs).raw).to.equal(100n);
    expect(minTokenAmount(amount, rhs)).to.equal(rhs);
    expect(maxTokenAmount(rhs, amount)).to.equal(amount);
  });

  it("preserves raw bigint, safe number, string, and ethers operands without rescaling", () => {
    for (const raw of [10n, 10, "10", BigNumber.from(10)]) {
      expect(toRawAmount(raw, token)).to.equal(10n);
      expect(token.getAmount(raw).raw).to.equal(10n);
      expect(amount.add(raw).raw).to.equal(110n);
      expect(amount.mulDiv(raw, raw).raw).to.equal(100n);
    }
    // Explicitly extracting units remains available to callers doing a conversion.
    const other = makeToken({ address: makeAddress(4), decimals: 18 }).getAmount(10n);
    expect(toRawAmount(other)).to.equal(10n);
    expect(token.getAmount(other.raw).raw).to.equal(10n);
  });
});
