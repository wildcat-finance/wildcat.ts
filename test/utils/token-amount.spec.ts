import { expect } from "chai";
import { providers } from "ethers";
import { SupportedChainId } from "../../src/constants";
import { Token, toRawAmount } from "../../src/token";
import { BIP_BIGINT, RAY_BIGINT } from "../../src/utils";

const provider = new providers.JsonRpcProvider();

const token = new Token(
  SupportedChainId.Sepolia,
  "0x0000000000000000000000000000000000000001",
  "Mock USD",
  "mUSD",
  6,
  false,
  provider
);

const legacyBigNumberLike = (value: bigint | number | string): { toString(): string } => ({
  toString: () => value.toString()
});

describe("TokenAmount bigint model", () => {
  it("stores raw amounts as bigint while preserving parse and format ergonomics", () => {
    const amount = token.parseAmount("123.4567");

    expect(amount.raw).to.equal(123_456_700n);
    expect(amount.raw.isZero()).to.equal(false);
    expect(amount.raw.gt(123_456_699n)).to.equal(true);
    expect(amount.raw.lt(123_456_701n)).to.equal(true);
    expect(amount.raw.mul(2).div(2).eq(amount.raw)).to.equal(true);
    expect(amount.raw.toNumber()).to.equal(123_456_700);
    expect(amount.toFixed(2)).to.equal("123.45");
    expect(amount.format(2, true)).to.equal("123.45 mUSD");
  });

  it("keeps arithmetic and comparisons compatible with bigint-ish inputs", () => {
    const amount = token.getAmount(1_000n);

    expect(amount.gt(legacyBigNumberLike(999))).to.equal(true);
    expect(amount.gte("1000")).to.equal(true);
    expect(amount.lt(1_001)).to.equal(true);
    expect(amount.eq(token.getAmount(1_000))).to.equal(true);
    expect(amount.add(legacyBigNumberLike(5)).raw).to.equal(1_005n);
    expect(amount.sub("5").raw).to.equal(995n);
    expect(amount.mul(3).raw).to.equal(3_000n);
    expect(amount.div(4).raw).to.equal(250n);
    expect(amount.div(0, true).raw).to.equal(0n);
    expect(amount.satsub(2_000).raw).to.equal(0n);
  });

  it("uses bigint protocol math helpers for token amount math", () => {
    const amount = token.getAmount(1_000_000n);

    expect(amount.bipMul(250).raw).to.equal((1_000_000n * 250n + BIP_BIGINT / 2n) / BIP_BIGINT);
    expect(amount.rayMul(RAY_BIGINT * 2n).raw).to.equal(2_000_000n);
    expect(amount.rayDiv(RAY_BIGINT * 2n).raw).to.equal(500_000n);
    expect(amount.mulDiv(3, 2).raw).to.equal(1_500_000n);
  });

  it("normalizes BigNumber-like objects structurally without ethers runtime helpers", () => {
    const amount = token.getAmount(42n);

    expect(toRawAmount(legacyBigNumberLike(42))).to.equal(42n);
    expect(toRawAmount(amount)).to.equal(42n);
  });
});
