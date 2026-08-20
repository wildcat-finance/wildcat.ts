import { expect } from "chai";
import type { PublicClient } from "viem";
import type { LenderRestorationHooks } from "../../src/access/lender-restoration";
import { prepareLenderRestoration } from "../../src/access/lender-restoration";
import { accessListRoleProviderAbi } from "../../src/abi";
import { encodeFunctionData } from "viem";

const hooksAddress = "0x0000000000000000000000000000000000000010";
const providerAddress = "0x0000000000000000000000000000000000000020";
const lenderA = "0x0000000000000000000000000000000000000011";
const lenderB = "0x0000000000000000000000000000000000000012";

const makeClient = (blocked: Record<string, boolean>) => {
  let getBlockCalls = 0;
  const readCalls: Array<{ lender: string; blockNumber: bigint }> = [];
  const publicClient = {
    getBlock: async () => {
      getBlockCalls += 1;
      return { number: 123n, timestamp: 456n };
    },
    readContract: async ({ args, blockNumber }: { args: [string]; blockNumber: bigint }) => {
      readCalls.push({ lender: args[0], blockNumber });
      return {
        isBlockedFromDeposits: blocked[args[0]] ?? false,
        lastProvider: "0x0000000000000000000000000000000000000000",
        canRefresh: false,
        lastApprovalTimestamp: 0
      };
    }
  } as unknown as PublicClient;
  return {
    publicClient,
    getBlockCalls: () => getBlockCalls,
    readCalls
  };
};

describe("lender restoration planning", () => {
  it("orders provider membership before unblocks selected from stored hook state", async () => {
    const { publicClient, getBlockCalls, readCalls } = makeClient({
      [lenderA]: true,
      [lenderB]: false
    });
    const hooks = {
      address: hooksAddress,
      populateUnblockLender: (lender: string) => ({
        to: hooksAddress,
        data: `unblock:${lender}`,
        value: "0"
      })
    } satisfies LenderRestorationHooks;
    const plan = await prepareLenderRestoration(publicClient, hooks, providerAddress, [
      lenderA,
      lenderB
    ]);

    expect(plan.blockNumber).to.equal(123n);
    expect(plan.blockTimestamp).to.equal(456);
    expect(plan.blockedLenders).to.deep.equal([lenderA]);
    expect(plan.transactions.map(({ data }) => data)).to.deep.equal([
      encodeFunctionData({
        abi: accessListRoleProviderAbi,
        functionName: "addMembers",
        args: [[lenderA, lenderB]]
      }),
      `unblock:${lenderA}`
    ]);
    expect(getBlockCalls()).to.equal(1);
    expect(readCalls).to.deep.equal([
      { lender: lenderA, blockNumber: 123n },
      { lender: lenderB, blockNumber: 123n }
    ]);
  });
});
