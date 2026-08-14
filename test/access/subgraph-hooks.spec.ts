import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { getDeploymentAddress, SupportedChainId } from "../../src/constants";
import {
  getAllHooksDataForBorrower,
  getAllHooksTemplates,
  getHooksFactories,
  getHooksTemplateRegistrations
} from "../../src/gql";
import {
  SubgraphFactoryLifecycle,
  SubgraphHookedMarketAbi,
  SubgraphHooksKind,
  SubgraphLenderHooksAccessDataFragment,
  SubgraphMarketKind,
  SubgraphRoleProviderKind
} from "../../src/gql/graphql";
import { HooksKind, Provider } from "../../src/types";
import { parseSubgraphLenderHooksAccess } from "../../src/utils";

const chainId = SupportedChainId.Sepolia;
const configuredHooksFactory = getDeploymentAddress(chainId, "HooksFactoryStandard");
const historicalHooksFactory = "0x000000000000000000000000000000000000faca";
const borrower = "0x000000000000000000000000000000000000b0b0";

type QueryArgs = {
  fetchPolicy?: FetchPolicy;
  variables?: Record<string, unknown>;
};

const provider: Provider = {
  call: async () => "0x"
};

const makeAddress = (suffix: number): string => {
  return `0x${suffix.toString(16).padStart(40, "0")}`;
};

const makeSubgraphClient = <TData>(
  data: TData,
  queries: QueryArgs[] = []
): ApolloClient<NormalizedCacheObject> => {
  return {
    query: async (args: QueryArgs) => {
      queries.push(args);
      return { data };
    }
  } as unknown as ApolloClient<NormalizedCacheObject>;
};

const makeFactory = (hooksFactory: string) => ({
  __typename: "HooksFactory" as const,
  id: hooksFactory,
  address: hooksFactory,
  label: "test-factory",
  sentinel: makeAddress(9_000),
  marketKind: SubgraphMarketKind.STANDARD,
  generation: "v2.5",
  abiFamily: "hooks-shared-current",
  hookedMarketAbi: SubgraphHookedMarketAbi.BASE,
  configuredStartBlock: "1",
  indexed: true,
  deploymentTarget: hooksFactory === configuredHooksFactory,
  lifecycle: SubgraphFactoryLifecycle.ACTIVE,
  configured: true,
  isRegistered: true,
  registrationUpdatedAtBlock: "1",
  registrationUpdatedAtTimestamp: "1700000000",
  archController: {
    __typename: "ArchController" as const,
    id: getDeploymentAddress(chainId, "WildcatArchController")
  }
});

const makeHooksTemplate = (kind: SubgraphHooksKind, suffix: number) => ({
  __typename: "HooksTemplate" as const,
  id: makeAddress(suffix),
  address: makeAddress(suffix),
  kind,
  version: "v2.5",
  abiFamily: "hooks-shared-current"
});

const makeTemplateRegistration = (
  kind: SubgraphHooksKind,
  name: string,
  suffix: number,
  hooksFactory = configuredHooksFactory
) => ({
  __typename: "HooksTemplateRegistration" as const,
  id: `${hooksFactory.toLowerCase()}-${suffix}`,
  templateAddress: makeAddress(suffix),
  name,
  feeRecipient: makeAddress(10_000 + suffix),
  protocolFeeBips: 25,
  originationFeeAmount: "0",
  isEnabled: true,
  originationFeeAsset: null,
  createdAtBlock: "1",
  createdAtTimestamp: "1700000000",
  createdAtTransaction: makeAddress(8_000 + suffix),
  createdAtLogIndex: "0",
  updatedAtBlock: "1",
  updatedAtTimestamp: "1700000000",
  updatedAtTransaction: makeAddress(8_000 + suffix),
  updatedAtLogIndex: "0",
  hooksTemplate: makeHooksTemplate(kind, suffix),
  hooksFactory: makeFactory(hooksFactory)
});

