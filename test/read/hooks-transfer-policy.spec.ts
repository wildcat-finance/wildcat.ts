import { expect } from "chai";
import { providers } from "ethers";
import { decodeFunctionData, encodeFunctionResult, getAddress, type Abi } from "viem";
import { iOpenTermHooksAbi } from "../../src/abi";
import { OpenTermHooks, OpenTermHooksTemplate } from "../../src/access";
import { SupportedChainId } from "../../src/constants";

type FakeRpcCall = {
  to?: string;
  data?: string;
};

class FakeViemProvider {
  async send(method: string, params: unknown[] = []): Promise<unknown> {
    if (method === "eth_chainId") return "0xaa36a7";
    if (method !== "eth_call") throw new Error(`Unexpected RPC method: ${method}`);

    const call = params[0] as FakeRpcCall;
    expect(call.to).to.equal(hooksAddress);
    const decoded = decodeFunctionData({
      abi: iOpenTermHooksAbi as Abi,
      data: call.data as `0x${string}`
    });
    expect(decoded.functionName).to.equal("isMarketTransferRecipientAllowed");
    expect(decoded.args).to.deep.equal([marketAddress, recipient]);
    return encodeFunctionResult({
      abi: iOpenTermHooksAbi as Abi,
      functionName: decoded.functionName,
      result: true
    });
  }
}

const hooksAddress = getAddress("0x0000000000000000000000000000000000000001");
const marketAddress = getAddress("0x0000000000000000000000000000000000000002");
const recipient = getAddress("0x0000000000000000000000000000000000000003");
const administrator = getAddress("0x0000000000000000000000000000000000000004");

describe("v2.5 hook transfer-policy reads", () => {
  it("reads current recipient readiness from the hook instance", async () => {
    const hooks = new OpenTermHooks({
      chainId: SupportedChainId.Sepolia,
      provider: new FakeViemProvider() as unknown as providers.Provider,
      address: hooksAddress,
      hooksTemplate: {} as OpenTermHooksTemplate,
      borrower: administrator,
      administrator,
      name: "OpenTermHooks"
    });

    expect(await hooks.isMarketTransferRecipientAllowed(marketAddress, recipient)).to.equal(true);
  });
});
