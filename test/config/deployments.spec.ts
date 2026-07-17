import { expect } from "chai";
import {
  Deployments,
  SubgraphCompatibilityError,
  SupportedChainId,
  getConfiguredHooksFactoryTargets,
  getConfiguredMarketKindForHooksFactory,
  getDeploymentAddress,
  getHooksFactoryAddress,
  getLatestLensDeploymentName,
  hasHooksFactoryDeployment
} from "../../src/config";

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
