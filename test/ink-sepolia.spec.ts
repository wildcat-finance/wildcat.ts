import { expect } from "chai";
import { constants, providers, utils, VoidSigner } from "ethers";
import {
  Deployments,
  SupportedChainId,
  SupportedChainIds,
  getArchControllerContract,
  getDeploymentAddress,
  getHooksFactoryContract,
  getLensV2Contract,
  getMockArchControllerOwnerContract,
  getMockERC20Factory,
  getWrapperFactoryContract,
  hasDeploymentAddress,
  isSupportedChainId
} from "../src/constants";
import { FixedTermHooksTemplate, OpenTermHooksTemplate, DeployMarketStatus } from "../src/access";
import { Token } from "../src/token";
import { TokenFactory } from "../src/mockerc20factory";
import { Market } from "../src/market";
import { DepositAccess, HooksKind, TransferAccess, WithdrawalAccess } from "../src/types";
import {
  MarketDataLegacyStructOutput,
  MarketLensLegacy__factory,
  MarketLensV2__factory,
  MarketLensV21__factory
} from "../src/typechain";

const chainId = SupportedChainId.InkSepolia;
const provider = new providers.StaticJsonRpcProvider(undefined, { chainId, name: "ink-sepolia" });
const borrower = "0x0000000000000000000000000000000000000001";

function emptyAbiValue(param: utils.ParamType): any {
  if (param.baseType === "array") return [];
  if (param.baseType === "tuple") {
    return Object.fromEntries(param.components.map((part) => [part.name, emptyAbiValue(part)]));
  }
  if (param.type === "address") return constants.AddressZero;
  if (param.type === "bool") return false;
  if (param.type === "string") return "";
  return 0;
}

