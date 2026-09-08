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
  getSupportedWrapperFactoryAddresses,
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
  eventGeneration: "legacy",
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
  it("pins the Sepolia V2.5.4 deployment addresses indexed by subgraph V2.5.12", () => {
    expect(Deployments[SupportedChainId.Sepolia]).to.include({
      HooksFactoryStandard: "0x5ae696F4F1A771799e8d03Dc232C8F843f44417f",
      HooksFactoryRevolving: "0x01c3E16434eCd4c76e2ff3a88D1e6Bf82BBda07e",
      MarketLensV2_5: "0x204BAe0AE3De919a88812065866Dd03b097BC6A7",
      MockArchControllerOwner: "0x981f1Fb406bD7a8385f9373c08Ab4c832Ed0d508",
      AccessListRoleProviderFactory: "0x92995EA2ba572E4Cb8bB41E30f813BeB77FD4974",
      WildcatBorrowerIdentityRegistry: "0xc2cF90781595203D1e75c28246b306C95d4b8b21",
      Wildcat4626WrapperFactory: "0xA159f68003e37cC77921e5e52F4c0e9A01D66262"
    });
  });

  it("supports only wrapper factories whose embedded implementation is current", () => {
    expect(getSupportedWrapperFactoryAddresses(SupportedChainId.Sepolia)).to.deep.equal([
      "0xA159f68003e37cC77921e5e52F4c0e9A01D66262"
    ]);
    expect(getSupportedWrapperFactoryAddresses(SupportedChainId.PlasmaMainnet)).to.deep.equal([]);
  });

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

  it("does not retain displaced Sepolia factories as configured transaction targets", () => {
    const displacedFactories = [
      "0xbFbDaFc91977eE599a61B30D9e75788565Ad6d18",
      "0x190B42942fe9492df9CeA441dA5c43309840E93A",
      "0x89797b782cA5b4BBFC975146B98ba3941Fe26C56",
      "0xb3FBD4FBeb1EE4BEE7afdbC4A75C7c4E97CF105C"
    ];

    for (const address of displacedFactories) {
      expect(getConfiguredMarketKindForHooksFactory(SupportedChainId.Sepolia, address)).to.equal(
        "unknown"
      );
    }
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
    expect(error.endpoint).to.equal("https://example.invalid");
    expect(error.issues[0]).to.deep.include({ expected: "1", actual: "11155111" });
  });
});
