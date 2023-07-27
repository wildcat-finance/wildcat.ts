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
