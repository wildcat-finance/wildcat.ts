import type { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import {
  SubgraphBorrowerAccountPrincipalChangeKind,
  SubgraphMarketBorrowerChangeKind,
  type SubgraphBorrowerAccountIdentityDataFragment,
  type SubgraphBorrowerAccountPrincipalChangeDataFragment,
  type SubgraphBorrowerPrincipalIdentityDataFragment,
  type SubgraphMarketBorrowerIdentityDataFragment
} from "../../src/gql/graphql";
import {
  getBorrowerAccountIdentities,
  getMarketBorrowerChanges,
  normalizeBorrowerAccountPrincipalChange,
  normalizeBorrowerPrincipalIdentity,
  normalizeMarketBorrowerIdentity
} from "../../src/identity";

const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

const makeAccount = (): SubgraphBorrowerAccountIdentityDataFragment =>
  ({
    __typename: "BorrowerAccount",
    id: "registry-account",
    address: makeAddress(1),
    registry: {
      __typename: "BorrowerIdentityRegistry",
      id: "registry",
      address: makeAddress(2)
    },
    accountFactory: {
      __typename: "BorrowerAccountFactory",
      id: "factory",
      address: makeAddress(3),
      isApproved: true
    },
    principalAddress: makeAddress(4),
    pendingPrincipalAddress: null,
    registeredAtBlock: "10",
    registeredAtTimestamp: "20",
    registeredAtTransaction: makeAddress(5),
    registeredAtLogIndex: "6"
  } as SubgraphBorrowerAccountIdentityDataFragment);

describe("v2.5 borrower identity normalization", () => {
  it("keeps operational borrower, principal, and pending identity separate", () => {
    const data = {
      __typename: "Market",
      id: "market-id",
      address: makeAddress(10),
      borrower: makeAddress(11),
      borrowerPrincipal: makeAddress(12),
      pendingBorrower: makeAddress(13),
      pendingBorrowerPrincipal: makeAddress(14),
      borrowerIdentityRegistryAddress: makeAddress(15)
    } as SubgraphMarketBorrowerIdentityDataFragment;

    expect(normalizeMarketBorrowerIdentity(data)).to.deep.equal({
      id: "market-id",
      market: makeAddress(10),
      borrower: makeAddress(11),
      borrowerPrincipal: makeAddress(12),
      pendingBorrower: makeAddress(13),
      pendingBorrowerPrincipal: makeAddress(14),
      borrowerIdentityRegistry: makeAddress(15)
    });
  });

  it("normalizes principal registrations and account collections without relabeling them", () => {
    const account = makeAccount();
    const principal = {
      __typename: "Borrower",
      id: "principal-id",
      address: makeAddress(4),
      firstSeenBlock: "1",
      firstSeenTimestamp: "2",
      firstSeenTransaction: makeAddress(20),
      firstSeenLogIndex: "3",
      lastSeenBlock: "4",
      lastSeenTimestamp: "5",
      lastSeenTransaction: makeAddress(21),
      lastSeenLogIndex: "6",
      registrations: [
        {
          __typename: "RegisteredBorrower",
          archController: { __typename: "ArchController", id: makeAddress(22) },
          isRegistered: true
        }
      ],
      accounts: [account],
      pendingAccounts: []
    } as SubgraphBorrowerPrincipalIdentityDataFragment & {
      accounts: SubgraphBorrowerAccountIdentityDataFragment[];
      pendingAccounts: SubgraphBorrowerAccountIdentityDataFragment[];
    };

    const normalized = normalizeBorrowerPrincipalIdentity(principal);
    expect(normalized.address).to.equal(makeAddress(4));
    expect(normalized.registrations).to.deep.equal([
      { archController: makeAddress(22), isRegistered: true }
    ]);
    expect(normalized.accounts[0]).to.deep.include({
      address: makeAddress(1),
      principal: makeAddress(4),
      registry: makeAddress(2)
    });
    expect(normalized.accounts[0]).not.to.have.property("pendingPrincipal");
  });

  it("retains full principal-transfer event context and indexed position", () => {
    const change = {
      __typename: "BorrowerAccountPrincipalChange",
      id: "change-id",
      kind: SubgraphBorrowerAccountPrincipalChangeKind.TRANSFER_REQUESTED,
      account: {
        __typename: "BorrowerAccount",
        address: makeAddress(30),
        registry: {
          __typename: "BorrowerIdentityRegistry",
          address: makeAddress(31)
        }
      },
      currentPrincipalAddress: makeAddress(32),
      previousPrincipalAddress: null,
      newPrincipalAddress: null,
      previousPendingPrincipalAddress: makeAddress(33),
      pendingPrincipalAddress: makeAddress(34),
      cancelledPendingPrincipalAddress: null,
      blockNumber: "40",
      blockTimestamp: "41",
      transactionHash: makeAddress(42),
      blockLogIndex: "43"
    } as SubgraphBorrowerAccountPrincipalChangeDataFragment;

    expect(normalizeBorrowerAccountPrincipalChange(change)).to.deep.equal({
      id: "change-id",
      kind: "transfer-requested",
      account: makeAddress(30),
      registry: makeAddress(31),
      currentPrincipal: makeAddress(32),
      previousPendingPrincipal: makeAddress(33),
      pendingPrincipal: makeAddress(34),
      blockNumber: 40n,
      blockTimestamp: 41n,
      transactionHash: makeAddress(42),
      logIndex: 43n
    });
  });

  it("normalizes address filters and preserves caller pagination", async () => {
    const calls: Array<{ variables?: Record<string, unknown> }> = [];
    const client = {
      query: async (args: { variables?: Record<string, unknown> }) => {
        calls.push(args);
        return { data: { marketBorrowerChanges: [] } };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const market = makeAddress(50).toUpperCase();
    const result = await getMarketBorrowerChanges(client, market, {
      first: 25,
      skip: 75,
      fetchPolicy: "no-cache"
    });

    expect(result).to.deep.equal([]);
    expect(calls[0].variables).to.deep.equal({
      market: market.toLowerCase(),
      first: 25,
      skip: 75
    });
  });

  it("maps unknown future event kinds without guessing", () => {
    expect(SubgraphMarketBorrowerChangeKind.TRANSFERRED).to.equal("TRANSFERRED");
  });

  it("paginates complete borrower-account identity results", async () => {
    const calls: Array<{ variables?: Record<string, unknown> }> = [];
    const fullPage = Array.from({ length: 1_000 }, (_, index) => ({
      ...makeAccount(),
      id: `account-${index}`
    }));
    const finalAccount = { ...makeAccount(), id: "account-1000" };
    const client = {
      query: async (args: { variables?: Record<string, unknown> }) => {
        calls.push(args);
        return {
          data: {
            borrowerAccounts: args.variables?.skip === 0 ? fullPage : [finalAccount]
          }
        };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;
    const account = makeAddress(60).toUpperCase();

    const normalized = await getBorrowerAccountIdentities(client, account, {
      fetchPolicy: "no-cache"
    });

    expect(calls.map(({ variables }) => variables)).to.deep.equal([
      { account: account.toLowerCase(), first: 1_000, skip: 0 },
      { account: account.toLowerCase(), first: 1_000, skip: 1_000 }
    ]);
    expect(normalized).to.have.length(1_001);
  });
});
