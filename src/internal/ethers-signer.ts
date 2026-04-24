import type { Signer } from "../types";

type EthersSignerLike = {
  _isSigner?: unknown;
};

export const isEthersSigner = (value: unknown): value is Signer => {
  return (
    value !== null && typeof value === "object" && (value as EthersSignerLike)._isSigner === true
  );
};

export const getEthersSignerAddress = async (value: unknown): Promise<string | undefined> => {
  return isEthersSigner(value) ? value.getAddress() : undefined;
};
