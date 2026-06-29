import type { Hash, TransactionReceipt } from "viem";
import { getViemPublicClientFromEthers } from "./ethers-viem";
import type {
  PreparedTransaction,
  Signer,
  SignerOrProvider,
  SubmittedTransaction,
  TransactionHash
} from "../types";

const createTransactionHash = (transaction: SubmittedTransaction): TransactionHash => {
  return Object.defineProperties(new String(transaction.hash), {
    hash: {
      value: transaction.hash
    },
    wait: {
      value: transaction.wait
    },
    [Symbol.toPrimitive]: {
      value: () => transaction.hash
    }
  }) as unknown as TransactionHash;
};

export const submitPreparedTransaction = async (
  signer: Signer,
  transaction: PreparedTransaction
): Promise<TransactionHash> => {
  const response = await signer.sendTransaction({
    to: transaction.to,
    data: transaction.data,
    value: transaction.value === undefined ? undefined : transaction.value.toString()
  });
  const hash = response.hash as Hash;
  return createTransactionHash({
    hash,
    wait: async () => {
      if (response.wait) {
        return response.wait() as Promise<TransactionReceipt>;
      }
      return waitForSubmittedTransactionReceipt(signer.provider ?? signer, hash);
    }
  });
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
): Promise<{ hash: Hash; receipt: TransactionReceipt; transaction: SubmittedTransaction }> => {
  const submittedTransaction = await submitPreparedTransaction(signer, transaction);
  const hash = submittedTransaction.hash;
  const receipt = await waitForSubmittedTransactionReceipt(provider, hash);
  return {
    hash,
    receipt,
    transaction: submittedTransaction
  };
};
