import { expect } from "chai";
import { BigNumber, constants } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import {
  DepositAccess,
  DeployMarketStatus,
  HooksFlags,
  HooksKind,
  Market,
  MarketAccount,
  MarketArgs,
  MarketVersion,
  PeriodicTermHooksConfig,
  PeriodicTermHooksTemplate,
  ProposeAnnualInterestBipsStatus,
  QueueWithdrawalStatus,
  SetAprStatus,
  SupportedChainId,
  Token,
  TransferAccess,
  WithdrawalAccess,
  encodeHooksConfig
} from "../src";
import { IPeriodicTermHooks__factory } from "../src/typechain";

const RAY = BigNumber.from("1000000000000000000000000000");
const BORROWER = "0x0000000000000000000000000000000000000001";
const LENDER = "0x0000000000000000000000000000000000000002";
const HOOKS = "0x0000000000000000000000000000000000000003";
const TEMPLATE = "0x0000000000000000000000000000000000000004";
const TOKEN = "0x0000000000000000000000000000000000000005";

const provider = {} as MarketArgs["provider"];
const token = new Token(SupportedChainId.Sepolia, TOKEN, "Mock Token", "MOCK", 18, true, provider);

const defaultFlags = (useOnQueueWithdrawal = true): HooksFlags => ({
  useOnDeposit: false,
  useOnQueueWithdrawal,
  useOnExecuteWithdrawal: false,
  useOnTransfer: false,
  useOnBorrow: false,
  useOnRepay: false,
  useOnCloseMarket: false,
  useOnNukeFromOrbit: false,
  useOnSetMaxTotalSupply: false,
  useOnSetAnnualInterestAndReserveRatioBips: true,
  useOnSetProtocolFeeBips: false
});

const makePeriodicConfig = (
  overrides: Partial<PeriodicTermHooksConfig> = {}
): PeriodicTermHooksConfig => ({
  kind: HooksKind.PeriodicTerm,
  hooksAddress: HOOKS,
  flags: defaultFlags(),
  transferRequiresAccess: false,
  depositRequiresAccess: false,
  minimumDeposit: token.getAmount(0),
  transfersDisabled: false,
  queueWithdrawalRequiresAccess: false,
  firstWithdrawalWindowStart: 1_000,
  periodDuration: 100,
  withdrawalWindowDuration: 20,
  periodicTermClosed: false,
  pendingAnnualInterestBips: 0,
  pendingAnnualInterestProposalTimestamp: 0,
  pendingAnnualInterestResponseWindowStart: 0,
  pendingAnnualInterestResponseWindowEnd: 0,
  ...overrides
});

const makeMarket = (
  hooksConfig: PeriodicTermHooksConfig = makePeriodicConfig(),
  overrides: Partial<MarketArgs> = {}
): Market =>
  new Market({
    provider,
    chainId: SupportedChainId.Sepolia,
    version: MarketVersion.V2,
    marketToken: token,
    underlyingToken: token,
    hooksConfig,
    borrower: BORROWER,
    feeRecipient: constants.AddressZero,
    protocolFeeBips: 0,
    delinquencyFeeBips: 0,
    delinquencyGracePeriod: 0,
    withdrawalBatchDuration: 86_400,
    reserveRatioBips: 0,
    annualInterestBips: 1_000,
    temporaryReserveRatio: false,
    originalAnnualInterestBips: 1_000,
    originalReserveRatioBips: 0,
    temporaryReserveRatioExpiry: 0,
    isClosed: false,
    scaleFactor: RAY,
    totalSupply: token.getAmount(0),
    maxTotalSupply: token.getAmount(1_000_000),
    scaledTotalSupply: BigNumber.from(0),
    totalAssets: token.getAmount(0),
    lastAccruedProtocolFees: token.getAmount(0),
    normalizedUnclaimedWithdrawals: token.getAmount(0),
    scaledPendingWithdrawals: BigNumber.from(0),
    pendingWithdrawalExpiry: 0,
    isDelinquent: false,
    timeDelinquent: 0,
    lastInterestAccruedTimestamp: 0,
    unpaidWithdrawalBatchExpiries: [],
    coverageLiquidity: token.getAmount(0),
    ...overrides
  });