describe("Ink Sepolia support", () => {
  it("enables only the deployed Ink testnet", () => {
    expect(chainId).to.equal(763373);
    expect(SupportedChainIds.filter((id) => id === chainId)).to.deep.equal([chainId]);
    expect(isSupportedChainId(763373)).to.equal(true);
    expect(isSupportedChainId(57073)).to.equal(false);
    expect(Deployments).not.to.have.property("57073");
  });

  it("matches the confirmed deployment inventory, using the sanctions adapter", () => {
    expect(Deployments[chainId]).to.deep.equal({
      HooksFactory: "0xc54C18FBDa39A089901F59133909012EF116e464",
      MarketLensV2: "0xA2C7711852F9B9a73C32094128413B6529f52Eb7",
      MockArchControllerOwner: "0x9f8313B15dA5e8E7E0bf43E71aA838B3BD23eA81",
      MockERC20Factory: "0x001D521c15Db09bf52731aA27B3f2ba83D7499B9",
      WildcatArchController: "0x0ac22d06121fc336B2F3DBeb284df65C97BcA547",
      WildcatSanctionsSentinel: "0xa83a6afACf2a461A824fbC35dC5e6A80eee53d9A",
      Chainalysis: "0xd94748c005D4D384dD72ec3374973Ce8A8b31697",
      OpenAccessRoleProvider: "0x56E526cdB86f15A9f2cA97c2A8eB62B4BfE45B7b",
      Wildcat4626WrapperFactory: "0xF3fE96705d85A1592B31592B628667eA21fdd7C7"
    });
    for (const name of [
      "MarketLens",
      "WildcatMarketControllerFactory",
      "WildcatCollateralFactory",
      "CollateralLens",
      "MockChainalysis"
    ] as const) {
      expect(hasDeploymentAddress(chainId, name), name).to.equal(false);
      expect(() => getDeploymentAddress(chainId, name)).to.throw("not found");
    }
  });

  it("binds existing helpers to Ink contracts and the legacy lens ABI", () => {
    const bindings = [
      [getArchControllerContract(chainId, provider), "WildcatArchController"],
      [getHooksFactoryContract(chainId, provider), "HooksFactory"],
      [getLensV2Contract(chainId, provider), "MarketLensV2"],
      [getWrapperFactoryContract(chainId, provider), "Wildcat4626WrapperFactory"],
      [getMockERC20Factory(chainId, provider), "MockERC20Factory"],
      [getMockArchControllerOwnerContract(chainId, provider), "MockArchControllerOwner"]
    ] as const;
    for (const [contract, name] of bindings) {
      expect(contract.address.toLowerCase()).to.equal(
        getDeploymentAddress(chainId, name).toLowerCase()
      );
      expect(contract.provider).to.equal(provider);
    }
    expect(getLensV2Contract(chainId, provider).interface.format(utils.FormatTypes.json)).to.equal(
      MarketLensLegacy__factory.createInterface().format(utils.FormatTypes.json)
    );
    expect(
      getLensV2Contract(SupportedChainId.Mainnet, provider).interface.format(utils.FormatTypes.json)
    ).to.equal(MarketLensV2__factory.createInterface().format(utils.FormatTypes.json));
    expect(
      getLensV2Contract(SupportedChainId.Sepolia, provider).interface.format(utils.FormatTypes.json)
    ).to.equal(MarketLensV21__factory.createInterface().format(utils.FormatTypes.json));
  });

  it("prepares mock-token creation for EOA and Safe callers without RPC calls", () => {
    const factory = TokenFactory.getFactory(chainId, provider);
    expect(factory.address).to.equal(Deployments[chainId].MockERC20Factory);
    expect(factory.provider).to.equal(provider);
    const transaction = TokenFactory.populateDeployToken(
      chainId,
      new VoidSigner(borrower, provider),
      "Ink test token",
      "INK"
    );
    expect(transaction).to.deep.equal({
      to: Deployments[chainId].MockERC20Factory,
      data: getMockERC20Factory(chainId, provider).interface.encodeFunctionData("deployMockERC20", [
        "Ink test token",
        "INK"
      ]),
      value: "0"
    });
  });

  it("prepares borrower registration for the current MockOwner without RPC calls", async () => {
    const helper = getMockArchControllerOwnerContract(chainId, provider);
    const transaction = await helper.populateTransaction.registerBorrower(borrower);
    expect(transaction.to?.toLowerCase()).to.equal(
      Deployments[chainId].MockArchControllerOwner?.toLowerCase()
    );
    expect(transaction.data).to.equal(
      helper.interface.encodeFunctionData("registerBorrower", [borrower])
    );
  });

  it("decodes a nonempty legacy market response without shifting fixed-term fields", () => {
    const abi = MarketLensLegacy__factory.createInterface();
    const output = abi.getFunction("getMarketsData").outputs![0].arrayChildren;
    const raw = emptyAbiValue(output);
    raw.marketToken.token = borrower;
    raw.marketToken.decimals = 18;
    raw.underlyingToken.token = borrower;
    raw.underlyingToken.decimals = 18;
    raw.hooks.hooksAddress = borrower;
    raw.hooks.kind = 2;
    raw.hooks.hooksTemplate.name = "FixedTermHooks";
    raw.hooksConfig.kind = 2;
    raw.hooksConfig.minimumDeposit = 25;
    raw.hooksConfig.withdrawalRequiresAccess = true;
    raw.hooksConfig.fixedTermEndTime = 2000000000;
    raw.hooksConfig.allowClosureBeforeTerm = true;
    raw.hooksConfig.allowTermReduction = false;
    raw.scaleFactor = "1000000000000000000000000000";

    const encoded = abi.encodeFunctionResult("getMarketsData", [[raw]]);
    expect(() =>
      MarketLensV2__factory.createInterface().decodeFunctionResult("getMarketsData", encoded)
    ).to.throw();
    const decoded = abi.decodeFunctionResult(
      "getMarketsData",
      encoded
    )[0][0] as MarketDataLegacyStructOutput;
    expect(decoded.hooksConfig).not.to.have.property("allowForceBuyBacks");
    const market = Market.fromMarketDataV2(chainId, provider, decoded);
    const config = market.hooksConfig;
    expect(config?.kind).to.equal(HooksKind.FixedTerm);
    if (config?.kind !== HooksKind.FixedTerm) throw Error("Expected fixed-term hooks");
    expect(config.allowForceBuyBacks).to.equal(false);
    expect(config.minimumDeposit?.raw.toString()).to.equal("25");
    expect(config.fixedTermEndTime).to.equal(2000000000);
    expect(config.queueWithdrawalRequiresAccess).to.equal(true);
    expect(config.allowClosureBeforeTerm).to.equal(true);
    expect(config.allowTermReduction).to.equal(false);
  });

  it("encodes legacy open/fixed-term market parameters without force-buyback fields", () => {
    const asset = new Token(chainId, borrower, "Test asset", "TEST", 18, false, provider);
    const templateArgs = {
      hooksTemplate: "0x2161B562F169686f01458E3C068697e274194a5e",
      fees: { feeRecipient: borrower, protocolFeeBips: 500 },
      enabled: true,
      index: 0,
      name: "OpenTermHooks",
      totalMarkets: 0
    };
    const inputs = {
      asset,
      hooksAddress: borrower,
      namePrefix: "Wildcat ",
      symbolPrefix: "wc",
      maxTotalSupply: asset.getAmount(1000),
      minimumDeposit: asset.getAmount(25),
      annualInterestBips: 1000,
      delinquencyFeeBips: 200,
      delinquencyGracePeriod: 86400,
      withdrawalBatchDuration: 86400,
      reserveRatioBips: 1000,
      salt: constants.HashZero,
      transferAccess: TransferAccess.Disabled,
      depositAccess: DepositAccess.Open,
      withdrawalAccess: WithdrawalAccess.Open
    };
    const open = new OpenTermHooksTemplate(chainId, provider, templateArgs).previewDeployMarket(
      inputs
    );
    const fixed = new FixedTermHooksTemplate(chainId, provider, {
      ...templateArgs,
      hooksTemplate: "0xd2595296A51BE9604279aEA4804b540429103371",
      name: "FixedTermHooks"
    }).previewDeployMarket({
      ...inputs,
      fixedTermEndTime: 2000000000,
      allowClosureBeforeTerm: true,
      allowTermReduction: false
    });
    expect(open.status).to.equal(DeployMarketStatus.Ready);
    expect(fixed.status).to.equal(DeployMarketStatus.Ready);
    if (open.status !== DeployMarketStatus.Ready || fixed.status !== DeployMarketStatus.Ready)
      throw Error("Unexpected deployment status");
    expect(open.args[1]).to.equal(utils.defaultAbiCoder.encode(["uint128", "bool"], [25, true]));
    expect(fixed.args[1]).to.equal(
      utils.defaultAbiCoder.encode(
        ["uint32", "uint128", "bool", "bool", "bool"],
        [2000000000, 25, true, true, false]
      )
    );
  });
});
