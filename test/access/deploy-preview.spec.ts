import { expect } from "chai";
import { BigNumber, constants, providers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import {
  DeployMarketPreview,
  DeployMarketStatus,
  FixedTermHooksTemplate,
  OpenTermHooksTemplate,
  REVOLVING_MARKET_DATA_VERSION,
  RevolvingReadyDeployMarketPreview,
  LegacyReadyDeployMarketPreview,
  encodeRevolvingMarketData
} from "../../src/access";
import { SupportedChainId } from "../../src/constants";
import { MarketParameters } from "../../src/controller";
import { Token } from "../../src/token";
import {
  DepositAccess,
  FeeConfigurationV2,
  TransferAccess,
  WithdrawalAccess
} from "../../src/types";

const provider = new providers.JsonRpcProvider();

const makeAddress = (suffix: number): string => {
  return `0x${suffix.toString(16).padStart(40, "0")}`;
};

const makeFees = (): FeeConfigurationV2 => {
  return {
    feeRecipient: makeAddress(10),
    protocolFeeBips: 25
  };
};

const makeToken = (): Token => {
  return new Token(
    SupportedChainId.Sepolia,
    makeAddress(11),
    "Mock USD",
    "mUSD",
    6,
    false,
    provider
  );
};

const makeMarketParameters = (asset: Token): MarketParameters => {
  return {
    asset,
    namePrefix: "Wildcat ",
    symbolPrefix: "WC-",
    maxTotalSupply: asset.parseAmount("1000000"),
    annualInterestBips: 1200,
    delinquencyFeeBips: 200,
    delinquencyGracePeriod: 7 * 24 * 60 * 60,
    withdrawalBatchDuration: 24 * 60 * 60,
    reserveRatioBips: 1000
  };
};

const makeOpenTermTemplate = (): OpenTermHooksTemplate => {
  return new OpenTermHooksTemplate(SupportedChainId.Sepolia, provider, {
    hooksTemplate: makeAddress(12),
    fees: makeFees(),
    enabled: true,
    index: 0,
    name: "OpenTermHooks",
    totalMarkets: 0,
    isRegisteredBorrower: true
  });
};

const makeFixedTermTemplate = (): FixedTermHooksTemplate => {
  return new FixedTermHooksTemplate(SupportedChainId.Sepolia, provider, {
    hooksTemplate: makeAddress(13),
    fees: makeFees(),
    enabled: true,
    index: 0,
    name: "FixedTermHooks",
    totalMarkets: 0,
    isRegisteredBorrower: true
  });
};

const expectReadyLegacyPreview = (
  preview: DeployMarketPreview,
  fn: "deployMarket" | "deployMarketAndHooks"
): LegacyReadyDeployMarketPreview => {
  if (preview.status !== DeployMarketStatus.Ready) {
    throw new Error(`expected ready preview, got ${preview.status}`);
  }
  if (preview.marketType !== "legacy") {
    throw new Error(`expected legacy preview, got ${preview.marketType}`);
  }
  if (preview.fn !== fn) {
    throw new Error(`expected ${fn}, got ${preview.fn}`);
  }
  return preview;
};

const expectReadyRevolvingPreview = (
  preview: DeployMarketPreview,
  fn: "deployMarket" | "deployMarketAndHooks"
): RevolvingReadyDeployMarketPreview => {
  if (preview.status !== DeployMarketStatus.Ready) {
    throw new Error(`expected ready preview, got ${preview.status}`);
  }
  if (preview.marketType !== "revolving") {
    throw new Error(`expected revolving preview, got ${preview.marketType}`);
  }
  if (preview.fn !== fn) {
    throw new Error(`expected ${fn}, got ${preview.fn}`);
  }
  return preview;
};

const expectEncodedData = (value: unknown): string => {
  if (typeof value !== "string") {
    throw new Error(`expected encoded data string, got ${typeof value}`);
  }
  return value;
};

const expectDecodedNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return value;
  }
  if (BigNumber.isBigNumber(value)) {
    return value.toNumber();
  }
  throw new Error(`expected decoded number, got ${typeof value}`);
};

describe("deploy preview helpers", () => {
  it("encodes revolving market data with versioned commitment fee payload", () => {
    const encoded = encodeRevolvingMarketData({ commitmentFeeBips: 250 });
    const [version, commitmentFeeBips] = defaultAbiCoder.decode(["uint8", "uint16"], encoded);

    expect(expectDecodedNumber(version)).to.equal(REVOLVING_MARKET_DATA_VERSION);
    expect(expectDecodedNumber(commitmentFeeBips)).to.equal(250);
  });

  it("rejects commitment fees above 10000 bips", () => {
    expect(() => encodeRevolvingMarketData({ commitmentFeeBips: 10_001 })).to.throw(
      "commitmentFeeBips must be <= 10000"
    );
  });
});

