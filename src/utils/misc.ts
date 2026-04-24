import { encodeAbiParameters, formatUnits, type Address, type Hex } from "viem";
import { toBigint, type BigintNumberish } from "./bigint";

export const encodeAddress = (address: string): Hex => {
  return encodeAbiParameters([{ type: "address" }], [address as Address]);
};

export const encodeUint = (expiry: BigintNumberish): Hex => {
  return encodeAbiParameters([{ type: "uint256" }], [toBigint(expiry)]);
};

export const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr));

export type OnlyValueFields<C> = {
  [K in ValueFields<C, keyof C>]: C[K];
};

export type ValueFields<C, K extends keyof C> = K extends string
  ? K extends keyof C
    ? C[K] extends (...args: any[]) => any
      ? never
      : K
    : never
  : never;

// type Keys<C> = keyof OnlyValueFields<C> & string;

export function updateValue<O, K extends keyof O>(obj: O, otherObj: O, key: K): void {
  obj[key] = otherObj[key];
}

export function updateObject<O>(obj: O, otherObj: O, keys: Array<keyof O>): void {
  for (const key of keys) {
    updateValue(obj, otherObj, key);
  }
}

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const stripTrailingZeroes = (str: string): string => str.replace(/((?<=\.\d+)|(\.))0+$/, "");

export const formatBnFixed = (
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
