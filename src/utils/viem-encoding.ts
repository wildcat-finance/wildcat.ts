import { encodeAbiParameters, type Address, type Hex } from "viem";
import { toBigint, type BigintNumberish } from "./bigint";

export const encodeAddressViem = (address: Address): Hex => {
  return encodeAbiParameters([{ type: "address" }], [address]);
};

export const encodeUint256Viem = (value: BigintNumberish): Hex => {
  return encodeAbiParameters([{ type: "uint256" }], [toBigint(value)]);
};
