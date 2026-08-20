import { expect } from "chai";
import { providers } from "ethers";
import { decodeFunctionData, encodeFunctionResult, getAddress, type Abi } from "viem";
import { accessListRoleProviderAbi } from "../../src/abi";
import {
  getAccessListRoleProviderMembers,
  getLiveRoleProviderAdministrator
} from "../../src/authority";

type FakeRpcCall = {
  to?: string;
  data?: string;
};

class FakeViemProvider {
  calls: FakeRpcCall[] = [];
  private readonly getResponse: (call: FakeRpcCall) => string;

  constructor(getResponse: (call: FakeRpcCall) => string) {
    this.getResponse = getResponse;
  }

  async send(method: string, params: unknown[] = []): Promise<unknown> {
    if (method === "eth_chainId") return "0xaa36a7";
    if (method !== "eth_call") throw new Error(`Unexpected RPC method: ${method}`);

    const call = params[0] as FakeRpcCall;
    this.calls.push(call);
    return this.getResponse(call);
  }
}

const makeAddress = (suffix: number): `0x${string}` =>
  getAddress(`0x${suffix.toString(16).padStart(40, "0")}`);

const encodeResult = (functionName: string, result: unknown): `0x${string}` =>
  encodeFunctionResult({
    abi: accessListRoleProviderAbi as Abi,
    functionName,
    result
  });

describe("v2.5 role-provider on-chain reads", () => {
  it("selects full and paginated member overloads from their arguments", async () => {
    const providerAddress = makeAddress(1);
    const members = [makeAddress(2), makeAddress(3)];
    const seenArgs: Array<readonly unknown[]> = [];
    const provider = new FakeViemProvider((call) => {
      expect(call.to).to.equal(providerAddress);
      const decoded = decodeFunctionData({
        abi: accessListRoleProviderAbi as Abi,
        data: call.data as `0x${string}`
      });
      expect(decoded.functionName).to.equal("getMembers");
      seenArgs.push(decoded.args ?? []);
      return encodeResult("getMembers", members);
    });

    expect(
      await getAccessListRoleProviderMembers(
        provider as unknown as providers.Provider,
        providerAddress
      )
    ).to.deep.equal(members);
    expect(
      await getAccessListRoleProviderMembers(
        provider as unknown as providers.Provider,
        providerAddress,
        0,
        2
      )
    ).to.deep.equal(members);
    expect(seenArgs).to.deep.equal([[], [0n, 2n]]);
  });

  it("requires complete pagination bounds and preserves pending administration", async () => {
    const providerAddress = makeAddress(10);
    const administrator = makeAddress(11);
    const pendingAdministrator = makeAddress(12);
    const provider = new FakeViemProvider((call) => {
      const decoded = decodeFunctionData({
        abi: accessListRoleProviderAbi as Abi,
        data: call.data as `0x${string}`
      });
      if (decoded.functionName === "administrator") {
        return encodeResult(decoded.functionName, administrator);
      }
      expect(decoded.functionName).to.equal("pendingAdministrator");
      return encodeResult(decoded.functionName, pendingAdministrator);
    });

    expect(() =>
      getAccessListRoleProviderMembers(
        provider as unknown as providers.Provider,
        providerAddress,
        0
      )
    ).to.throw("Both start and end are required");
    expect(
      await getLiveRoleProviderAdministrator(
        provider as unknown as providers.Provider,
        providerAddress
      )
    ).to.deep.equal({ administrator, pendingAdministrator });
  });
});
