import { ApolloClient, DocumentNode, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { providers } from "ethers";
import { SupportedChainId } from "../../src/constants";
import { getMarketsForBorrower } from "../../src/gql";

const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

describe("borrower market queries", () => {
  it("keeps the borrower scope authoritative on list and record queries", async () => {
    const calls: Array<{ query: DocumentNode; variables?: Record<string, unknown> }> = [];
    const client = {
      query: async (args: { query: DocumentNode; variables?: Record<string, unknown> }) => {
        calls.push(args);
        return { data: { markets: [] } };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;
    const borrower = makeAddress(1);
    const otherBorrower = makeAddress(2);
    const signerOrProvider = new providers.JsonRpcProvider();

    for (const shouldSkipRecords of [true, false]) {
      await getMarketsForBorrower(client, {
        borrower: borrower.toUpperCase(),
        chainId: SupportedChainId.Sepolia,
        fetchPolicy: "no-cache",
        signerOrProvider,
        shouldSkipRecords,
        marketFilter: {
          borrower: otherBorrower,
          isClosed: false
        }
      });
    }

    expect(calls).to.have.lengthOf(2);
    calls.forEach(({ variables }) => {
      expect(variables?.marketFilter).to.deep.equal({
        borrower,
        isClosed: false
      });
    });
  });
});
