import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";
import { Token, TokenAmount, minTokenAmount } from "../token";
import { Market } from "../market";
import {
  MarketLenderStatusStructOutput,
  MarketDataWithLenderStatusStructOutput,
  WildcatMarketV2__factory,
  LenderAccountDataStructOutput,
  MarketDataWithLenderStatusV2StructOutput,
  LenderAccountDataV21StructOutput,
  MarketDataWithLenderStatusV21StructOutput,
  IOpenTermHooks__factory,
  IFixedTermHooks__factory,
  IPeriodicTermHooks__factory
} from "../typechain";
import { WithdrawalQueuedEvent } from "../typechain/WildcatMarket";
import {
  assert,
  DepositRecord,
  parseMarketRecord,
  parseSubgraphLenderStatus,
  parseSubgraphLenderHooksAccess,
  rayMul,
  SECONDS_IN_365_DAYS
} from "../utils";
import {
  SupportedChainId,
  getControllerContract,
  getLensContract,
  getLensV2Contract
} from "../constants";
import {
  HooksCredential,
  HooksKind,
  MarketVersion,
  PartialTransaction,
  SignerOrProvider
} from "../types";
import { LenderWithdrawalStatus } from "../withdrawal-status";
import {
  SubgraphAccountDataForLenderViewFragment,
  SubgraphDepositDataFragment
} from "../gql/graphql";
import {
  DepositStatus,
  RepayStatus,
  CloseMarketPreview,
  SetAprPreview,
  QueueWithdrawalStatus,
  isMarketInstanceArray,
  SetAprStatus,
  CloseMarketStatus,
  SetMaxTotalSupplyPreview,
  SetMaxTotalSupplyStatus,
  DepositPreview,
  QueueWithdrawalPreview,
  RepayPreview,
  ForceBuyBackPreview,
  ForceBuyBackStatus,
  SetMinimumDepositPreview,
  SetMinimumDepositStatus,
  SetFixedTermEndTimeStatus,
  SetFixedTermEndTimePreview,
  ProposeAnnualInterestBipsPreview,
  ProposeAnnualInterestBipsStatus
} from "./validation";
export * from "./validation";

export enum LenderRole {
  Null = 0,
  Blocked = 1,
  WithdrawOnly = 2,
  DepositAndWithdraw = 3
}

const NullProviderIndex = BigNumber.from(2).pow(24).sub(1).toNumber();