const makeHooksInstance = (kind: SubgraphHooksKind, templateName: string, suffix: number) => {
  const registration = makeTemplateRegistration(kind, templateName, 3_000 + suffix);
  return {
    __typename: "HooksInstance" as const,
    id: makeAddress(1_000 + suffix),
    address: makeAddress(1_000 + suffix),
    borrower,
    administrator: borrower,
    pendingAdministrator: null,
    name: `${templateName}Instance`,
    kind,
    marketKind: SubgraphMarketKind.STANDARD,
    generation: "v2.5",
    abiFamily: "hooks-shared-current",
    numMarkets: 1,
    eventIndex: suffix,
    hooksTemplate: registration.hooksTemplate,
    templateRegistration: registration,
    hooksFactory: registration.hooksFactory,
    providers: [
      {
        __typename: "RoleProvider" as const,
        id: makeAddress(4_000 + suffix),
        providerAddress: borrower,
        providerInstance: {
          __typename: "RoleProviderInstance" as const,
          kind: SubgraphRoleProviderKind.ACCESS_LIST,
          administrator: borrower,
          pendingAdministrator: null
        },
        timeToLive: "4294967295",
        isPullProvider: false,
        pullProviderIndex: 2 ** 24 - 1,
        isPushProvider: true,
        pushProviderIndex: 0,
        isApproved: true
      }
    ]
  };
};

const makeBorrowerAccountEligibility = (isPrincipalRegistered: boolean) => ({
  __typename: "BorrowerAccount" as const,
  registry: {
    __typename: "BorrowerIdentityRegistry" as const,
    archController: {
      __typename: "ArchController" as const,
      id: getDeploymentAddress(chainId, "WildcatArchController")
    }
  },
  principal: {
    __typename: "Borrower" as const,
    registrations: [
      {
        __typename: "RegisteredBorrower" as const,
        archController: {
          __typename: "ArchController" as const,
          id: getDeploymentAddress(chainId, "WildcatArchController")
        },
        isRegistered: isPrincipalRegistered
      }
    ]
  }
});

