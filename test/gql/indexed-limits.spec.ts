import { rejects } from "assert";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { HooksInstance } from "../../src/access";
import { getHookAuthority, getRoleProviderAuthority } from "../../src/authority";
import { SupportedChainId } from "../../src/constants";
import {
  getHooksFactories,
  getHooksTemplateRegistrations,
  getIncompleteLenderWithdrawalsForMarket,
  getIncompleteWithdrawalsForMarket,
  getLenderWithdrawalsForMarket,
  getPolicyAccessListMembers
} from "../../src/gql";
import { getAllPendingWithdrawalBatchesForMarket } from "../../src/gql/getAllPendingWithdrawalBatchesForMarket";
import { getBorrowerAccountIdentities, getBorrowerPrincipalIdentity } from "../../src/identity";
import { IndexedTraversalOptions } from "../../src/indexed-pagination";
import { Market } from "../../src/market";
import { withWatchQuery } from "../helpers/watch-query-client";

const address = `0x${"1".repeat(40)}`;
const market = { address, chainId: SupportedChainId.Sepolia } as Market;
const hooks = {
  roleProviders: [
    { providerAddress: address, kind: "access-list", isApproved: true, isPullProvider: true }
  ]
} as HooksInstance;
type Client = ApolloClient<NormalizedCacheObject>;
type Reader = (client: Client, options: IndexedTraversalOptions) => Promise<unknown>;
const rows = [{ id: "a" }, { id: "b" }];
const cases: Array<{ name: string; data: object; read: Reader }> = [
  { name: "factories", data: { hooksFactories: rows }, read: getHooksFactories },
  {
    name: "template registrations",
    data: { hooksTemplateRegistrations: rows },
    read: getHooksTemplateRegistrations
  },
  {
    name: "hook authority",
    data: { hooksInstance: { providers: rows } },
    read: (client, options) => getHookAuthority(client, address, options)
  },
  {
    name: "provider authority",
    data: { roleProviderInstance: { attachments: [], members: rows, rootChanges: [] } },
    read: (client, options) => getRoleProviderAuthority(client, address, options)
  },
  {
    name: "principal identity",
    data: { borrower: { accounts: [], pendingAccounts: rows } },
    read: (client, options) => getBorrowerPrincipalIdentity(client, address, options)
  },
  {
    name: "account identities",
    data: { borrowerAccounts: rows },
    read: (client, options) => getBorrowerAccountIdentities(client, address, options)
  },
  {
    name: "policy members",
    data: { roleProviderMembers: rows },
    read: (client, options) => getPolicyAccessListMembers(client, hooks, options)
  },
  {
    name: "incomplete batches",
    data: { market: { withdrawalBatches: rows } },
    read: (client, options) => getIncompleteWithdrawalsForMarket(client, { market, ...options })
  },
  {
    name: "pending batches",
    data: { market: { withdrawalBatches: rows } },
    read: (client, options) =>
      getAllPendingWithdrawalBatchesForMarket(client, market, "no-cache", options)
  },
  {
    name: "incomplete lender history",
    data: { market: { lenders: [{ incompleteWithdrawals: rows }] } },
    read: (client, options) =>
      getIncompleteLenderWithdrawalsForMarket(client, { market, lender: address, ...options })
  },
  {
    name: "lender history",
    data: { market: { lenders: [{ incompleteWithdrawals: [], completeWithdrawals: rows }] } },
    read: (client, options) =>
      getLenderWithdrawalsForMarket(client, { market, lender: address, ...options })
  }
];

describe("public indexed traversal limits", () => {
  for (const { name, data, read } of cases) {
    it(`enforces the caller's entry allowance for ${name}`, async () => {
      let requests = 0;
      const client = withWatchQuery({
        query: async () => {
          requests++;
          return { data };
        }
      } as unknown as Client);
      await rejects(read(client, { limits: { maxItems: 1 } }), { code: "ITEM_LIMIT" });
      expect(requests).to.equal(1);
    });
  }

  for (const name of ["hook authority", "provider authority", "principal identity"]) {
    it(`rejects a repeated full page in ${name}`, async () => {
      const page = Array.from({ length: 1_000 }, (_, i) => ({ id: String(i) }));
      const data =
        name === "hook authority"
          ? { hooksInstance: { providers: page } }
          : name === "provider authority"
          ? { roleProviderInstance: { attachments: [], members: [], rootChanges: page } }
          : { borrower: { accounts: page, pendingAccounts: [] } };
      let requests = 0;
      const client = withWatchQuery({
        query: async () => {
          requests++;
          return { data };
        }
      } as unknown as Client);
      await rejects(cases.find((entry) => entry.name === name)!.read(client, {}), {
        code: "INVALID_PAGE"
      });
      expect(requests).to.equal(2);
    });
  }
});
