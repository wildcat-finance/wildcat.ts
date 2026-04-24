import { decodeAbiParameters, encodeAbiParameters, type Address, type Hex } from "viem";
import { CheckBorrowersRegistered__factory } from "../typechain";
import { SignerOrProvider } from "../types";
import { Deployments, SupportedChainId } from "../constants";

export async function checkRegisteredBorrowers(
  provider: SignerOrProvider,
  chainId: SupportedChainId,
  borrowers: string[]
): Promise<boolean[]> {
  const bytecode = CheckBorrowersRegistered__factory.bytecode.concat(
    encodeAbiParameters(
      [{ type: "address" }, { type: "address[]" }],
      [Deployments[chainId].WildcatArchController as Address, borrowers as Address[]]
    ).slice(2)
  );
  const result = await provider.call({ data: bytecode });
  return [...decodeAbiParameters([{ type: "bool[]" }], result as Hex)[0]];
}
