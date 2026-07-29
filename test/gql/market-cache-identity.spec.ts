import { DocumentNode, InMemoryCache } from "@apollo/client";
import { expect } from "chai";
import { print } from "graphql";
import {
  GetIncompleteLenderWithdrawalsForMarketDocument,
  GetLenderAccountForMarketDocument,
  GetLenderWithdrawalsForMarketDocument
} from "../../src/gql/graphql";
import { GetTokenWrapperForMarketDocument } from "../../src/wrapper";

const expectRootMarketIdentity = (document: DocumentNode) => {
  expect(print(document)).to.match(/market\(id: \$market\) {\s+id(?:\s|\n)/);
};

describe("market-scoped GraphQL cache identity", () => {
  it("selects the root market id in every partial market query", () => {
    [
      GetIncompleteLenderWithdrawalsForMarketDocument,
      GetLenderAccountForMarketDocument,
      GetLenderWithdrawalsForMarketDocument,
      GetTokenWrapperForMarketDocument
    ].forEach(expectRootMarketIdentity);
  });

  it("preserves cached wrapper data across account and withdrawal writes", () => {
    const market = "0x0000000000000000000000000000000000000001";
    const lender = "0x0000000000000000000000000000000000000002";
    const cache = new InMemoryCache();
    const wrapperResult = {
      market: {
        __typename: "Market",
        id: market,
        tokenWrapper: null
      }
    };

    cache.writeQuery({
      query: GetTokenWrapperForMarketDocument,
      variables: { market },
      data: wrapperResult
    });
    cache.writeQuery({
      query: GetLenderAccountForMarketDocument,
      variables: { market, lender },
      data: {
        market: {
          __typename: "Market",
          id: market,
          lenders: []
        }
      }
    });
    cache.writeQuery({
      query: GetLenderWithdrawalsForMarketDocument,
      variables: { market, lender },
      data: {
        market: {
          __typename: "Market",
          id: market,
          lenders: []
        }
      }
    });

    expect(
      cache.readQuery({
        query: GetTokenWrapperForMarketDocument,
        variables: { market }
      })
    ).to.deep.equal(wrapperResult);
  });
});
