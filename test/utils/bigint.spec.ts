import { expect } from "chai";
import { BigNumber } from "ethers";
import { defaultAbiCoder, formatUnits, parseUnits } from "ethers/lib/utils";
import {
  BIP,
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

const toBigintString = (value: BigNumber): string => value.toString();

describe("bigint math helpers", () => {
  it("exposes bigint protocol constants matching the existing BigNumber constants", () => {
    expect(RAY_BIGINT.toString()).to.equal(RAY.toString());
    expect(HALF_RAY_BIGINT.toString()).to.equal(HALF_RAY.toString());
    expect(BIP_BIGINT.toString()).to.equal(BIP.toString());
    expect(HALF_BIP_BIGINT.toString()).to.equal(HALF_BIP.toString());
  });

  it("matches existing rounded ray and bip multiplication semantics", () => {
    const a = BigNumber.from("123456789012345678901234567890");
    const ray = BigNumber.from("1050000000000000000000000000");
    const bips = BigNumber.from(1234);

    expect(rayMulBigint(a.toString(), ray.toString()).toString()).to.equal(
      toBigintString(rayMul(a, ray))
    );
    expect(bipMulBigint(a.toString(), bips.toString()).toString()).to.equal(
      toBigintString(bipMul(a, bips))
    );
  });

  it("matches existing mulDiv, satSub, and linear interest semantics", () => {
    expect(mulDivBigint(12345n, 67890n, 111n).toString()).to.equal(
      toBigintString(mulDiv(BigNumber.from(12345), BigNumber.from(67890), BigNumber.from(111)))
    );
    expect(satSubBigint(5n, 7n).toString()).to.equal(toBigintString(satSub(5, 7)));
    expect(satSubBigint(7n, 5n).toString()).to.equal(toBigintString(satSub(7, 5)));
    expect(bipToRayBigint(345).toString()).to.equal(toBigintString(bipToRay(345)));
    expect(calculateLinearInterestFromBipsBigint(345, 123456).toString()).to.equal(
      toBigintString(calculateLinearInterestFromBips(345, 123456))
    );
  });

  it("uses the intended rounded ray division semantics", () => {
    expect(rayDivBigint(5n, 2n)).to.equal((5n * RAY_BIGINT + 1n) / 2n);
    expect(() => rayDivBigint(1n, 0n)).to.throw("rayDiv: division by zero");
  });

  it("matches ethers fixed-point parse and format behavior", () => {
    const parsed = parseFixedBigint("123.4567", 6);
    expect(parsed.toString()).to.equal(parseUnits("123.4567", 6).toString());
    expect(formatFixedBigint(parsed, 6, 2)).to.equal(formatUnits(parseUnits("123.45", 6), 6));
  });
});

describe("viem encoding helpers", () => {
  it("matches ethers ABI encoding for address and uint256 values", () => {
    const address = "0x0000000000000000000000000000000000000001";
    const value = 123456789n;

    expect(encodeAddressViem(address)).to.equal(defaultAbiCoder.encode(["address"], [address]));
    expect(encodeUint256Viem(value)).to.equal(
      defaultAbiCoder.encode(["uint256"], [value.toString()])
    );
  });
});
