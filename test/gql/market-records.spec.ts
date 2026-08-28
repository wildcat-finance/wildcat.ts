import { ApolloClient, DocumentNode, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { providers } from "ethers";
import { print } from "graphql";
import { SupportedChainId } from "../../src/constants";
import { getMarketRecords } from "../../src/gql";
import { Market } from "../../src/market";
import { Token } from "../../src/token";

const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

const makeMarket = (): Market => {
  const provider = new providers.JsonRpcProvider();
  const token = new Token(
    SupportedChainId.Sepolia,
    makeAddress(2),
    "USD Coin",
    "USDC",
    6,
    false,
    provider
  );
  return {
    address: makeAddress(1),
    chainId: SupportedChainId.Sepolia,
    marketToken: token,
    underlyingToken: token,
    eventIndex: 12
  } as unknown as Market;
};

const emptyMarketHistory = {
  annualInterestBipsUpdatedRecords: [],
  borrowRecords: [],
  repaymentRecords: [],
  delinquencyRecords: [],
  depositRecords: [],
  forceBuyBackDisabledRecord: null,
  feeCollectionRecords: [],
  fixedTermUpdatedRecords: [],
  periodicTermUpdatedRecords: [],
  periodicTermClosedRecord: null,
  annualInterestBipsReductionProposalRecords: [],
  forceBuyBackRecords: [],
  maxTotalSupplyUpdatedRecords: [],
  withdrawalRequestRecords: [],
  marketClosedEvent: null,
  minimumDepositUpdateRecords: [],
  protocolFeeBipsUpdatedRecords: []
};

describe("V2.5 market withdrawal-execution history", () => {
  it("queries, parses, and orders executions in the typed market-event stream", async () => {
    const market = makeMarket();
    const lender = makeAddress(3);
    const calls: Array<{ query: DocumentNode; variables?: Record<string, unknown> }> = [];
    const client = {
      query: async (args: { query: DocumentNode; variables?: Record<string, unknown> }) => {
        calls.push(args);
        return {
          data: {
            market: {
              ...emptyMarketHistory,
              depositRecords: [
                {
                  __typename: "Deposit",
                  id: "deposit-10",
                  eventIndex: 10,
                  account: { __typename: "LenderAccount", address: lender },
                  assetAmount: "100",
                  scaledAmount: "100",
                  blockNumber: 100,
                  blockTimestamp: 1_700_000_100,
                  transactionHash: makeAddress(4)
                }
              ],
              withdrawalExecutionRecords: [
                {
                  __typename: "WithdrawalExecution",
                  id: "execution-11",
                  eventIndex: 11,
                  account: { __typename: "LenderAccount", address: lender },
                  normalizedAmount: "25",
                  blockNumber: 101,
                  blockTimestamp: 1_700_000_101,
                  transactionHash: makeAddress(5)
                }
              ]
            }
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const records = await getMarketRecords(client, {
      market,
      endEventIndex: 12,
      limit: 5,
      additionalFilter: { eventIndex_gte: 7 }
    });

    expect(calls[0].variables).to.include({
      market: market.address,
      startEventIndex: 7,
      endEventIndex: 12,
      limit: 5
    });
    expect(calls[0].variables?.withdrawalExecutionRecordsFilter).to.deep.equal({
      eventIndex_gte: 7
    });
    expect(print(calls[0].query)).to.include("withdrawalExecutionRecords");
    expect(records.map((record) => record.__typename)).to.deep.equal([
      "WithdrawalExecution",
      "Deposit"
    ]);

    const execution = records[0];
    expect(execution.__typename).to.equal("WithdrawalExecution");
    if (execution.__typename !== "WithdrawalExecution") throw new Error("wrong record kind");
    expect(execution.eventIndex).to.equal(11);
    expect(execution.address).to.equal(lender);
    expect(execution.normalizedAmount.raw).to.equal(25n);
  });

  it("accepts WithdrawalExecution as a market-record kind filter", async () => {
    const market = makeMarket();
    const client = {
      query: async () => ({
        data: {
          market: {
            ...emptyMarketHistory,
            withdrawalExecutionRecords: [
              {
                __typename: "WithdrawalExecution",
                id: "execution-11",
                eventIndex: 11,
                account: { __typename: "LenderAccount", address: makeAddress(3) },
                normalizedAmount: "25",
                blockNumber: 101,
                blockTimestamp: 1_700_000_101,
                transactionHash: makeAddress(5)
              }
            ]
          }
        }
      })
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const records = await getMarketRecords(client, {
      market,
      kinds: ["WithdrawalExecution"]
    });

    expect(records.map((record) => record.__typename)).to.deep.equal(["WithdrawalExecution"]);
  });
});