export type MarketAccountArgs = {
  account: string;
  /** For V1 markets - whether lender has been manually approved on controller  */
  isAuthorizedOnController?: boolean;
  /** For V2 markets - credentials on market hooks instance */
  credential?: HooksCredential;
  /** For V2 markets - whether lender has permanent withdrawal permissions */
  isKnownLender?: boolean;
  /** For V1 markets - access level enum */
  role: LenderRole;
  scaledMarketBalance: BigNumber;
  marketBalance: TokenAmount;
  underlyingBalance: TokenAmount;
  underlyingApproval: BigNumber;
  market: Market;
  deposits?: SubgraphDepositDataFragment[];
  totalDeposited?: TokenAmount;
  lastScaleFactor?: BigNumber;
  lastUpdatedTimestamp?: number;
  totalInterestEarned?: TokenAmount;
  numPendingWithdrawalBatches?: number;
  /** Whether lender had a LenderAccount entry in the subgraph */
  hadSubgraphEntry?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MarketAccount extends Omit<MarketAccountArgs, "deposits" | "hadSubgraphEntry"> {}

/**
 * Class to provide information about a market user's account
 * and to wrap interactions.
 *
 * Use `update()` to update the account's state.
 *
 *
 */
export class MarketAccount {
  public depositRecords: DepositRecord[];

  /** Whether lender had a LenderAccount entry in the subgraph */
  protected hadSubgraphEntry?: boolean;

  constructor(args: MarketAccountArgs) {
    Object.assign(this, args);
    this.depositRecords = (args.deposits ?? []).map((log) =>
      parseMarketRecord(this.market.underlyingToken, log)
    );
  }

  /** Whether lender has definitely interacted with the market */
  get hasEverInteracted(): boolean {
    return !!(
      this.hadSubgraphEntry ||
      this.role !== LenderRole.Null ||
      this.marketBalance.gt(0) ||
      this.depositRecords.length > 0 ||
      this.totalDeposited?.gt(0) ||
      this.totalInterestEarned?.gt(0)
    );
  }

  get chainId(): SupportedChainId {
    return this.market.chainId;
  }

  get userHasBalance(): boolean {
    return this.marketBalance.gt(0);
  }

  get userHasUnderlyingBalance(): boolean {
    return this.underlyingBalance.gt(0);
  }

  get isBorrower(): boolean {
    return this.market.borrower.toLowerCase() === this.account.toLowerCase();
  }

  get credentialExpiry(): number | undefined {
    if (this.credential && this.credential.lastProvider) {
      return this.credential.lastApprovalTimestamp + this.credential.lastProvider.timeToLive;
    }
    return undefined;
  }

  get hasValidCredential(): boolean {
    const expiry = this.credentialExpiry;
    return expiry !== undefined && expiry >= Date.now() / 1000;
  }

  /** Shim for functions in app that use lender role */
  get inferredRole(): LenderRole | undefined {
    if (this.depositAvailability === DepositStatus.Ready) {
      return LenderRole.DepositAndWithdraw;
    }
    if (this.withdrawalAvailability === QueueWithdrawalStatus.Ready) {
      return LenderRole.WithdrawOnly;
    }
    if (this.credential?.isBlockedFromDeposits || this.role === LenderRole.Blocked) {
      return LenderRole.Blocked;
    }
    return LenderRole.Null;
  }

  get depositAvailability(): DepositStatus {
    if (this.market.isClosed) return DepositStatus.MarketClosed;
    if (this.market.version === MarketVersion.V1) {
      if (this.role === LenderRole.Blocked) return DepositStatus.Blocked;
      if (
        this.role === LenderRole.DepositAndWithdraw ||
        (this.role === LenderRole.Null && !!this.isAuthorizedOnController)
      ) {
        return DepositStatus.Ready;
      }
      return DepositStatus.InsufficientRole;
    } else {
      const config = this.market.hooksConfig;
      assert(config !== undefined, `V2 market missing hooksConfig`);
      // Can deposit if the market does not use the onDeposit hook
      if (!config.flags!.useOnDeposit) return DepositStatus.Ready;
      // Can not deposit if the lender is blocked
      if (this.credential?.isBlockedFromDeposits) return DepositStatus.Blocked;
      // Can deposit if lender has credential or market does not require one
      if (config.depositRequiresAccess && !this.hasValidCredential) {
        return DepositStatus.RequiresAccess;
      }
      return DepositStatus.Ready;
    }
  }

  get withdrawalAvailability(): QueueWithdrawalStatus {
    if (this.market.version === MarketVersion.V1) {
      if (
        this.role === LenderRole.WithdrawOnly ||
        this.role === LenderRole.DepositAndWithdraw ||
        (this.role === LenderRole.Null && !!this.isAuthorizedOnController)
      ) {
        return QueueWithdrawalStatus.Ready;
      }
      return QueueWithdrawalStatus.InsufficientRole;
    } else {
      const config = this.market.hooksConfig;
      assert(config !== undefined, `V2 market missing hooksConfig`);
      // Can withdraw if market does not use wd hook
      if (!config.flags!.useOnQueueWithdrawal) return QueueWithdrawalStatus.Ready;
      // Can not withdraw if market in fixed term
      if (this.market.isInFixedTerm) return QueueWithdrawalStatus.MarketInClosedTerm;
      if (config.kind === HooksKind.PeriodicTerm && !this.market.isPeriodicWithdrawalWindowOpen) {
        return QueueWithdrawalStatus.WithdrawalWindowClosed;
      }
      // Can not withdraw if market requires access and lender has no credential and is not a known lender
      if (
        config.flags.useOnQueueWithdrawal &&
        (config.kind === HooksKind.OpenTerm || config.queueWithdrawalRequiresAccess) &&
        !(this.hasValidCredential || this.isKnownLender)
      ) {
        return QueueWithdrawalStatus.RequiresAccess;
      }
      return QueueWithdrawalStatus.Ready;
    }
  }

  canChangeAPR(apr: number): boolean {
    return this.isBorrower && apr > 0 && apr <= 10000 && this.market.canChangeAPR(apr);
  }

  /**
   * Get the amount of the underlying asset needed to close the market, with some
   * room for the interest that will accrue between now and the market's closure.
   *
   * If the amount is being calculated to check if the borrower already has a
   * sufficient allowance, 10 minutes of interest is added; if it is to actually
   * set the allowance, 2 hours of interest is added.
   */
  getApprovalAmountForCloseMarket(forAllowanceCheck?: boolean): TokenAmount {
    const baseAmount = this.market.outstandingDebt;
    const interestForNextHour = this.market.underlyingToken.getAmount(
      this.market.totalSupply
        .rayMul(this.market.effectiveBorrowerAPR)
        .mulDiv(forAllowanceCheck ? 600 : 7_200, SECONDS_IN_365_DAYS)
    );
    return baseAmount.add(interestForNextHour);
  }

  previewCloseMarket(): CloseMarketPreview {
    if (!this.isBorrower) return { status: CloseMarketStatus.NotBorrower };
    if (this.market.version === MarketVersion.V2) {
      const config = this.market.hooksConfig;
      assert(config !== undefined, `V2 market missing hooksConfig`);
      if (
        this.market.isInFixedTerm &&
        config.kind === HooksKind.FixedTerm &&
        !(
          config.allowClosureBeforeTerm ||
          (config.allowTermReduction && this.chainId !== SupportedChainId.Sepolia)
        )
      ) {
        return { status: CloseMarketStatus.EarlyClosureNotAllowed };
      }
    }

    // add interest to cover next hour
    const amount = this.getApprovalAmountForCloseMarket();
    const minimumAllowance = this.getApprovalAmountForCloseMarket(true);
    // If the borrower does not have enough balance to repay the market's outstanding debt plus
    // 10 minutes of interest, return InsufficientBalance
    if (minimumAllowance.gt(this.underlyingBalance)) {
      return { status: CloseMarketStatus.InsufficientBalance, outstanding: amount };
    }
    if (
      this.market.unpaidWithdrawalBatchExpiries.length > 0 &&
      this.market.version === MarketVersion.V1
    ) {
      return { status: CloseMarketStatus.UnpaidWithdrawalBatches };
    }
    // If the borrower does not have enough allowance to repay the market's outstanding debt plus
    // 10 minutes of interest, return InsufficientAllowance with a request to approve for an additional
    // 2 hours of interest
    if (!this.isApprovedFor(minimumAllowance)) {
      return { status: CloseMarketStatus.InsufficientAllowance, outstanding: amount };
    }
    return { status: CloseMarketStatus.Ready };
  }

  previewSetAPR(apr: number): SetAprPreview {
    if (!this.isBorrower) return { status: SetAprStatus.NotBorrower };
    if (!(apr > 0 && apr <= 10000)) return { status: SetAprStatus.InvalidApr };

    const config = this.market.hooksConfig;
    if (config?.kind === HooksKind.PeriodicTerm && apr < this.market.annualInterestBips) {
      if (config.pendingAprChangeProposalTimestamp === 0) {
        return { status: SetAprStatus.AprReductionNotProposed };
      }
      if (config.pendingAprChangeAnnualInterestBips !== apr) {
        return { status: SetAprStatus.AprChangeDoesNotMatchProposal };
      }
      if (Math.floor(Date.now() / 1_000) < config.pendingAprChangeResponseWindowEnd) {
        return { status: SetAprStatus.AprChangeNotReady };
      }
      if (!this.market.scaledPendingWithdrawals.isZero()) {
        return { status: SetAprStatus.UnpaidWithdrawalsExist };
      }
      return {
        status: SetAprStatus.Ready,
        willChangeReserveRatio: false
      };
    }

    const [originalReserveRatioBips, originalAnnualInterestBips] =
      this.market.originalReserveRatioAndAnnualInterestBips;

    const newReserveRatioBips = this.market.getReserveRatioForNewAPR(apr);
    const willChangeReserveRatio = newReserveRatioBips !== this.market.reserveRatioBips;
    const changeCausedByReset =
      this.market.temporaryReserveRatio && apr >= originalAnnualInterestBips;

    // If the market will update its reserve ratio, either because the new APR is lower
    // or because there is an old reserve ratio that needs to be reset, we need to check
    // if the market will become delinquent or already is, respectively.
    if (willChangeReserveRatio) {
      // If reserve is dropping, must currently not be delinquent, if it is increasing, must not become delinquent
      const reserveRatioThatMustNotBeDelinquent = Math.max(
        originalReserveRatioBips,
        newReserveRatioBips
      );
      const newCoverageLiquidity = this.market.calculateLiquidityCoverageForReserveRatio(
        reserveRatioThatMustNotBeDelinquent
      );
      if (this.market.totalAssets.lt(newCoverageLiquidity)) {
        return {
          status: SetAprStatus.InsufficientReserves,
          newCoverageLiquidity,
          newReserveRatio: newReserveRatioBips,
          missingReserves: newCoverageLiquidity.sub(this.market.totalAssets),
          changeCausedByReset
        };
      } else {
        return {
          status: SetAprStatus.Ready,
          willChangeReserveRatio: true,
          newCoverageLiquidity,
          newReserveRatio: newReserveRatioBips,
          changeCausedByReset
        };
      }
    } else {
      return {
        status: SetAprStatus.Ready,
        willChangeReserveRatio: false
      };
    }
  }

  previewProposeAnnualInterestBips(apr: number): ProposeAnnualInterestBipsPreview {
    if (this.market.version !== MarketVersion.V2) {
      return { status: ProposeAnnualInterestBipsStatus.NotV2Market };
    }
    if (!this.isBorrower) return { status: ProposeAnnualInterestBipsStatus.NotBorrower };
    if (!(apr > 0 && apr <= 10000)) {
      return { status: ProposeAnnualInterestBipsStatus.InvalidApr };
    }

    const config = this.market.hooksConfig;
    if (config?.kind !== HooksKind.PeriodicTerm) {
      return { status: ProposeAnnualInterestBipsStatus.NotPeriodicTermMarket };
    }
    if (apr >= this.market.annualInterestBips) {
      return { status: ProposeAnnualInterestBipsStatus.NotReduction };
    }
    if (this.market.isPeriodicWithdrawalWindowOpen) {
      return { status: ProposeAnnualInterestBipsStatus.WithdrawalWindowOpen };
    }
    return { status: ProposeAnnualInterestBipsStatus.Ready };
  }

  previewSetMaxTotalSupply(amount: TokenAmount): SetMaxTotalSupplyPreview {
    if (!this.isBorrower) return { status: SetMaxTotalSupplyStatus.NotBorrower };
    if (this.market.version === MarketVersion.V1 && amount.lt(this.market.totalSupply)) {
      return { status: SetMaxTotalSupplyStatus.BelowCurrentSupply };
    }
    return { status: SetMaxTotalSupplyStatus.Ready };
  }

  previewSetMinimumDeposit(_: TokenAmount): SetMinimumDepositPreview {
    if (this.market.version !== MarketVersion.V2)
      return { status: SetMinimumDepositStatus.NotV2Market };
    if (!this.isBorrower) return { status: SetMinimumDepositStatus.NotBorrower };
    return { status: SetMinimumDepositStatus.Ready };
  }

  previewSetFixedTermEndTime(endTime: number): SetFixedTermEndTimePreview {
    if (this.market.version !== MarketVersion.V2)
      return { status: SetFixedTermEndTimeStatus.NotV2Market };
    if (!this.isBorrower) return { status: SetFixedTermEndTimeStatus.NotBorrower };
    const config = this.market.hooksConfig;
    if (config && config.kind === HooksKind.FixedTerm) {
      if (!config.allowTermReduction && endTime <= config.fixedTermEndTime) {
        return { status: SetFixedTermEndTimeStatus.FixedTermEndTimeNotChangeable };
      }
      if (endTime > config.fixedTermEndTime) {
        return { status: SetFixedTermEndTimeStatus.FixedTermEndTimeIncrease };
      }
    } else {
      return { status: SetFixedTermEndTimeStatus.NotFixedTermMarket };
    }
    return { status: SetFixedTermEndTimeStatus.Ready };
  }

  async populateSetMinimumDeposit(amount: TokenAmount): Promise<PartialTransaction> {
    const { status } = this.previewSetMinimumDeposit(amount);
    assert(status === SetMinimumDepositStatus.Ready, `Cannot set minimum deposit: ${status}`);
    const config = this.market.hooksConfig;
    assert(config !== undefined, `V2 market missing hooksConfig`);
    const iface = IOpenTermHooks__factory.createInterface();
    return {
      to: config.hooksAddress,
      data: iface.encodeFunctionData("setMinimumDeposit", [this.market.address, amount.raw]),
      value: "0"
    };
  }

  async populateSetFixedTermEndTime(endTime: number): Promise<PartialTransaction> {
    const { status } = this.previewSetFixedTermEndTime(endTime);
    assert(status === SetFixedTermEndTimeStatus.Ready, `Cannot set fixed term end time: ${status}`);
    const config = this.market.hooksConfig;
    assert(config !== undefined, `V2 market missing hooksConfig`);
    const iface = IFixedTermHooks__factory.createInterface();
    return {
      to: config.hooksAddress,
      data: iface.encodeFunctionData("setFixedTermEndTime", [this.market.address, endTime]),
      value: "0"
    };
  }

  async setMinimumDeposit(amount: TokenAmount): Promise<ContractTransaction> {
    const { status } = this.previewSetMinimumDeposit(amount);
    assert(status === SetMinimumDepositStatus.Ready, `Cannot set minimum deposit: ${status}`);
    const config = this.market.hooksConfig;
    assert(config !== undefined, `V2 market missing hooksConfig`);
    const contract = IOpenTermHooks__factory.connect(config.hooksAddress, this.market.signer);
    return contract.setMinimumDeposit(this.market.address, amount.raw);
  }

  async setFixedTermEndTime(endTime: number): Promise<ContractTransaction> {
    const { status } = this.previewSetFixedTermEndTime(endTime);
    assert(status === SetFixedTermEndTimeStatus.Ready, `Cannot set fixed term end time: ${status}`);
    const config = this.market.hooksConfig;
    assert(config !== undefined, `V2 market missing hooksConfig`);
    const contract = IFixedTermHooks__factory.connect(config.hooksAddress, this.market.signer);
    return contract.setFixedTermEndTime(this.market.address, endTime);
  }

  populateProposeAnnualInterestBips(apr: number): PartialTransaction {
    const { status } = this.previewProposeAnnualInterestBips(apr);
    assert(
      status === ProposeAnnualInterestBipsStatus.Ready,
      `Cannot propose annual interest bips: ${status}`
    );
    const config = this.market.hooksConfig;
    assert(config?.kind === HooksKind.PeriodicTerm, `Market is not periodic term`);
    const iface = IPeriodicTermHooks__factory.createInterface();
    return {
      to: config.hooksAddress,
      data: iface.encodeFunctionData("proposeAnnualInterestBips", [this.market.address, apr]),
      value: "0"
    };
  }

  async proposeAnnualInterestBips(apr: number): Promise<ContractTransaction> {
    const { status } = this.previewProposeAnnualInterestBips(apr);
    assert(
      status === ProposeAnnualInterestBipsStatus.Ready,
      `Cannot propose annual interest bips: ${status}`
    );
    const config = this.market.hooksConfig;
    assert(config?.kind === HooksKind.PeriodicTerm, `Market is not periodic term`);
    const contract = IPeriodicTermHooks__factory.connect(config.hooksAddress, this.market.signer);
    return contract.proposeAnnualInterestBips(this.market.address, apr);
  }

  /* -------------------------------------------------------------------------- */
  /*                             Management Actions                             */
  /* -------------------------------------------------------------------------- */

  async closeMarket(): Promise<ContractTransaction> {
    const { status } = this.previewCloseMarket();
    assert(status === CloseMarketStatus.Ready, `Cannot close market: ${status}`);
    if (this.market.version === MarketVersion.V1) {
      assert(this.market.controller !== undefined, "Controller address is required for V1 markets");
      const controller = getControllerContract(this.market.signer, this.market.controller);
      return controller.closeMarket(this.market.address);
    }
    return this.market.contract.closeMarket();
  }

  populateCloseMarket(): PartialTransaction {
    const { status } = this.previewCloseMarket();
    assert(status === CloseMarketStatus.Ready, `Cannot close market: ${status}`);

    if (this.market.version === MarketVersion.V1) {
      assert(this.market.controller !== undefined, "Controller address is required for V1 markets");
      const controller = getControllerContract(this.market.signer, this.market.controller);
      return {
        to: controller.address,
        data: controller.interface.encodeFunctionData("closeMarket", [this.market.address]),
        value: "0"
      };
    }
    return {
      to: this.market.address,
      data: this.market.contract.interface.encodeFunctionData("closeMarket"),
      value: "0"
    };
  }

  async setMaxTotalSupply(amount: TokenAmount): Promise<ContractTransaction> {
    const { status } = this.previewSetMaxTotalSupply(amount);
    assert(status === SetMaxTotalSupplyStatus.Ready, `Cannot close market: ${status}`);
    if (this.market.version === MarketVersion.V1) {
      assert(this.market.controller !== undefined, "Controller address is required for V1 markets");
      const controller = getControllerContract(this.market.signer, this.market.controller);
      return controller.setMaxTotalSupply(this.market.address, amount.raw);
    } else {
      return this.market.contract.setMaxTotalSupply(amount.raw);
    }
  }

  async setAnnualInterestBips(newAprBips: number): Promise<ContractTransaction> {
    const { status } = this.previewSetAPR(newAprBips);
    assert(
      status === SetAprStatus.Ready,
      `Cannot set new APR of ${newAprBips / 10_000}%: ${status}`
    );
    if (this.market.version === MarketVersion.V1) {
      assert(this.market.controller !== undefined, "Controller address is required for V1 markets");
      const controller = getControllerContract(this.market.provider, this.market.controller);
      return controller.setAnnualInterestBips(this.market.address, newAprBips);
    } else {
      const contract = WildcatMarketV2__factory.connect(this.market.address, this.market.signer);
      return contract.setAnnualInterestAndReserveRatioBips(
        newAprBips,
        this.market.reserveRatioBips
      );
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Approval                                  */
  /* -------------------------------------------------------------------------- */

  isApprovedFor(amount: TokenAmount): boolean {
    return this.underlyingApproval.gte(amount.raw);
  }

  async approveMarket(amount: TokenAmount): Promise<ContractTransaction> {
    const token = this.market.underlyingToken;
    const signer = await token.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    return token.contract.approve(this.market.address, amount.raw);
  }

  async populateApproveMarket(amount: TokenAmount): Promise<PartialTransaction> {
    const token = this.market.underlyingToken;
    const signer = await token.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    return {
      to: token.address,
      data: token.contract.interface.encodeFunctionData("approve", [
        this.market.address,
        amount.raw
      ]),
      value: "0"
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                ForceBuyBack                                */
  /* -------------------------------------------------------------------------- */

  previewForceBuyBack(lender: string, amount: TokenAmount): ForceBuyBackPreview {
    if (!this.isBorrower) return { status: ForceBuyBackStatus.NotBorrower };
    if (this.market.version !== MarketVersion.V2) {
      return { status: ForceBuyBackStatus.V1NotSupported };
    }
    if (this.market.chainId !== SupportedChainId.Sepolia) {
      return { status: ForceBuyBackStatus.MainnetNotSupported };
    }
    if (amount.gt(this.underlyingBalance)) {
      return { status: ForceBuyBackStatus.InsufficientBalance };
    }
    if (this.market.isDelinquent || this.market.willBeDelinquent) {
      return { status: ForceBuyBackStatus.MarketDelinquent };
    }
    if (this.market.isInFixedTerm) {
      return { status: ForceBuyBackStatus.MarketInClosedTerm };
    }
    return {
      status: ForceBuyBackStatus.Ready
    };
  }

  async forceBuyBack(lender: string, amount: TokenAmount): Promise<ContractTransaction> {
    const { status } = this.previewForceBuyBack(lender, amount);
    assert(status === ForceBuyBackStatus.Ready, `Cannot force buy back: ${status}`);
    const contract = WildcatMarketV2__factory.connect(this.market.address, this.market.signer);
    return await contract.forceBuyBack(lender, amount.raw);
  }

  populateForceBuyBack(lender: string, amount: TokenAmount): PartialTransaction {
    const { status } = this.previewForceBuyBack(lender, amount);
    assert(status === ForceBuyBackStatus.Ready, `Cannot force buy back: ${status}`);

    const contract = WildcatMarketV2__factory.connect(this.market.address, this.market.signer);
    return {
      to: this.market.address,
      data: contract.interface.encodeFunctionData("forceBuyBack", [lender, amount.raw]),
      value: "0"
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Deposits                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * @returns Maximum amount of underlying token user can deposit
   *          given their underlying balance and the market's max supply
   */
  get maximumDeposit(): TokenAmount {
    return minTokenAmount(this.market.maximumDeposit, this.underlyingBalance);
  }

  /**
   * @returns Amount of underlying token user can actually deposit
   *          given a target amount.
   */
  getDepositAmount(amount: TokenAmount): TokenAmount {
    return minTokenAmount(amount, this.maximumDeposit);
  }

  previewDeposit(amount: TokenAmount): DepositPreview {
    const status = this.depositAvailability;
    if (status !== DepositStatus.Ready) return { status };
    if (amount.gt(this.market.maximumDeposit)) {
      return { status: DepositStatus.ExceedsMaximumDeposit };
    }
    if (amount.gt(this.underlyingBalance)) {
      return { status: DepositStatus.InsufficientBalance };
    }
    if (!this.isApprovedFor(amount)) {
      return { status: DepositStatus.InsufficientAllowance };
    }
    if (
      this.market.version === MarketVersion.V2 &&
      this.market.hooksConfig?.minimumDeposit?.gt(0) &&
      amount.lt(this.market.hooksConfig.minimumDeposit)
    ) {
      return { status: DepositStatus.BelowMinimumDeposit };
    }
    return { status: DepositStatus.Ready };
  }

  async populateDeposit(amount: TokenAmount): Promise<PartialTransaction> {
    const { status } = this.previewDeposit(amount);
    assert(status === DepositStatus.Ready, `Cannot deposit: ${status}`);

    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }

    return {
      to: this.market.address,
      data: this.market.contract.interface.encodeFunctionData("deposit", [amount.raw]),
      value: "0"
    };
  }

  async deposit(amount: TokenAmount): Promise<ContractTransaction> {
    const { status } = this.previewDeposit(amount);
    assert(status === DepositStatus.Ready, `Cannot deposit: ${status}`);
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    return this.market.contract.deposit(amount.raw);
  }

  /* ------ Withdrawals ------ */

  previewQueueWithdrawal(amount: TokenAmount): QueueWithdrawalPreview {
    const status = this.withdrawalAvailability;
    if (status !== QueueWithdrawalStatus.Ready) return { status };
    if (amount.gt(this.marketBalance)) {
      return { status: QueueWithdrawalStatus.InsufficientBalance };
    }
    return { status: QueueWithdrawalStatus.Ready };
  }

  async queueWithdrawal(amount: TokenAmount): Promise<{
    withdrawal: LenderWithdrawalStatus;
    transaction: ContractTransaction;
    receipt: ContractReceipt;
  }> {
    const { status } = this.previewQueueWithdrawal(amount);
    assert(status === QueueWithdrawalStatus.Ready, `Cannot queue withdrawal: ${status}`);

    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    const transaction = await this.market.contract.queueWithdrawal(amount.raw);
    const receipt = await transaction.wait();
    const queuedWithdrawalTopic = this.market.contract.interface.getEventTopic("WithdrawalQueued");
    const queuedWithdrawalTransaction = toQueueWithdrawalTransaction(
      this.market.underlyingToken,
      receipt.events!.find((e) => e.topics[0] === queuedWithdrawalTopic) as WithdrawalQueuedEvent
    );
    if (!queuedWithdrawalTransaction) throw Error("No queued withdrawal event found");

    const withdrawal = await LenderWithdrawalStatus.getWithdrawalForLender(
      this.market,
      queuedWithdrawalTransaction.expiry,
      this.account
    );
    return {
      withdrawal,
      transaction,
      receipt
    };
  }

  async queueFullWithdrawal(): Promise<{
    withdrawal: LenderWithdrawalStatus;
    transaction: ContractTransaction;
    receipt: ContractReceipt;
  }> {
    const { status } = this.previewQueueWithdrawal(this.marketBalance);
    assert(status === QueueWithdrawalStatus.Ready, `Cannot queue withdrawal: ${status}`);

    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    let transaction: ContractTransaction;
    if (this.market.version === MarketVersion.V2) {
      const contract = WildcatMarketV2__factory.connect(this.market.address, this.market.signer);
      transaction = await contract.queueFullWithdrawal();
    } else {
      transaction = await this.market.contract.queueWithdrawal(this.marketBalance.raw);
    }
    const receipt = await transaction.wait();
    const queuedWithdrawalTopic = this.market.contract.interface.getEventTopic("WithdrawalQueued");
    const queuedWithdrawalTransaction = toQueueWithdrawalTransaction(
      this.market.underlyingToken,
      receipt.events!.find((e) => e.topics[0] === queuedWithdrawalTopic) as WithdrawalQueuedEvent
    );
    if (!queuedWithdrawalTransaction) throw Error("No queued withdrawal event found");

    const withdrawal = await LenderWithdrawalStatus.getWithdrawalForLender(
      this.market,
      queuedWithdrawalTransaction.expiry,
      this.account
    );
    return {
      withdrawal,
      transaction,
      receipt
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Repayments                                 */
  /* -------------------------------------------------------------------------- */

  get maximumRepay(): TokenAmount {
    return minTokenAmount(this.market.outstandingDebt, this.underlyingBalance);
  }

  get canRepayDelinquent(): boolean {
    return this.market.delinquentDebt.lte(this.underlyingBalance) && this.isBorrower;
  }

  get canRepayOutstanding(): boolean {
    return this.market.outstandingDebt.lte(this.underlyingBalance) && this.isBorrower;
  }

  /**
   * @returns Amount of underlying token user can actually repay
   *          given a target amount.
   */
  getRepayAmount(amount: TokenAmount): TokenAmount {
    return minTokenAmount(amount, this.maximumRepay);
  }

  previewRepay(amount: TokenAmount): RepayPreview {
    if (this.market.isClosed) return { status: RepayStatus.MarketClosed };
    if (amount.gt(this.underlyingBalance)) {
      return { status: RepayStatus.InsufficientBalance };
    }
    if (!this.isApprovedFor(amount)) {
      return { status: RepayStatus.InsufficientAllowance };
    }
    // if (amount.gt(this.market.outstandingDebt)) {
    //   return { status: RepayStatus.ExceedsOutstandingDebt };
    // }
    return { status: RepayStatus.Ready };
  }

  async repay(amount: BigNumber): Promise<ContractTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) throw Error("Only borrower can repay");

    return this.market.contract.repay(amount);
  }

  async populateRepay(amount: BigNumber): Promise<PartialTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) throw Error("Only borrower can repay");

    return {
      to: this.market.address,
      data: this.market.contract.interface.encodeFunctionData("repay", [amount]),
      value: "0"
    };
  }

  async repayOutstandingDebt(): Promise<ContractTransaction> {
    if (this.market.version !== MarketVersion.V1) {
      throw Error(`Only V1 supports repayOutstandingDebt`);
    }
    if (!this.isBorrower) throw Error("Only borrower can repay");
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }

    return this.market.contract.repayOutstandingDebt();
  }

  async populateRepayOutstandingDebt(): Promise<PartialTransaction> {
    if (this.market.version !== MarketVersion.V1) {
      throw Error(`Only V1 supports repayOutstandingDebt`);
    }
    if (!this.isBorrower) throw Error("Only borrower can repay");
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }

    return {
      to: this.market.address,
      data: this.market.contract.interface.encodeFunctionData("repayOutstandingDebt"),
      value: "0"
    };
  }

  async repayDelinquentDebt(): Promise<ContractTransaction> {
    if (this.market.version !== MarketVersion.V1) {
      throw Error(`Only V1 supports repayDelinquentDebt`);
    }
    if (!this.isBorrower) throw Error("Only borrower can repay");
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }

    return this.market.contract.repayDelinquentDebt();
  }

  async populateRepayDelinquentDebt(): Promise<PartialTransaction> {
    if (this.market.version !== MarketVersion.V1) {
      throw Error(`Only V1 supports repayDelinquentDebt`);
    }
    if (!this.isBorrower) throw Error("Only borrower can repay");
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }

    return {
      to: this.market.address,
      data: this.market.contract.interface.encodeFunctionData("repayDelinquentDebt"),
      value: "0"
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Borrow                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * @returns Amount of underlying token borrower can borrow
   */
  getBorrowableAmount(amount: TokenAmount): TokenAmount {
    return minTokenAmount(amount, this.market.borrowableAssets);
  }

  async borrow(amount: TokenAmount): Promise<ContractTransaction> {
    const signer = await this.market.signer.getAddress();
    if (!this.isBorrower) throw Error("Only borrower can borrow");
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (amount.gt(this.market.borrowableAssets)) {
      throw Error("Insufficient borrowable assets");
    }
    return this.market.contract.borrow(amount.raw);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Updates                                  */
  /* -------------------------------------------------------------------------- */

  async update(): Promise<void> {
    const acccountMarketInfo = await getLensContract(
      this.chainId,
      this.market.provider
    ).getMarketLenderStatus(this.account, this.market.address);
    this.updateWith(acccountMarketInfo);
  }

  updateWith(
    info:
      | MarketLenderStatusStructOutput
      | LenderAccountDataStructOutput
      | LenderAccountDataV21StructOutput
  ): void {
    if ("isAuthorizedOnController" in info) {
      assert(
        this.market.version === MarketVersion.V1,
        "V2 market can not be updated with V1 lens data"
      );
      this.isAuthorizedOnController = info.isAuthorizedOnController;
      this.role = info.role;
    } else {
      assert(
        this.market.version === MarketVersion.V2,
        "V1 market can not be updated with V2 lens data"
      );
      this.credential = {
        canRefresh: info.canRefresh,
        isBlockedFromDeposits: info.isBlockedFromDeposits,
        lastApprovalTimestamp: info.lastApprovalTimestamp,
        lastProvider: {
          isApproved: true,
          providerAddress: info.lastProvider.providerAddress,
          isPullProvider: info.lastProvider.pullProviderIndex !== NullProviderIndex,
          isPushProvider: info.lastProvider.pushProviderIndex !== NullProviderIndex,
          pullProviderIndex: info.lastProvider.pullProviderIndex,
          pushProviderIndex: info.lastProvider.pushProviderIndex,
          timeToLive: info.lastProvider.timeToLive
        }
      };
      this.isKnownLender = info.isKnownLender;
    }
    this.scaledMarketBalance = info.scaledBalance;
    this.marketBalance = this.market.marketToken.getAmount(info.normalizedBalance);
    this.underlyingBalance = this.market.underlyingToken.getAmount(info.underlyingBalance);
    this.underlyingApproval = info.underlyingApproval;
    this.processInterestAccrued();
  }

  private calculateInterestEarned(): BigNumber {
    if (!this.lastScaleFactor) return BigNumber.from(0);
    if (this.scaledMarketBalance.eq(0) || this.lastScaleFactor?.eq(this.market.scaleFactor)) {
      return BigNumber.from(0);
    }
    const lastBalance = rayMul(this.scaledMarketBalance, this.lastScaleFactor);
    const currentBalance = rayMul(this.scaledMarketBalance, this.market.scaleFactor);
    return currentBalance.sub(lastBalance);
  }

  processInterestAccrued(): void {
    if (!this.lastScaleFactor || !this.totalInterestEarned) return;
    if (!this.lastScaleFactor.eq(this.market.scaleFactor)) {
      const interestEarned = this.calculateInterestEarned();
      this.lastScaleFactor = this.market.scaleFactor;
      this.totalInterestEarned = this.totalInterestEarned.add(interestEarned);
    }
    if (this.lastUpdatedTimestamp != this.market.lastInterestAccruedTimestamp) {
      this.lastUpdatedTimestamp = this.market.lastInterestAccruedTimestamp;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                             Builders / Getters                             */
  /* -------------------------------------------------------------------------- */

  static fromSubgraphAccountData(
    market: Market,
    data: SubgraphAccountDataForLenderViewFragment
  ): MarketAccount {
    const scaledBalance = BigNumber.from(data.scaledBalance);

    const account = new MarketAccount({
      account: data.address,
      isAuthorizedOnController: data.controllerAuthorization?.authorized ?? false,
      role: parseSubgraphLenderStatus(data.role),
      scaledMarketBalance: scaledBalance,
      marketBalance: market.marketToken.getAmount(rayMul(scaledBalance, market.scaleFactor)),
      underlyingBalance: market.underlyingToken.getAmount(0),
      underlyingApproval: BigNumber.from(0),
      market,
      deposits: data.deposits,
      totalDeposited: market.underlyingToken.getAmount(data.totalDeposited),
      lastScaleFactor: BigNumber.from(data.lastScaleFactor),
      lastUpdatedTimestamp: data.lastUpdatedTimestamp,
      totalInterestEarned: market.underlyingToken.getAmount(data.totalInterestEarned),
      numPendingWithdrawalBatches: data.numPendingWithdrawalBatches,
      credential: data.hooksAccess ? parseSubgraphLenderHooksAccess(data.hooksAccess) : undefined,
      isKnownLender: !!data.knownLenderStatus?.id,
      hadSubgraphEntry: true
    });
    account.processInterestAccrued();
    return account;
  }

  static fromMarketLenderStatus(
    account: string,
    info: MarketLenderStatusStructOutput,
    market: Market
  ): MarketAccount {
    return new MarketAccount({
      account,
      isAuthorizedOnController: info.isAuthorizedOnController,
      role: info.role as LenderRole,
      scaledMarketBalance: info.scaledBalance,
      marketBalance: market.marketToken.getAmount(info.normalizedBalance),
      underlyingBalance: market.underlyingToken.getAmount(info.underlyingBalance),
      underlyingApproval: info.underlyingApproval,
      market
    });
  }

  static fromLenderAccountData(
    market: Market,
    data: LenderAccountDataStructOutput | LenderAccountDataV21StructOutput
  ): MarketAccount {
    return new MarketAccount({
      account: data.lender,
      market,
      role: LenderRole.Null,
      marketBalance: market.marketToken.getAmount(data.normalizedBalance),
      scaledMarketBalance: data.scaledBalance,
      underlyingApproval: data.underlyingApproval,
      underlyingBalance: market.underlyingToken.getAmount(data.underlyingBalance),
      isAuthorizedOnController: false,
      isKnownLender: data.isKnownLender,
      credential: {
        canRefresh: data.canRefresh,
        isBlockedFromDeposits: data.isBlockedFromDeposits,
        lastApprovalTimestamp: data.lastApprovalTimestamp,
        lastProvider: {
          isApproved: true,
          providerAddress: data.lastProvider.providerAddress,
          isPullProvider: data.lastProvider.pullProviderIndex !== NullProviderIndex,
          pullProviderIndex: data.lastProvider.pullProviderIndex,
          isPushProvider: data.lastProvider.pushProviderIndex !== NullProviderIndex,
          pushProviderIndex: data.lastProvider.pushProviderIndex,
          timeToLive: data.lastProvider.timeToLive
        }
      }
    });
  }

  static fromMarketDataWithLenderStatus(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    account: string,
    info:
      | MarketDataWithLenderStatusStructOutput
      | MarketDataWithLenderStatusV2StructOutput
      | MarketDataWithLenderStatusV21StructOutput
  ): MarketAccount {
    if ("controller" in info.market) {
      info = info as MarketDataWithLenderStatusStructOutput;
      return MarketAccount.fromMarketLenderStatus(
        account,
        info.lenderStatus,
        Market.fromMarketData(chainId, info.market, provider)
      );
    } else {
      info = info as
        | MarketDataWithLenderStatusV2StructOutput
        | MarketDataWithLenderStatusV21StructOutput;
      return MarketAccount.fromLenderAccountData(
        Market.fromMarketDataV2(chainId, provider, info.market),
        info.lenderStatus
      );
    }
  }

  static fromMarketDataOnly(
    market: Market,
    account: string,
    isAuthorizedOnController: boolean
  ): MarketAccount {
    return new MarketAccount({
      account,
      isAuthorizedOnController,
      role: LenderRole.Null,
      scaledMarketBalance: BigNumber.from(0),
      marketBalance: market.marketToken.getAmount(0),
      underlyingBalance: market.underlyingToken.getAmount(0),
      underlyingApproval: BigNumber.from(0),
      market
    });
  }

  /**
   * Get a `MarketAccount` for a given account and existing `Market` instance.
   * If `market` is a string, the market data will be fetched in the same call as the account data.
   */
  static async getMarketAccount(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    account: string,
    market: Market | string
  ): Promise<MarketAccount> {
    const lens = getLensContract(chainId, provider);
    if (market instanceof Market) {
      return lens
        .getMarketLenderStatus(account, market.address)
        .then((info) => MarketAccount.fromMarketLenderStatus(account, info, market));
    } else {
      return lens
        .getMarketDataWithLenderStatus(account, market)
        .then((info) =>
          MarketAccount.fromMarketDataWithLenderStatus(chainId, provider, account, info)
        );
    }
  }

  /**
   * Get a `MarketAccount` for a given account and existing `Market` instance.
   * If `market` is a string, the market data will be fetched in the same call as the account data.
   */
  static async getMarketAccountV2(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    account: string,
    market: Market | string
  ): Promise<MarketAccount> {
    const lens = getLensV2Contract(chainId, provider);
    if (market instanceof Market) {
      return lens
        .getMarketDataWithLenderStatus(account, market.address)
        .then((info) =>
          MarketAccount.fromMarketDataWithLenderStatus(chainId, provider, account, info)
        );
    } else {
      return lens
        .getMarketDataWithLenderStatus(account, market)
        .then((info) =>
          MarketAccount.fromMarketDataWithLenderStatus(chainId, provider, account, info)
        );
    }
  }

  /**
   * Get multiple `MarketAccount`s given an account and existing list of `Market`
   * instances or market addresses. If `markets` is an array of strings, the market
   * data will be fetched in the same call as the account data.
   */
  static async getMarketAccountsForLender(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    account: string,
    markets: Market[] | string[]
  ): Promise<MarketAccount[]> {
    const lens = getLensContract(chainId, provider);
    if (markets.length === 0) {
      return [];
    }
    if (isMarketInstanceArray(markets)) {
      return lens
        .getMarketsLenderStatus(
          account,
          markets.map((v) => v.address)
        )
        .then((infos) =>
          infos.map((info, i) => MarketAccount.fromMarketLenderStatus(account, info, markets[i]))
        );
    } else {
      return lens
        .getMarketsDataWithLenderStatus(account, markets)
        .then((infos) =>
          infos.map((info) =>
            MarketAccount.fromMarketDataWithLenderStatus(chainId, provider, account, info)
          )
        );
    }
  }

  /**
   * Get all `MarketAccount`s for a given account.
   * Fetches the market data in the same call as the account data.
   */
  static getAllMarketAccountsForLender(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    account: string
  ): Promise<MarketAccount[]> {
    const lens = getLensContract(chainId, provider);
    return lens
      .getAllMarketsDataWithLenderStatus(account)
      .then((infos) =>
        infos.map((info) =>
          MarketAccount.fromMarketDataWithLenderStatus(chainId, provider, account, info)
        )
      );
  }

  /**
   * Get paginated `MarketAccount`s for a given account.
   * Fetches the market data in the same call as the account data.
   * @note Throws an error if `start + count` exceeds the number of markets.
   */
  static getPaginatedMarketAccounts(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    account: string,
    start = 0,
    count: number
  ): Promise<MarketAccount[]> {
    const lens = getLensContract(chainId, provider);
    return lens
      .getPaginatedMarketsDataWithLenderStatus(account, start, count)
      .then((infos) =>
        infos.map((info) =>
          MarketAccount.fromMarketDataWithLenderStatus(chainId, provider, account, info)
        )
      );
  }
}
type QueueWithdrawalTransaction = {
  expiry: number;
  lender: string;
  market: string;
  scaledAmount: BigNumber;
  originalAmount: TokenAmount;
  transactionHash: string;
  blockNumber: number;
};

const toQueueWithdrawalTransaction = (
  underlyingToken: Token,
  log: WithdrawalQueuedEvent
): QueueWithdrawalTransaction => ({
  transactionHash: log.transactionHash,
  blockNumber: log.blockNumber,
  expiry: log.args.expiry.toNumber(),
  lender: log.args.account,
  market: log.address,
  scaledAmount: log.args.scaledAmount,
  originalAmount: underlyingToken.getAmount(log.args.normalizedAmount)
});
