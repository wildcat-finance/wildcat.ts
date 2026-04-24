import { formatUnits, parseUnits } from "viem";

export type BigintNumberish = bigint | number | string;

export const MAX_UINT256_BIGINT = (1n << 256n) - 1n;
export const RAY_BIGINT = 10n ** 27n;
export const HALF_RAY_BIGINT = RAY_BIGINT / 2n;
export const BIP_BIGINT = 10n ** 4n;
export const HALF_BIP_BIGINT = BIP_BIGINT / 2n;
export const BIP_RAY_RATIO_BIGINT = 10n ** 23n;
export const SECONDS_IN_365_DAYS_BIGINT = 31_536_000n;

export const toBigint = (value: BigintNumberish): bigint => {
  if (typeof value === "bigint") {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isInteger(value)) {
      throw new Error(`Can not convert non-integer number to bigint: ${value}`);
    }
    return BigInt(value);
  }
  return BigInt(value);
};

const assertUint256 = (value: bigint, label: string): void => {
  if (value < 0n || value > MAX_UINT256_BIGINT) {
    throw new Error(`${label} is outside uint256 range`);
  }
};

export function rayMulBigint(a: BigintNumberish, b: BigintNumberish): bigint {
  const aBigint = toBigint(a);
  const bBigint = toBigint(b);
  assertUint256(aBigint, "rayMul(a)");
  assertUint256(bBigint, "rayMul(b)");
  if (!(bBigint === 0n || aBigint <= (MAX_UINT256_BIGINT - HALF_RAY_BIGINT) / bBigint)) {
    throw new Error(`rayMul: ${aBigint} * ${bBigint} overflows`);
  }
  return (aBigint * bBigint + HALF_RAY_BIGINT) / RAY_BIGINT;
}

export function bipMulBigint(a: BigintNumberish, b: BigintNumberish): bigint {
  const aBigint = toBigint(a);
  const bBigint = toBigint(b);
  assertUint256(aBigint, "bipMul(a)");
  assertUint256(bBigint, "bipMul(b)");
  if (!(bBigint === 0n || aBigint <= (MAX_UINT256_BIGINT - HALF_BIP_BIGINT) / bBigint)) {
    throw new Error(`bipMul: ${aBigint} * ${bBigint} overflows`);
  }
  return (aBigint * bBigint + HALF_BIP_BIGINT) / BIP_BIGINT;
}

export function rayDivBigint(a: BigintNumberish, b: BigintNumberish): bigint {
  const aBigint = toBigint(a);
  const bBigint = toBigint(b);
  assertUint256(aBigint, "rayDiv(a)");
  assertUint256(bBigint, "rayDiv(b)");
  if (bBigint === 0n) {
    throw new Error("rayDiv: division by zero");
  }
  const halfB = bBigint / 2n;
  if (aBigint > (MAX_UINT256_BIGINT - halfB) / RAY_BIGINT) {
    throw new Error(`rayDiv: ${aBigint} * ${RAY_BIGINT} overflows`);
  }
  return (aBigint * RAY_BIGINT + halfB) / bBigint;
}

export function mulDivBigint(x: BigintNumberish, y: BigintNumberish, d: BigintNumberish): bigint {
  const denominator = toBigint(d);
  if (denominator === 0n) {
    throw new Error("mulDiv: division by zero");
  }
  return (toBigint(x) * toBigint(y)) / denominator;
}

export function satSubBigint(a: BigintNumberish, b: BigintNumberish): bigint {
  const aBigint = toBigint(a);
  const bBigint = toBigint(b);
  return aBigint < bBigint ? 0n : aBigint - bBigint;
}

export function bipToRayBigint(bip: BigintNumberish): bigint {
  return BIP_RAY_RATIO_BIGINT * toBigint(bip);
}

export function calculateLinearInterestFromBipsBigint(
  rateBip: BigintNumberish,
  timeDelta: BigintNumberish
): bigint {
  return (bipToRayBigint(rateBip) * toBigint(timeDelta)) / SECONDS_IN_365_DAYS_BIGINT;
}

const stripTrailingZeroes = (str: string): string => str.replace(/((?<=\.\d+)|(\.))0+$/, "");

export const formatFixedBigint = (
  value: BigintNumberish,
  decimals = 18,
  precision = decimals
): string => {
  let str = formatUnits(toBigint(value), decimals);
  if (str.includes(".") && precision !== decimals) {
    str = str.slice(0, str.indexOf(".") + precision + 1);
  }
  return stripTrailingZeroes(str);
};

export const parseFixedBigint = (value: string | number, decimals = 18): bigint => {
  return parseUnits(value.toString(), decimals);
};
