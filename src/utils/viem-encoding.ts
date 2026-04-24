import {
  encodeAbiParameters,
  encodeFunctionData,
  type Abi,
  type Address,
  type EncodeFunctionDataParameters,
  type Hex
} from "viem";
import type { PreparedTransaction, SafeTransactionInput } from "../types";
import { toBigint, type BigintNumberish } from "./bigint";

export const encodeAddressViem = (address: Address): Hex => {
  return encodeAbiParameters([{ type: "address" }], [address]);
};

export const encodeUint256Viem = (value: BigintNumberish): Hex => {
  return encodeAbiParameters([{ type: "uint256" }], [toBigint(value)]);
};

export type PrepareTransactionInput = {
  to: string;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
  value?: BigintNumberish;
};

export const prepareTransaction = ({
  to,
  abi,
  functionName,
  args = [],
  value = 0n
}: PrepareTransactionInput): PreparedTransaction => {
  const data = encodeFunctionData({
    abi,
    functionName,
    args
  } as EncodeFunctionDataParameters);
  return {
    to: to as Address,
    data,
    value: toBigint(value)
  };
};

export const toSafeTransactionInput = ({
  to,
  data,
  value
}: PreparedTransaction): SafeTransactionInput => ({
  to,
  data,
  value: (value ?? 0n).toString()
});
