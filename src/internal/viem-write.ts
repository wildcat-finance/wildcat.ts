import type { Hash, TransactionReceipt } from "viem";
import { getViemPublicClientFromEthers } from "./ethers-viem";
import type { PreparedTransaction, Signer, SignerOrProvider } from "../types";

export const submitPreparedTransaction = async (
  signer: Signer,
  transaction: PreparedTransaction
): Promise<Hash> => {
  const response = await signer.sendTransaction({
    to: transaction.to,
    data: transaction.data,
    value: transaction.value === undefined ? undefined : transaction.value.toString()
  });
  return response.hash as Hash;
};

export const waitForSubmittedTransactionReceipt = (
  provider: SignerOrProvider,
  hash: Hash
): Promise<TransactionReceipt> => {
  return getViemPublicClientFromEthers(provider).waitForTransactionReceipt({ hash });
};

export const submitPreparedTransactionAndWait = async (
  provider: SignerOrProvider,
  signer: Signer,
  transaction: PreparedTransaction
): Promise<{ hash: Hash; receipt: TransactionReceipt }> => {
  const hash = await submitPreparedTransaction(signer, transaction);
  const receipt = await waitForSubmittedTransactionReceipt(provider, hash);
  return { hash, receipt };
};
