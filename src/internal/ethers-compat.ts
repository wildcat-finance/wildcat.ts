import { BigNumber } from "ethers";

export const toEthersCompatibleStruct = <Result>(value: unknown): Result => {
  if (typeof value === "bigint") {
    return BigNumber.from(value.toString()) as Result;
  }
  if (Array.isArray(value)) {
    return value.map((item) => toEthersCompatibleStruct(item)) as Result;
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, toEthersCompatibleStruct(entry)])
    ) as Result;
  }
  return value as Result;
};
