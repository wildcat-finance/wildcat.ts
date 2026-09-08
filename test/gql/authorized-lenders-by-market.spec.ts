import { ApolloClient, DocumentNode, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { print } from "graphql";
import { getAuthorisedLendersByMarket } from "../../src/gql";
import { makeAddress } from "../helpers/review-fixtures";

type QueryCall = {
  query: DocumentNode;
  variables?: Record<string, unknown>;
  fetchPolicy?: string;
};

const createClient = (market: unknown) => {
  const calls: QueryCall[] = [];
  const client = {
    query: async (args: QueryCall) => {
      calls.push(args);
      return { data: { market } };
    }
  } as unknown as ApolloClient<NormalizedCacheObject>;
  return { client, calls };
};

const options = { market: makeAddress(0xabcd), fetchPolicy: "network-only" as const };

describe("authorized lenders by market", () => {
  it("requests active authorizations and excludes revoked records returned by the source", async () => {
    const activeLender = makeAddress(1);
    const revokedLender = makeAddress(2);
    const otherActiveLender = makeAddress(3);
    const { client, calls } = createClient({
      controller: {
        authorizedLenders: [
          { lender: activeLender, authorized: true },
          { lender: revokedLender, authorized: false },
          { lender: otherActiveLender, authorized: true }
        ]
      }
    });

    const lenders = await getAuthorisedLendersByMarket(client, options);

    expect(lenders).to.deep.equal([activeLender, otherActiveLender]);
    expect(calls).to.have.length(1);
    expect(print(calls[0].query)).to.include("authorizedLenders(where: {authorized: true})");
  });

  it("removes a previously authorized lender after the source reports revocation", async () => {
    const authorization = { lender: makeAddress(1), authorized: true };
    const { client } = createClient({ controller: { authorizedLenders: [authorization] } });

    expect(await getAuthorisedLendersByMarket(client, options)).to.deep.equal([
      authorization.lender
    ]);

    authorization.authorized = false;

    expect(await getAuthorisedLendersByMarket(client, options)).to.deep.equal([]);
  });

  for (const [description, market] of [
    ["missing market", null],
    ["market without a controller", { controller: null }],
    ["empty authorization list", { controller: { authorizedLenders: [] } }]
  ] as const) {
    it(`returns an empty result for a ${description}`, async () => {
      const { client } = createClient(market);

      expect(await getAuthorisedLendersByMarket(client, options)).to.deep.equal([]);
    });
  }
});
