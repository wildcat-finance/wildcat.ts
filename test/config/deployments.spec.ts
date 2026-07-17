import { expect } from "chai";
import {
  Deployments,
  SubgraphCompatibilityError,
  SupportedChainId,
  getConfiguredHooksFactoryTargets,
  getConfiguredMarketKindForHooksFactory,
  getDeploymentAddress,
  getHooksFactoryAddress,
  getHooksFactoryDeploymentTargetIssues,
  getLatestLensDeploymentName,
  hasHooksFactoryDeployment
} from "../../src/config";
import { HooksFactoryMetadata } from "../../src/domain";

const makeFactoryMetadata = (
  address: string,
  marketKind: HooksFactoryMetadata["marketKind"],
  chainId: SupportedChainId = SupportedChainId.Sepolia,
  overrides: Partial<HooksFactoryMetadata> = {}
): HooksFactoryMetadata => ({
  address,
  label: "factory",
  archController: getDeploymentAddress(chainId, "WildcatArchController"),
  sentinel: getDeploymentAddress(chainId, "WildcatSanctionsSentinel"),
  marketKind,
  generation: "v2.5",
  abiFamily: "hooks-shared-current",
  hookedMarketAbi: "base",
  configuredStartBlock: 1n,
  indexed: true,
  deploymentTarget: true,
  lifecycle: "active",
  configured: true,
  isRegistered: true,
  ...overrides
});

describe("SDK deployment configuration", () => {
  it("separates Sepolia standard and revolving transaction targets", () => {
    const targets = getConfiguredHooksFactoryTargets(SupportedChainId.Sepolia);

    expect(targets).to.deep.equal([
      {
        address: Deployments[SupportedChainId.Sepolia].HooksFactoryStandard,
        marketKind: "standard",
        deploymentName: "HooksFactoryStandard"
      },
      {
        address: Deployments[SupportedChainId.Sepolia].HooksFactoryRevolving,
        marketKind: "revolving",
        deploymentName: "HooksFactoryRevolving"
      }
    ]);
    expect(getHooksFactoryAddress(SupportedChainId.Sepolia, "standard")).to.equal(
      targets[0].address
    );
    expect(getHooksFactoryAddress(SupportedChainId.Sepolia, "revolving")).to.equal(
      targets[1].address
    );
  });

  it("does not treat historical factories as configured transaction targets", () => {
    const retiredSepoliaFactory = "0xF4564015E524cf5629828E61F45ed339D998D85f";

    expect(
      getConfiguredMarketKindForHooksFactory(SupportedChainId.Sepolia, retiredSepoliaFactory)
    ).to.equal("unknown");
  });

  it("accepts current targets while ignoring additional historical factories", () => {
    const targets = getConfiguredHooksFactoryTargets(SupportedChainId.Sepolia);
    const factories = [
      ...targets.map(({ address, marketKind }) => makeFactoryMetadata(address, marketKind)),
      makeFactoryMetadata(
        "0x0000000000000000000000000000000000000003",
        "standard",
        SupportedChainId.Sepolia,
        {
          deploymentTarget: false,
          lifecycle: "historical",
          isRegistered: false
        }
      )
    ];

    expect(
      getHooksFactoryDeploymentTargetIssues(SupportedChainId.Sepolia, factories)
    ).to.deep.equal([]);
  });

  it("reports missing and inconsistent indexed transaction targets", () => {
    const revolvingTarget = getConfiguredHooksFactoryTargets(SupportedChainId.Sepolia)[1];
    const issues = getHooksFactoryDeploymentTargetIssues(SupportedChainId.Sepolia, [
      makeFactoryMetadata(revolvingTarget.address, "standard", SupportedChainId.Sepolia, {
        indexed: false,
        configured: false,
        deploymentTarget: false,
        lifecycle: "historical",
        archController: "0x0000000000000000000000000000000000000003",
        sentinel: "0x0000000000000000000000000000000000000004"
      })
    ]);

    expect(issues.map(({ code }) => code)).to.deep.equal([
      "MISSING_INDEXED_FACTORY",
      "FACTORY_NOT_INDEXED",
      "FACTORY_NOT_CONFIGURED",
      "FACTORY_NOT_DEPLOYMENT_TARGET",
      "FACTORY_MARKET_KIND_MISMATCH",
      "FACTORY_ARCH_CONTROLLER_MISMATCH",
      "FACTORY_SENTINEL_MISMATCH",
      "FACTORY_NOT_ACTIVE"
    ]);
  });

  it("returns unknown for unconfigured factories instead of defaulting to standard", () => {
    expect(
      getConfiguredMarketKindForHooksFactory(
        SupportedChainId.Mainnet,
        "0x0000000000000000000000000000000000000001"
      )
    ).to.equal("unknown");
  });

  it("rejects unavailable transaction targets", () => {
    expect(hasHooksFactoryDeployment(SupportedChainId.Mainnet, "revolving")).to.equal(false);
    expect(() => getHooksFactoryAddress(SupportedChainId.Mainnet, "revolving")).to.throw(
      "Deployment HooksFactoryRevolving not found for chain 1"
    );
  });

  it("selects the latest configured lens without inventing an address", () => {
    expect(getLatestLensDeploymentName(SupportedChainId.Sepolia)).to.equal("MarketLensV2_5");
    expect(getLatestLensDeploymentName(SupportedChainId.Mainnet)).to.equal("MarketLensV2");
    expect(getDeploymentAddress(SupportedChainId.Mainnet, "MarketLensV2")).to.equal(
      Deployments[SupportedChainId.Mainnet].MarketLensV2
    );
  });

  it("reports endpoint compatibility failures as structured data", () => {
    const error = new SubgraphCompatibilityError("https://example.invalid/subgraph", [
      {
        code: "CHAIN_ID_MISMATCH",
        expected: "1",
        actual: "11155111"
      }
    ]);

    expect(error.message).to.include("CHAIN_ID_MISMATCH");
    expect(error.endpoint).to.equal("https://example.invalid/subgraph");
    expect(error.issues[0]).to.deep.include({ expected: "1", actual: "11155111" });
  });
});