describe("subgraph hooks helpers", () => {
  it("includes supported templates from historical factories discovered by the subgraph", async () => {
    const queries: QueryArgs[] = [];
    const subgraphClient = makeSubgraphClient(
      {
        hooksTemplateRegistrations: [
          makeTemplateRegistration(SubgraphHooksKind.OpenTerm, "OpenTermHooks", 1),
          makeTemplateRegistration(SubgraphHooksKind.FixedTerm, "FixedTermHooks", 2),
          makeTemplateRegistration(SubgraphHooksKind.PeriodicTerm, "PeriodicTermHooks", 3),
          makeTemplateRegistration(SubgraphHooksKind.Unknown, "UnknownHooks", 4),
          makeTemplateRegistration(
            SubgraphHooksKind.PeriodicTerm,
            "PeriodicTermHooks",
            5,
            historicalHooksFactory
          )
        ],
        registeredBorrowers: [{ isRegistered: true }]
      },
      queries
    );

    const templates = await getAllHooksTemplates(subgraphClient, {
      chainId,
      signerOrProvider: provider,
      fetchPolicy: "no-cache",
      borrower
    });

    expect(queries[0].variables).to.deep.include({
      borrower,
      includeBorrower: true
    });
    expect(templates.map((template) => template.name)).to.deep.equal([
      "OpenTermHooks",
      "FixedTermHooks",
      "PeriodicTermHooks",
      "PeriodicTermHooks"
    ]);
    expect(templates.map((template) => template.kind)).to.deep.equal([
      HooksKind.OpenTerm,
      HooksKind.FixedTerm,
      HooksKind.PeriodicTerm,
      HooksKind.PeriodicTerm
    ]);
    expect(templates.map((template) => template.hooksFactory.toLowerCase())).to.deep.equal([
      configuredHooksFactory.toLowerCase(),
      configuredHooksFactory.toLowerCase(),
      configuredHooksFactory.toLowerCase(),
      historicalHooksFactory.toLowerCase()
    ]);
    expect(templates[0].registration?.id).to.equal(`${configuredHooksFactory.toLowerCase()}-1`);
  });

  it("includes periodic term borrower instances while filtering unsupported kinds", async () => {
    const subgraphClient = makeSubgraphClient({
      hooksTemplateRegistrations: [
        makeTemplateRegistration(SubgraphHooksKind.OpenTerm, "OpenTermHooks", 11),
        makeTemplateRegistration(SubgraphHooksKind.FixedTerm, "FixedTermHooks", 12),
        makeTemplateRegistration(SubgraphHooksKind.PeriodicTerm, "PeriodicTermHooks", 13),
        makeTemplateRegistration(
          SubgraphHooksKind.PeriodicTerm,
          "PeriodicTermHooks",
          14,
          historicalHooksFactory
        )
      ],
      hooksInstances: [
        makeHooksInstance(SubgraphHooksKind.OpenTerm, "OpenTermHooks", 21),
        makeHooksInstance(SubgraphHooksKind.FixedTerm, "FixedTermHooks", 22),
        makeHooksInstance(SubgraphHooksKind.PeriodicTerm, "PeriodicTermHooks", 23),
        makeHooksInstance(SubgraphHooksKind.Unknown, "UnknownHooks", 24)
      ],
      registeredBorrowers: [{ isRegistered: true }],
      controllers: []
    });

    const result = await getAllHooksDataForBorrower(subgraphClient, {
      chainId,
      signerOrProvider: provider,
      fetchPolicy: "no-cache",
      borrower
    });

    expect(result.isRegisteredBorrower).to.equal(true);
    expect(result.hooksTemplates.map((template) => template.name)).to.deep.equal([
      "OpenTermHooks",
      "FixedTermHooks",
      "PeriodicTermHooks",
      "PeriodicTermHooks"
    ]);
    expect(result.hooksInstances.map((instance) => instance.kind)).to.deep.equal([
      HooksKind.OpenTerm,
      HooksKind.FixedTerm,
      HooksKind.PeriodicTerm
    ]);
    expect(result.hooksInstances.map((instance) => instance.hooksTemplate.name)).to.deep.equal([
      "OpenTermHooks",
      "FixedTermHooks",
      "PeriodicTermHooks"
    ]);
    expect(
      result.hooksInstances.map((instance) => instance.roleProviders[0].timeToLive)
    ).to.deep.equal([4_294_967_295, 4_294_967_295, 4_294_967_295]);
    expect(
      result.hooksInstances.map((instance) => instance.roleProviders[0].isPullProvider)
    ).to.deep.equal([false, false, false]);
  });

  it("treats a registered account's principal as deployment eligibility", async () => {
    const subgraphClient = makeSubgraphClient({
      hooksTemplateRegistrations: [
        makeTemplateRegistration(SubgraphHooksKind.OpenTerm, "OpenTermHooks", 31)
      ],
      hooksInstances: [],
      registeredBorrowers: [],
      borrowerAccounts: [makeBorrowerAccountEligibility(true)],
      controllers: []
    });

    const result = await getAllHooksDataForBorrower(subgraphClient, {
      chainId,
      signerOrProvider: provider,
      fetchPolicy: "no-cache",
      borrower
    });

    expect(result.isRegisteredBorrower).to.equal(true);
    expect(result.hooksTemplates).to.have.length(1);
    expect(result.hooksTemplates[0].isRegisteredBorrower).to.equal(true);
    expect(result.hooksInstances).to.deep.equal([]);
  });

  it("normalizes Graph BigInt TTLs in lender credential metadata", () => {
    const hooksAccess: SubgraphLenderHooksAccessDataFragment = {
      __typename: "LenderHooksAccess",
      id: "lender-hooks-access",
      lender: borrower,
      isBlockedFromDeposits: false,
      canRefresh: false,
      lastApprovalTimestamp: 1_000,
      addedTimestamp: 1_000,
      lastProvider: {
        __typename: "RoleProvider",
        id: "borrower-role-provider",
        providerAddress: borrower,
        providerInstance: {
          __typename: "RoleProviderInstance",
          kind: SubgraphRoleProviderKind.UNKNOWN,
          administrator: null,
          pendingAdministrator: null
        },
        timeToLive: "4294967295",
        isPullProvider: false,
        pullProviderIndex: 2 ** 24 - 1,
        isPushProvider: true,
        pushProviderIndex: 0,
        isApproved: true
      }
    };

    const credential = parseSubgraphLenderHooksAccess(hooksAccess);

    expect(credential.lastProvider?.timeToLive).to.equal(4_294_967_295);
    expect(credential.lastApprovalTimestamp + (credential.lastProvider?.timeToLive ?? 0)).to.equal(
      4_294_968_295
    );
  });

  it("keeps registration state isolated for the same template on different factories", async () => {
    const sharedTemplate = makeAddress(88);
    const current = makeTemplateRegistration(SubgraphHooksKind.OpenTerm, "Current Open Term", 88);
    const historical = {
      ...makeTemplateRegistration(
        SubgraphHooksKind.OpenTerm,
        "Historical Open Term",
        89,
        historicalHooksFactory
      ),
      isEnabled: false,
      hooksTemplate: {
        ...makeHooksTemplate(SubgraphHooksKind.OpenTerm, 89),
        id: sharedTemplate,
        address: sharedTemplate
      },
      hooksFactory: {
        ...makeFactory(historicalHooksFactory),
        lifecycle: SubgraphFactoryLifecycle.HISTORICAL,
        deploymentTarget: false,
        isRegistered: false
      }
    };
    current.templateAddress = sharedTemplate;
    current.hooksTemplate.id = sharedTemplate;
    current.hooksTemplate.address = sharedTemplate;

    const registrations = await getHooksTemplateRegistrations(
      makeSubgraphClient({ hooksTemplateRegistrations: [current, historical] }),
      { fetchPolicy: "no-cache" }
    );

    expect(registrations).to.have.lengthOf(2);
    expect(registrations.map(({ hooksTemplate }) => hooksTemplate.address)).to.deep.equal([
      sharedTemplate,
      sharedTemplate
    ]);
    expect(registrations.map(({ hooksFactory }) => hooksFactory.address)).to.deep.equal([
      configuredHooksFactory,
      historicalHooksFactory
    ]);
    expect(registrations.map(({ isEnabled }) => isEnabled)).to.deep.equal([true, false]);
    expect(registrations[1].hooksFactory.isRegistered).to.equal(false);
    expect(registrations[1].hooksFactory.lifecycle).to.equal("historical");
  });

  it("retains deregistered and future factory metadata without guessing enum values", async () => {
    const futureFactory = makeAddress(777);
    const factories = await getHooksFactories(
      makeSubgraphClient({
        hooksFactories: [
          {
            ...makeFactory(historicalHooksFactory),
            lifecycle: SubgraphFactoryLifecycle.HISTORICAL,
            isRegistered: false
          },
          {
            ...makeFactory(futureFactory),
            marketKind: "FUTURE_MARKET_KIND",
            hookedMarketAbi: "FUTURE_ABI",
            lifecycle: "FUTURE_LIFECYCLE"
          }
        ]
      })
    );

    expect(factories[0]).to.deep.include({
      address: historicalHooksFactory,
      lifecycle: "historical",
      isRegistered: false
    });
    expect(factories[1]).to.deep.include({
      address: futureFactory,
      marketKind: "unknown",
      hookedMarketAbi: "unknown",
      lifecycle: "unknown"
    });
  });

  it("paginates registration metadata instead of accepting Graph's default limit", async () => {
    const queries: QueryArgs[] = [];
    const pages = [
      Array.from({ length: 1_000 }, (_, index) =>
        makeTemplateRegistration(SubgraphHooksKind.OpenTerm, "OpenTermHooks", 10_000 + index)
      ),
      [makeTemplateRegistration(SubgraphHooksKind.FixedTerm, "FixedTermHooks", 11_001)]
    ];
    const client = {
      query: async (args: QueryArgs) => {
        queries.push(args);
        return { data: { hooksTemplateRegistrations: pages.shift() ?? [] } };
      }
    } as unknown as ApolloClient<NormalizedCacheObject>;

    const registrations = await getHooksTemplateRegistrations(client, {
      fetchPolicy: "no-cache"
    });

    expect(registrations).to.have.lengthOf(1_001);
    expect(queries.map(({ variables }) => variables)).to.deep.equal([
      { first: 1_000, skip: 0 },
      { first: 1_000, skip: 1_000 }
    ]);
  });
});