const makeAccount = (
  market = makeMarket(),
  overrides: Partial<ConstructorParameters<typeof MarketAccount>[0]> = {}
): MarketAccount =>
  new MarketAccount({
    account: LENDER,
    role: 0,
    scaledMarketBalance: BigNumber.from(100),
    marketBalance: token.getAmount(100),
    underlyingBalance: token.getAmount(0),
    underlyingApproval: BigNumber.from(0),
    market,
    ...overrides
  });

const setNow = (timestamp: number) => {
  Date.now = () => timestamp * 1_000;
};

describe("periodic term hooks SDK support", () => {
  const realDateNow = Date.now;

  afterEach(() => {
    Date.now = realDateNow;
  });

  describe("market window helpers", () => {
    it("detects whether the current timestamp is inside the recurring withdrawal window", () => {
      const market = makeMarket();

      setNow(999);
      expect(market.isPeriodicWithdrawalWindowOpen).to.eq(false);
      expect(market.currentOrNextPeriodicWithdrawalWindowStart).to.eq(1_000);

      setNow(1_005);
      expect(market.isPeriodicWithdrawalWindowOpen).to.eq(true);
      expect(market.currentOrNextPeriodicWithdrawalWindowStart).to.eq(1_000);

      setNow(1_021);
      expect(market.isPeriodicWithdrawalWindowOpen).to.eq(false);
      expect(market.currentOrNextPeriodicWithdrawalWindowStart).to.eq(1_100);
    });

    it("treats closed periodic markets as open for withdrawal requests", () => {
      const market = makeMarket(makePeriodicConfig({ periodicTermClosed: true }));

      setNow(999);

      expect(market.isPeriodicWithdrawalWindowOpen).to.eq(true);
    });
  });

  describe("lender withdrawal previews", () => {
    it("blocks queueing withdrawals outside the periodic window", () => {
      setNow(1_021);

      expect(makeAccount().withdrawalAvailability).to.eq(
        QueueWithdrawalStatus.OutsideWithdrawalWindow
      );
    });

    it("allows queueing withdrawals inside the periodic window when no credential is required", () => {
      setNow(1_005);

      expect(makeAccount().withdrawalAvailability).to.eq(QueueWithdrawalStatus.Ready);
    });

    it("requires access inside the periodic window only when the hook config requires it", () => {
      setNow(1_005);
      const market = makeMarket(
        makePeriodicConfig({
          queueWithdrawalRequiresAccess: true
        })
      );

      expect(makeAccount(market).withdrawalAvailability).to.eq(
        QueueWithdrawalStatus.RequiresAccess
      );
      expect(makeAccount(market, { isKnownLender: true }).withdrawalAvailability).to.eq(
        QueueWithdrawalStatus.Ready
      );
    });
  });

  describe("APR reduction previews", () => {
    it("requires periodic APR reductions to have a matching mature proposal", () => {
      setNow(1_030);

      expect(makeAccount(makeMarket(), { account: BORROWER }).previewSetAPR(900).status).to.eq(
        SetAprStatus.NoPendingAprChange
      );

      const mismatch = makeMarket(
        makePeriodicConfig({
          pendingAnnualInterestBips: 850,
          pendingAnnualInterestProposalTimestamp: 1_000,
          pendingAnnualInterestResponseWindowEnd: 1_020
        })
      );
      expect(makeAccount(mismatch, { account: BORROWER }).previewSetAPR(900).status).to.eq(
        SetAprStatus.AprChangeDoesNotMatchProposal
      );

      const immature = makeMarket(
        makePeriodicConfig({
          pendingAnnualInterestBips: 900,
          pendingAnnualInterestProposalTimestamp: 1_000,
          pendingAnnualInterestResponseWindowEnd: 1_040
        })
      );
      expect(makeAccount(immature, { account: BORROWER }).previewSetAPR(900).status).to.eq(
        SetAprStatus.AprChangeNotReady
      );
    });

    it("blocks periodic APR reductions while pending withdrawals remain unpaid", () => {
      setNow(1_030);
      const market = makeMarket(
        makePeriodicConfig({
          pendingAnnualInterestBips: 900,
          pendingAnnualInterestProposalTimestamp: 1_000,
          pendingAnnualInterestResponseWindowEnd: 1_020
        }),
        {
          scaledPendingWithdrawals: BigNumber.from(1)
        }
      );

      expect(makeAccount(market, { account: BORROWER }).previewSetAPR(900).status).to.eq(
        SetAprStatus.UnpaidWithdrawalsExist
      );
    });

    it("allows matching periodic APR reductions after the response window closes", () => {
      setNow(1_030);
      const market = makeMarket(
        makePeriodicConfig({
          pendingAnnualInterestBips: 900,
          pendingAnnualInterestProposalTimestamp: 1_000,
          pendingAnnualInterestResponseWindowEnd: 1_020
        })
      );

      expect(makeAccount(market, { account: BORROWER }).previewSetAPR(900)).to.deep.eq({
        status: SetAprStatus.Ready,
        willChangeReserveRatio: false
      });
    });
  });

  describe("APR reduction proposals", () => {
    it("validates the borrower-only periodic proposal flow", () => {
      setNow(1_021);
      const borrower = makeAccount(makeMarket(), { account: BORROWER });

      expect(makeAccount().previewProposeAnnualInterestBips(900).status).to.eq(
        ProposeAnnualInterestBipsStatus.NotBorrower
      );
      expect(borrower.previewProposeAnnualInterestBips(0).status).to.eq(
        ProposeAnnualInterestBipsStatus.InvalidApr
      );
      expect(borrower.previewProposeAnnualInterestBips(1_000).status).to.eq(
        ProposeAnnualInterestBipsStatus.NotReduction
      );
      expect(borrower.previewProposeAnnualInterestBips(900).status).to.eq(
        ProposeAnnualInterestBipsStatus.Ready
      );

      setNow(1_005);
      expect(borrower.previewProposeAnnualInterestBips(900).status).to.eq(
        ProposeAnnualInterestBipsStatus.WithdrawalWindowOpen
      );
    });

    it("populates proposal transactions to the hooks contract", async () => {
      setNow(1_021);
      const borrower = makeAccount(makeMarket(), { account: BORROWER });
      const tx = await borrower.populateProposeAnnualInterestBips(900);
      const iface = IPeriodicTermHooks__factory.createInterface();

      expect(tx.to).to.eq(HOOKS);
      expect(iface.decodeFunctionData("proposeAnnualInterestBips", tx.data)).to.deep.eq([
        token.address,
        900
      ]);
    });
  });

  describe("periodic market deployment preview", () => {
    it("encodes periodic term hooks data in the protocol order", () => {
      const template = new PeriodicTermHooksTemplate(SupportedChainId.Sepolia, provider, {
        hooksTemplate: TEMPLATE,
        fees: {
          feeRecipient: constants.AddressZero,
          protocolFeeBips: 0
        },
        enabled: true,
        index: 0,
        name: "PeriodicTermHooks",
        totalMarkets: 0,
        signerAddress: BORROWER,
        isRegisteredBorrower: true
      });

      const preview = template.previewDeployMarket({
        hooksAddress: HOOKS,
        salt: constants.HashZero,
        asset: token,
        namePrefix: "Wildcat ",
        symbolPrefix: "wc",
        maxTotalSupply: token.getAmount(1_000_000),
        annualInterestBips: 1_000,
        delinquencyFeeBips: 0,
        delinquencyGracePeriod: 86_400,
        withdrawalBatchDuration: 86_400,
        reserveRatioBips: 0,
        firstWithdrawalWindowStart: 1_000,
        periodDuration: 100,
        withdrawalWindowDuration: 20,
        minimumDeposit: token.getAmount(123),
        transferAccess: TransferAccess.Disabled,
        depositAccess: DepositAccess.Open,
        withdrawalAccess: WithdrawalAccess.RequiresCredential
      });

      if (preview.status !== DeployMarketStatus.Ready) {
        throw new Error(`unexpected deployment preview status: ${preview.status}`);
      }

      expect(preview.fn).to.eq("deployMarket");
      const [parameters, hooksData] = preview.args as unknown as [{ hooks: BigNumber }, string];
      expect(parameters.hooks.toString()).to.eq(
        encodeHooksConfig({
          hooksAddress: HOOKS,
          useOnDeposit: false,
          useOnQueueWithdrawal: true,
          useOnTransfer: false
        }).toString()
      );

      const decoded = defaultAbiCoder.decode(
        ["uint32", "uint32", "uint32", "uint128", "bool"],
        hooksData
      );
      expect([
        BigNumber.from(decoded[0]).toString(),
        BigNumber.from(decoded[1]).toString(),
        BigNumber.from(decoded[2]).toString(),
        BigNumber.from(decoded[3]).toString(),
        decoded[4]
      ]).to.deep.eq(["1000", "100", "20", "123", true]);
    });
  });
});
