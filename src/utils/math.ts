import { BigNumber, BigNumberish, constants } from "ethers";

export const RAY = BigNumber.from(10).pow(27);
export const HALF_RAY = BigNumber.from(10).pow(27).div(2);
export const BIP = BigNumber.from(10).pow(4);
export const HALF_BIP = BigNumber.from(10).pow(4).div(2);
export const BIP_RAY_RATIO = BigNumber.from(10).pow(23);
export const SECONDS_IN_365_DAYS = 31536000;

export function rayMul(a: BigNumber, b: BigNumber): BigNumber {
  if (!(b.eq(0) || a.lte(constants.MaxUint256.sub(HALF_RAY).div(b)))) {
    throw Error(`rayMul: ${a} * ${b} overflows`);
  }
  return a.mul(b).add(HALF_RAY).div(RAY);
}

export function bipMul(a: BigNumber, b: BigNumber): BigNumber {
  if (!(b.eq(0) || a.lte(constants.MaxUint256.sub(HALF_BIP).div(b)))) {
    throw Error(`bipMul: ${a} * ${b} overflows`);
  }
  return a.mul(b).add(HALF_BIP).div(BIP);
}

export function rayDiv(a: BigNumber, b: BigNumber): BigNumber {
  const halfB = b.div(2);
  if (b.eq(0) || a.lte(constants.MaxUint256.sub(halfB).div(RAY))) {
    throw Error(`rayDiv: ${a} * ${b} overflows`);
  }
  return a.mul(RAY).add(halfB).div(b);
}

export function mulDiv(x: BigNumber, y: BigNumber, d: BigNumber): BigNumber {
  return x.mul(y).div(d);
}

export function satSub(a: BigNumberish, b: BigNumberish): BigNumber {
  a = BigNumber.from(a);
  b = BigNumber.from(b);
  if (a.lt(b)) {
    return BigNumber.from(0);
  }
  return a.sub(b);
}

export function bipToRay(bip: number): BigNumber {
  return BIP_RAY_RATIO.mul(bip);
}

export function calculateLinearInterestFromBips(rateBip: number, timeDelta: number): BigNumber {
  return bipToRay(rateBip).mul(timeDelta).div(SECONDS_IN_365_DAYS);
}
