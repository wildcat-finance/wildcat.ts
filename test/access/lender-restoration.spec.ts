import { expect } from "chai";
import type { PublicClient } from "viem";
import type { LenderRestorationHooks } from "../../src/access/lender-restoration";
import {
  getCredentialTimestamps,
  prepareLenderRestoration,
  timestampAddLenderInputs
} from "../../src/access/lender-restoration";
import type { TimestampedAddLenderInput } from "../../src/types";

const policyAddress = "0x0000000000000000000000000000000000000010";
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
  it("uses chain time for inputs that do not provide a credential timestamp", async () => {
    const { publicClient, getBlockCalls } = makeClient({});

    const inputs = await timestampAddLenderInputs(publicClient, [{ lender: lenderA }]);

    expect(inputs).to.deep.equal([{ lender: lenderA, credentialTimestamp: 456 }]);
    expect(getBlockCalls()).to.equal(1);
  });

  it("does not read a block when all timestamps are already explicit", async () => {
    const { publicClient, getBlockCalls } = makeClient({});

    const inputs = await timestampAddLenderInputs(publicClient, [
      { lender: lenderA, credentialTimestamp: 123 }
    ]);

    expect(inputs).to.deep.equal([{ lender: lenderA, credentialTimestamp: 123 }]);
    expect(getBlockCalls()).to.equal(0);
  });

  it("rejects missing timestamps at the synchronous calldata boundary", () => {
    const missingTimestamp = [{ lender: lenderA }] as TimestampedAddLenderInput[];

    expect(() => getCredentialTimestamps(missingTimestamp)).to.throw(
      "credentialTimestamp must be a non-zero uint32"
    );
  });

  it("orders the grant before unblocks selected from stored onchain state", async () => {
    const { publicClient, getBlockCalls, readCalls } = makeClient({
      [lenderA]: true,
      [lenderB]: false
    });
    const hooks = {
      address: policyAddress,
      populateAddLenders: (inputs: TimestampedAddLenderInput[]) => ({
        to: policyAddress,
        data: `grant:${inputs.map(({ credentialTimestamp }) => credentialTimestamp).join(",")}`,
        value: "0"
      }),
      populateUnblockLender: (lender: string) => ({
        to: policyAddress,
        data: `unblock:${lender}`,
        value: "0"
      })
    } satisfies LenderRestorationHooks;

    const plan = await prepareLenderRestoration(publicClient, hooks, [
      { lender: lenderA },
      { lender: lenderB }
    ]);

    expect(plan.blockNumber).to.equal(123n);
    expect(plan.blockTimestamp).to.equal(456);
    expect(plan.blockedLenders).to.deep.equal([lenderA]);
    expect(plan.transactions.map(({ data }) => data)).to.deep.equal([
      "grant:456,456",
      `unblock:${lenderA}`
    ]);
    expect(getBlockCalls()).to.equal(1);
    expect(readCalls).to.deep.equal([
      { lender: lenderA, blockNumber: 123n },
      { lender: lenderB, blockNumber: 123n }
    ]);
  });
});
