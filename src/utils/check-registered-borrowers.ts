import { defaultAbiCoder } from "ethers/lib/utils";
import { CheckBorrowersRegistered__factory } from "../typechain";
import { SignerOrProvider } from "../types";
import { Deployments, SupportedChainId } from "../constants";

export async function checkRegisteredBorrowers(
  provider: SignerOrProvider,
  chainId: SupportedChainId,
  borrowers: string[]
): Promise<boolean[]> {
  const bytecode = CheckBorrowersRegistered__factory.bytecode.concat(
    defaultAbiCoder
      .encode(["address", "address[]"], [Deployments[chainId].WildcatArchController, borrowers])
      .slice(2)
  );
  const result = await provider.call({ data: bytecode });
  return defaultAbiCoder.decode(["bool[]"], result)[0];
}
