import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { providers } from "ethers";
import { SupportedChainId } from "../../src/constants";
import { getIndexedMarketList } from "../../src/gql";
import {
  SubgraphMarketKind,
  SubgraphMarket_OrderBy,
  SubgraphOrderDirection
} from "../../src/gql/graphql";

const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

describe("indexed market discovery", () => {
  it("maps SDK-owned filters and pagination to Graph transport variables", async () => {
    const calls: Array<{ variables?: Record<string, unknown> }> = [];
    const client = {
      query: async (args: { variables?: Record<string, unknown> }) => {
        calls.push(args);
        return { data: { markets: [] } };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const result = await getIndexedMarketList(client, {
      chainId: SupportedChainId.Sepolia,
      signerOrProvider: new providers.JsonRpcProvider(),
      filter: {
        addresses: [makeAddress(1).toUpperCase()],
        excludeAddresses: [makeAddress(2).toUpperCase()],
        borrower: makeAddress(3).toUpperCase(),
        asset: makeAddress(4).toUpperCase(),
        marketKinds: ["standard", "revolving", "unknown"],
        isClosed: false,
        isRegistered: true
      },
      first: 25,
      skip: 50,
      orderBy: "createdAtBlock",
      direction: "asc",
      fetchPolicy: "no-cache"
    });

    expect(result).to.deep.equal([]);
    expect(calls[0].variables).to.deep.equal({
      marketFilter: {
        address_in: [makeAddress(1)],
        address_not_in: [makeAddress(2)],
        borrower: makeAddress(3),
        asset: makeAddress(4),
        marketKind_in: [
          SubgraphMarketKind.STANDARD,
          SubgraphMarketKind.REVOLVING,
          SubgraphMarketKind.UNKNOWN
        ],
        isClosed: false,
        isRegistered: true
      },
      numMarkets: 25,
      skipMarkets: 50,
      orderMarkets: SubgraphMarket_OrderBy.createdAtBlock,
      directionMarkets: SubgraphOrderDirection.asc
    });
  });
});
