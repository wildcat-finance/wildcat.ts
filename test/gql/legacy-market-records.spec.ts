import { ApolloClient, DocumentNode, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { providers } from "ethers";
import { getOperationAST, print } from "graphql";
import { SupportedChainId } from "../../src/constants";
import { getMarketRecords } from "../../src/gql";
import { Market } from "../../src/market";
import { Token } from "../../src/token";

const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

describe("legacy market-record routing", () => {
  it("omits V2.5-only event fields and filters on legacy chains", async () => {
    const provider = new providers.JsonRpcProvider();
    const marketAddress = makeAddress(1);
    const token = new Token(
      SupportedChainId.Mainnet,
      makeAddress(2),
      "USD Coin",
      "USDC",
      6,
      false,
      provider
    );
    const market = {
      address: marketAddress,
      chainId: SupportedChainId.Mainnet,
      marketToken: token,
      underlyingToken: token,
      eventIndex: 42
    } as unknown as Market;
    const calls: Array<{ query: DocumentNode; variables?: Record<string, unknown> }> = [];
    const client = {
      query: async (args: { query: DocumentNode; variables?: Record<string, unknown> }) => {
        calls.push(args);
        return {
          data: {
            market: {
              annualInterestBipsUpdatedRecords: [],
              borrowRecords: [],
              repaymentRecords: [],
              delinquencyRecords: [],
              depositRecords: [],
              forceBuyBackDisabledRecord: null,
              feeCollectionRecords: [],
              fixedTermUpdatedRecords: [],
              forceBuyBackRecords: [],
              maxTotalSupplyUpdatedRecords: [],
              withdrawalRequestRecords: [],
              marketClosedEvent: null,
              minimumDepositUpdateRecords: [],
              protocolFeeBipsUpdatedRecords: []
            }
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const records = await getMarketRecords(client, { market });

    expect(records).to.deep.equal([]);
    expect(getOperationAST(calls[0].query)?.name?.value).to.equal("legacyGetMarketEvents");
    expect(calls[0].variables).not.to.have.property("periodicTermUpdatedRecordsFilter");
    expect(calls[0].variables).not.to.have.property(
      "annualInterestBipsReductionProposalRecordsFilter"
    );
    expect(calls[0].variables).not.to.have.property("withdrawalExecutionRecordsFilter");
    expect(print(calls[0].query)).not.to.include("withdrawalExecutionRecords");
  });
});