describe("OpenTermHooksTemplate.previewDeployMarket", () => {
  it("defaults to the legacy direct deploy preview", () => {
    const asset = makeToken();
    const template = makeOpenTermTemplate();

    const preview = expectReadyLegacyPreview(
      template.previewDeployMarket({
        ...makeMarketParameters(asset),
        hooksAddress: makeAddress(20),
        salt: constants.HashZero,
        minimumDeposit: asset.parseAmount("100"),
        transferAccess: TransferAccess.Disabled,
        depositAccess: DepositAccess.RequiresCredential,
        withdrawalAccess: WithdrawalAccess.RequiresCredential,
        allowForceBuyBacks: true
      }),
      "deployMarket"
    );

    expect(preview.args).to.have.length(5);

    const [minimumDeposit, transfersDisabled, allowForceBuyBacks] = defaultAbiCoder.decode(
      ["uint128", "bool", "bool"],
      expectEncodedData(preview.args[1])
    );

    expect(minimumDeposit.eq(asset.parseAmount("100").raw)).to.equal(true);
    expect(transfersDisabled).to.equal(true);
    expect(allowForceBuyBacks).to.equal(true);
  });

  it("returns the revolving direct deploy preview when explicitly requested", () => {
    const asset = makeToken();
    const template = makeOpenTermTemplate();

    const preview = expectReadyRevolvingPreview(
      template.previewDeployMarket({
        ...makeMarketParameters(asset),
        marketType: "revolving",
        commitmentFeeBips: 175,
        hooksAddress: makeAddress(21),
        salt: constants.HashZero,
        minimumDeposit: asset.parseAmount("25"),
        transferAccess: TransferAccess.Open,
        depositAccess: DepositAccess.Open,
        withdrawalAccess: WithdrawalAccess.Open,
        allowForceBuyBacks: false
      }),
      "deployMarket"
    );

    expect(preview.args).to.have.length(6);

    const [version, commitmentFeeBips] = defaultAbiCoder.decode(
      ["uint8", "uint16"],
      expectEncodedData(preview.args[2])
    );

    expect(expectDecodedNumber(version)).to.equal(REVOLVING_MARKET_DATA_VERSION);
    expect(expectDecodedNumber(commitmentFeeBips)).to.equal(175);
  });

  it("throws on invalid revolving commitment fee input", () => {
    const asset = makeToken();
    const template = makeOpenTermTemplate();

    expect(() =>
      template.previewDeployMarket({
        ...makeMarketParameters(asset),
        marketType: "revolving",
        commitmentFeeBips: 10_001,
        hooksAddress: makeAddress(22),
        salt: constants.HashZero,
        minimumDeposit: asset.parseAmount("10"),
        transferAccess: TransferAccess.Open,
        depositAccess: DepositAccess.Open,
        withdrawalAccess: WithdrawalAccess.Open
      })
    ).to.throw("commitmentFeeBips must be <= 10000");
  });
});

describe("FixedTermHooksTemplate.previewDeployMarket", () => {
  it("defaults to the legacy deploy-and-hooks preview", () => {
    const asset = makeToken();
    const template = makeFixedTermTemplate();

    const preview = expectReadyLegacyPreview(
      template.previewDeployMarket({
        ...makeMarketParameters(asset),
        hooksInstanceName: "FixedTermHooksInstance",
        existingProviders: [
          {
            providerAddress: makeAddress(30),
            timeToLive: 3600
          }
        ],
        salt: constants.HashZero,
        fixedTermEndTime: 1_800_000_000,
        minimumDeposit: asset.parseAmount("50"),
        transferAccess: TransferAccess.Disabled,
        depositAccess: DepositAccess.RequiresCredential,
        withdrawalAccess: WithdrawalAccess.RequiresCredential,
        allowClosureBeforeTerm: true,
        allowTermReduction: false,
        allowForceBuyBacks: true
      }),
      "deployMarketAndHooks"
    );

    expect(preview.args).to.have.length(7);

    const [
      fixedTermEndTime,
      minimumDeposit,
      transfersDisabled,
      allowForceBuyBacks,
      allowClosureBeforeTerm,
      allowTermReduction
    ] = defaultAbiCoder.decode(
      ["uint32", "uint128", "bool", "bool", "bool", "bool"],
      expectEncodedData(preview.args[3])
    );

    expect(expectDecodedNumber(fixedTermEndTime)).to.equal(1_800_000_000);
    expect(minimumDeposit.eq(asset.parseAmount("50").raw)).to.equal(true);
    expect(transfersDisabled).to.equal(true);
    expect(allowForceBuyBacks).to.equal(true);
    expect(allowClosureBeforeTerm).to.equal(true);
    expect(allowTermReduction).to.equal(false);
  });

  it("returns the revolving deploy-and-hooks preview when explicitly requested", () => {
    const asset = makeToken();
    const template = makeFixedTermTemplate();

    const preview = expectReadyRevolvingPreview(
      template.previewDeployMarket({
        ...makeMarketParameters(asset),
        marketType: "revolving",
        commitmentFeeBips: 95,
        hooksInstanceName: "FixedTermHooksInstance",
        existingProviders: [
          {
            providerAddress: makeAddress(31),
            timeToLive: 7200
          }
        ],
        salt: constants.HashZero,
        fixedTermEndTime: 1_800_000_000,
        minimumDeposit: asset.parseAmount("75"),
        transferAccess: TransferAccess.Open,
        depositAccess: DepositAccess.Open,
        withdrawalAccess: WithdrawalAccess.Open,
        allowClosureBeforeTerm: false,
        allowTermReduction: true,
        allowForceBuyBacks: false
      }),
      "deployMarketAndHooks"
    );

    expect(preview.args).to.have.length(8);

    const [version, commitmentFeeBips] = defaultAbiCoder.decode(
      ["uint8", "uint16"],
      expectEncodedData(preview.args[4])
    );

    expect(expectDecodedNumber(version)).to.equal(REVOLVING_MARKET_DATA_VERSION);
    expect(expectDecodedNumber(commitmentFeeBips)).to.equal(95);
  });
});
