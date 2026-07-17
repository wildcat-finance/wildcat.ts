import { expect } from "chai";
import { BigNumber, constants, providers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import {
  DeployMarketPreview,
  DeployMarketStatus,
  FixedTermHooksTemplate,
  OpenTermHooksTemplate,
  PeriodicTermHooksTemplate,
  REVOLVING_MARKET_DATA_VERSION,
  RevolvingReadyDeployMarketPreview,
  StandardReadyDeployMarketPreview,
  encodeRevolvingMarketData
} from "../../src/access";
import { getDeploymentAddress, SupportedChainId } from "../../src/constants";
import { MarketParameters } from "../../src/controller";
import { Token } from "../../src/token";
import {
  DepositAccess,
  FeeConfigurationV2,
  TransferAccess,
  WithdrawalAccess
} from "../../src/types";
import { decodeHooksConfig } from "../../src/utils";

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

const makeOpenTermTemplate = (
  hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryStandard")
): OpenTermHooksTemplate => {
  return new OpenTermHooksTemplate(SupportedChainId.Sepolia, provider, {
    hooksTemplate: makeAddress(12),
    hooksFactory,
    fees: makeFees(),
    enabled: true,
    index: 0,
    name: "OpenTermHooks",
    totalMarkets: 0,
    isRegisteredBorrower: true
  });
};

const makeFixedTermTemplate = (
  hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryStandard")
): FixedTermHooksTemplate => {
  return new FixedTermHooksTemplate(SupportedChainId.Sepolia, provider, {
    hooksTemplate: makeAddress(13),
    hooksFactory,
    fees: makeFees(),
    enabled: true,
    index: 0,
    name: "FixedTermHooks",
    totalMarkets: 0,
    isRegisteredBorrower: true
  });
};

const makePeriodicTermTemplate = (
  hooksFactory = getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryStandard")
): PeriodicTermHooksTemplate => {
  return new PeriodicTermHooksTemplate(SupportedChainId.Sepolia, provider, {
    hooksTemplate: makeAddress(14),
    hooksFactory,
    fees: makeFees(),
    enabled: true,
    index: 0,
    name: "PeriodicTermHooks",
    totalMarkets: 0,
    isRegisteredBorrower: true
  });
};

const expectReadyStandardPreview = (
  preview: DeployMarketPreview,
  fn: "deployMarket" | "deployMarketAndHooks"
): StandardReadyDeployMarketPreview => {
  if (preview.status !== DeployMarketStatus.Ready) {
    throw new Error(`expected ready preview, got ${preview.status}`);
  }
  if (preview.marketKind !== "standard") {
    throw new Error(`expected standard preview, got ${preview.marketKind}`);
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
  if (preview.marketKind !== "revolving") {
    throw new Error(`expected revolving preview, got ${preview.marketKind}`);
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

const HooksInstanceInputsSignature = `tuple(string name, address roleProviderFactory, tuple(uint32 timeToLive, bytes providerFactoryCalldata)[] newProviderInputs, tuple(address providerAddress, uint32 timeToLive)[] existingProviders)`;

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
  it("defaults to the standard direct deploy preview", () => {
    const asset = makeToken();
    const template = makeOpenTermTemplate();

    const preview = expectReadyStandardPreview(
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

    const [minimumDeposit, transfersDisabled] = defaultAbiCoder.decode(
      ["uint128", "bool"],
      expectEncodedData(preview.args[1])
    );

    expect(minimumDeposit.eq(asset.parseAmount("100").raw)).to.equal(true);
    expect(transfersDisabled).to.equal(true);
  });

  it("returns the revolving direct deploy preview when explicitly requested", () => {
    const asset = makeToken();
    const template = makeOpenTermTemplate(
      getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving")
    );

    const preview = expectReadyRevolvingPreview(
      template.previewDeployMarket({
        ...makeMarketParameters(asset),
        marketKind: "revolving",
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

    const [minimumDeposit, transfersDisabled] = defaultAbiCoder.decode(
      ["uint128", "bool"],
      expectEncodedData(preview.args[1])
    );

    expect(minimumDeposit.eq(asset.parseAmount("25").raw)).to.equal(true);
    expect(transfersDisabled).to.equal(false);
    expect(decodeHooksConfig((preview.args[0] as { hooks: bigint }).hooks).useOnDeposit).to.equal(
      false
    );

    const [version, commitmentFeeBips] = defaultAbiCoder.decode(
      ["uint8", "uint16"],
      expectEncodedData(preview.args[2])
    );

    expect(expectDecodedNumber(version)).to.equal(REVOLVING_MARKET_DATA_VERSION);
    expect(expectDecodedNumber(commitmentFeeBips)).to.equal(175);
  });

  it("rejects revolving deploy previews from a standard-scoped template", () => {
    const asset = makeToken();
    const template = makeOpenTermTemplate();

    const preview = template.previewDeployMarket({
      ...makeMarketParameters(asset),
      marketKind: "revolving",
      commitmentFeeBips: 175,
      hooksAddress: makeAddress(21),
      salt: constants.HashZero,
      minimumDeposit: asset.parseAmount("25"),
      transferAccess: TransferAccess.Open,
      depositAccess: DepositAccess.Open,
      withdrawalAccess: WithdrawalAccess.Open,
      allowForceBuyBacks: false
    });

    expect(preview.status).to.equal(DeployMarketStatus.WrongHooksFactory);
  });

  it("throws on invalid revolving commitment fee input", () => {
    const asset = makeToken();
    const template = makeOpenTermTemplate(
      getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving")
    );

    expect(() =>
      template.previewDeployMarket({
        ...makeMarketParameters(asset),
        marketKind: "revolving",
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

describe("V2.5 hook deployment validation", () => {
  it("rejects credential-gated withdrawals without credential-gated deposits", () => {
    const asset = makeToken();
    const common = {
      ...makeMarketParameters(asset),
      hooksAddress: makeAddress(40),
      salt: constants.HashZero,
      minimumDeposit: asset.getAmount(0n),
      transferAccess: TransferAccess.Disabled,
      depositAccess: DepositAccess.Open,
      withdrawalAccess: WithdrawalAccess.RequiresCredential
    };

    expect(makeOpenTermTemplate().previewDeployMarket(common).status).to.equal(
      DeployMarketStatus.InvalidAccessConfiguration
    );
    expect(
      makeFixedTermTemplate().previewDeployMarket({
        ...common,
        fixedTermEndTime: 1_800_000_000,
        allowClosureBeforeTerm: false,
        allowTermReduction: false
      }).status
    ).to.equal(DeployMarketStatus.InvalidAccessConfiguration);
    expect(
      makePeriodicTermTemplate().previewDeployMarket({
        ...common,
        firstWithdrawalWindowStart: 1_800_000_000,
        periodDuration: 30 * 24 * 60 * 60,
        withdrawalWindowDuration: 7 * 24 * 60 * 60
      }).status
    ).to.equal(DeployMarketStatus.InvalidAccessConfiguration);
  });

  it("rejects credential-gated withdrawals while transfers remain open", () => {
    const asset = makeToken();
    const preview = makeOpenTermTemplate().previewDeployMarket({
      ...makeMarketParameters(asset),
      hooksAddress: makeAddress(41),
      salt: constants.HashZero,
      minimumDeposit: asset.getAmount(0n),
      transferAccess: TransferAccess.Open,
      depositAccess: DepositAccess.RequiresCredential,
      withdrawalAccess: WithdrawalAccess.RequiresCredential
    });

    expect(preview.status).to.equal(DeployMarketStatus.InvalidAccessConfiguration);
  });

  it("rejects periodic minimum deposits that exceed uint96 storage", () => {
    const asset = makeToken();
    const preview = makePeriodicTermTemplate().previewDeployMarket({
      ...makeMarketParameters(asset),
      hooksAddress: makeAddress(42),
      salt: constants.HashZero,
      minimumDeposit: asset.getAmount(1n << 96n),
      transferAccess: TransferAccess.Open,
      depositAccess: DepositAccess.Open,
      withdrawalAccess: WithdrawalAccess.Open,
      firstWithdrawalWindowStart: 1_800_000_000,
      periodDuration: 30 * 24 * 60 * 60,
      withdrawalWindowDuration: 7 * 24 * 60 * 60
    });

    expect(preview.status).to.equal(DeployMarketStatus.MinimumDepositTooHigh);
  });
});

describe("FixedTermHooksTemplate.previewDeployMarket", () => {
  it("defaults to the standard deploy-and-hooks preview", () => {
    const asset = makeToken();
    const template = makeFixedTermTemplate();

    const preview = expectReadyStandardPreview(
      template.previewDeployMarket({
        ...makeMarketParameters(asset),
        hooksInstanceName: "FixedTermHooksInstance",
        roleProviderFactory: makeAddress(32),
        newProviderInputs: [
          {
            data: "0x1234",
            timeToLive: 1800
          }
        ],
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

    const [hooksInstanceInputs] = defaultAbiCoder.decode(
      [HooksInstanceInputsSignature],
      expectEncodedData(preview.args[1])
    );
    expect(hooksInstanceInputs.name).to.equal("FixedTermHooksInstance");
    expect(hooksInstanceInputs.roleProviderFactory).to.equal(makeAddress(32));
    expect(expectDecodedNumber(hooksInstanceInputs.newProviderInputs[0].timeToLive)).to.equal(1800);
    expect(hooksInstanceInputs.newProviderInputs[0].providerFactoryCalldata).to.equal("0x1234");
    expect(hooksInstanceInputs.existingProviders[0].providerAddress).to.equal(makeAddress(30));
    expect(expectDecodedNumber(hooksInstanceInputs.existingProviders[0].timeToLive)).to.equal(3600);

    const [
      fixedTermEndTime,
      minimumDeposit,
      transfersDisabled,
      allowClosureBeforeTerm,
      allowTermReduction
    ] = defaultAbiCoder.decode(
      ["uint32", "uint128", "bool", "bool", "bool"],
      expectEncodedData(preview.args[3])
    );

    expect(expectDecodedNumber(fixedTermEndTime)).to.equal(1_800_000_000);
    expect(minimumDeposit.eq(asset.parseAmount("50").raw)).to.equal(true);
    expect(transfersDisabled).to.equal(true);
    expect(allowClosureBeforeTerm).to.equal(true);
    expect(allowTermReduction).to.equal(false);
  });

  it("returns the revolving deploy-and-hooks preview when explicitly requested", () => {
    const asset = makeToken();
    const template = makeFixedTermTemplate(
      getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryRevolving")
    );

    const preview = expectReadyRevolvingPreview(
      template.previewDeployMarket({
        ...makeMarketParameters(asset),
        marketKind: "revolving",
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

    const [
      fixedTermEndTime,
      minimumDeposit,
      transfersDisabled,
      allowClosureBeforeTerm,
      allowTermReduction
    ] = defaultAbiCoder.decode(
      ["uint32", "uint128", "bool", "bool", "bool"],
      expectEncodedData(preview.args[3])
    );

    expect(expectDecodedNumber(fixedTermEndTime)).to.equal(1_800_000_000);
    expect(minimumDeposit.eq(asset.parseAmount("75").raw)).to.equal(true);
    expect(transfersDisabled).to.equal(false);
    expect(allowClosureBeforeTerm).to.equal(false);
    expect(allowTermReduction).to.equal(true);

    const [version, commitmentFeeBips] = defaultAbiCoder.decode(
      ["uint8", "uint16"],
      expectEncodedData(preview.args[4])
    );

    expect(expectDecodedNumber(version)).to.equal(REVOLVING_MARKET_DATA_VERSION);
    expect(expectDecodedNumber(commitmentFeeBips)).to.equal(95);
  });
});
