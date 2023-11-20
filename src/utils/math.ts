import { BigNumber, constants } from "ethers";

const RAY = BigNumber.from(10).pow(27);
const HALF_RAY = BigNumber.from(10).pow(27).div(2);
const BIP = BigNumber.from(10).pow(4);
const HALF_BIP = BigNumber.from(10).pow(4).div(2);

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

export function satSub(a: BigNumber, b: BigNumber): BigNumber {
  if (a.lt(b)) {
    return BigNumber.from(0);
  }
  return a.sub(b);
}
