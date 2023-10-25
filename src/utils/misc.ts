import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { defaultAbiCoder } from "ethers/lib/utils";

export const encodeAddress = (address: string): string => {
  return defaultAbiCoder.encode(["address"], [address]);
};

export const encodeUint = (expiry: number): string => {
  return defaultAbiCoder.encode(["uint256"], [expiry]);
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

export const formatBnFixed = (bn: BigNumber, decimals = 18, precision = decimals): string => {
  let str = formatUnits(bn, decimals);
  if (str.includes(".") && precision !== decimals) {
    str = str.slice(0, str.indexOf(".") + precision + 1);
  }
  return stripTrailingZeroes(str);
};
