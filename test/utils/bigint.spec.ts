import { expect } from "chai";
import {
  BIP,
  BIP_RAY_RATIO,
  bipMul,
  bipToRay,
  calculateLinearInterestFromBips,
  HALF_BIP,
  HALF_RAY,
  mulDiv,
  rayMul,
  RAY,
  satSub
} from "../../src/utils/math";
import {
  BIP_BIGINT,
  bipMulBigint,
  bipToRayBigint,
  calculateLinearInterestFromBipsBigint,
  encodeAddressViem,
  encodeUint256Viem,
  formatFixedBigint,
  HALF_BIP_BIGINT,
  HALF_RAY_BIGINT,
  mulDivBigint,
  parseFixedBigint,
  rayDivBigint,
  rayMulBigint,
  RAY_BIGINT,
  satSubBigint
} from "../../src/utils";

describe("bigint math helpers", () => {
  it("exposes bigint protocol constants through both current and legacy names", () => {
    expect(RAY_BIGINT).to.equal(10n ** 27n);
    expect(HALF_RAY_BIGINT).to.equal(RAY_BIGINT / 2n);
    expect(BIP_BIGINT).to.equal(10n ** 4n);
    expect(HALF_BIP_BIGINT).to.equal(BIP_BIGINT / 2n);
    expect(RAY).to.equal(RAY_BIGINT);
    expect(HALF_RAY).to.equal(HALF_RAY_BIGINT);
    expect(BIP).to.equal(BIP_BIGINT);
    expect(HALF_BIP).to.equal(HALF_BIP_BIGINT);
  });

  it("uses rounded ray and bip multiplication semantics", () => {
    const a = 123456789012345678901234567890n;
    const ray = 1050000000000000000000000000n;
    const bips = 1234n;

    expect(rayMulBigint(a, ray)).to.equal((a * ray + HALF_RAY_BIGINT) / RAY_BIGINT);
    expect(rayMul(a, ray)).to.equal(rayMulBigint(a, ray));
    expect(bipMulBigint(a, bips)).to.equal((a * bips + HALF_BIP_BIGINT) / BIP_BIGINT);
    expect(bipMul(a, bips)).to.equal(bipMulBigint(a, bips));
  });

  it("uses bigint mulDiv, satSub, and linear interest semantics", () => {
    expect(mulDivBigint(12345n, 67890n, 111n)).to.equal((12345n * 67890n) / 111n);
    expect(mulDiv(12345n, 67890n, 111n)).to.equal(mulDivBigint(12345n, 67890n, 111n));
    expect(satSubBigint(5n, 7n)).to.equal(0n);
    expect(satSub(5, 7)).to.equal(0n);
    expect(satSubBigint(7n, 5n)).to.equal(2n);
    expect(satSub(7, 5)).to.equal(2n);
    expect(bipToRayBigint(345)).to.equal(BIP_RAY_RATIO * 345n);
    expect(bipToRay(345)).to.equal(bipToRayBigint(345));
    expect(calculateLinearInterestFromBipsBigint(345, 123456)).to.equal(
      (bipToRayBigint(345) * 123456n) / 31_536_000n
    );
    expect(calculateLinearInterestFromBips(345, 123456)).to.equal(
      calculateLinearInterestFromBipsBigint(345, 123456)
    );
  });

  it("uses the intended rounded ray division semantics", () => {
    expect(rayDivBigint(5n, 2n)).to.equal((5n * RAY_BIGINT + 1n) / 2n);
    expect(() => rayDivBigint(1n, 0n)).to.throw("rayDiv: division by zero");
  });

  it("parses and formats fixed-point decimal values", () => {
    const parsed = parseFixedBigint("123.4567", 6);
    expect(parsed).to.equal(123_456_700n);
    expect(formatFixedBigint(parsed, 6, 2)).to.equal("123.45");
  });
});

describe("viem encoding helpers", () => {
  it("ABI-encodes address and uint256 values", () => {
    const address = "0x0000000000000000000000000000000000000001";
    const value = 123456789n;

    expect(encodeAddressViem(address)).to.equal(
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    );
    expect(encodeUint256Viem(value)).to.equal(
      "0x00000000000000000000000000000000000000000000000000000000075bcd15"
    );
  });
});
