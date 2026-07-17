import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { getDeploymentAddress, SupportedChainId } from "../../src/constants";
import { getAllHooksDataForBorrower, getAllHooksTemplates } from "../../src/gql";
import {
  SubgraphFactoryLifecycle,
  SubgraphHookedMarketAbi,
  SubgraphHooksKind,
  SubgraphMarketKind
} from "../../src/gql/graphql";
import { HooksKind, Provider } from "../../src/types";

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
    providers: []
  };
};

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
  });
});
