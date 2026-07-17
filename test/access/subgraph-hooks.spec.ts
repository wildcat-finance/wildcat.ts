import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { expect } from "chai";
import { getDeploymentAddress, SupportedChainId } from "../../src/constants";
import { getAllHooksDataForBorrower, getAllHooksTemplates } from "../../src/gql";
import { SubgraphHooksKind } from "../../src/gql/graphql";
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

const makeTemplateFields = (name: string, suffix: number) => ({
  name,
  feeRecipient: makeAddress(10_000 + suffix),
  protocolFeeBips: 25,
  originationFeeAmount: "0",
  disabled: false,
  originationFeeAsset: null
});

const makeFactoryTemplate = (
  name: string,
  suffix: number,
  hooksFactory = configuredHooksFactory
) => ({
  __typename: "FactoryHooksTemplate" as const,
  id: `${hooksFactory.toLowerCase()}-${suffix}`,
  templateAddress: makeAddress(suffix),
  ...makeTemplateFields(name, suffix),
  hooksFactory: {
    __typename: "HooksFactory" as const,
    id: hooksFactory,
    marketType: null,
    isRegistered: true
  }
});

const makeHooksTemplate = (name: string, suffix: number) => ({
  __typename: "HooksTemplate" as const,
  id: makeAddress(suffix),
  ...makeTemplateFields(name, suffix)
});

const makeHooksInstance = (kind: SubgraphHooksKind, templateName: string, suffix: number) => {
  return {
    __typename: "HooksInstance" as const,
    id: makeAddress(1_000 + suffix),
    borrower,
    name: `${templateName}Instance`,
    kind,
    numMarkets: 1,
    eventIndex: suffix,
    hooksTemplate: makeHooksTemplate(templateName, 2_000 + suffix),
    factoryHooksTemplate: makeFactoryTemplate(templateName, 3_000 + suffix),
    providers: []
  };
};

describe("subgraph hooks helpers", () => {
  it("includes supported templates from historical factories discovered by the subgraph", async () => {
    const queries: QueryArgs[] = [];
    const subgraphClient = makeSubgraphClient(
      {
        factoryHooksTemplates: [
          makeFactoryTemplate("OpenTermHooks", 1),
          makeFactoryTemplate("FixedTermHooks", 2),
          makeFactoryTemplate("PeriodicTermHooks", 3),
          makeFactoryTemplate("UnknownHooks", 4),
          makeFactoryTemplate("PeriodicTermHooks", 5, historicalHooksFactory)
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
      factoryHooksTemplates: [
        makeFactoryTemplate("OpenTermHooks", 11),
        makeFactoryTemplate("FixedTermHooks", 12),
        makeFactoryTemplate("PeriodicTermHooks", 13),
        makeFactoryTemplate("PeriodicTermHooks", 14, historicalHooksFactory)
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
