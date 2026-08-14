import { Token, TokenAmount, minTokenAmount, toRawAmount } from "../token";
import { Market } from "../market";
import {
  MarketLenderStatusStructOutput,
  MarketDataWithLenderStatusStructOutput,
  LenderAccountDataStructOutput,
  MarketDataWithLenderStatusV2StructOutput,
  LenderAccountDataV2_5StructOutput,
  MarketDataWithLenderStatusV2_5StructOutput,
  MarketLiveDataWithLenderStatusV2_5StructOutput
} from "../lens-types";
import {
  assert,
  DepositRecord,
  parseMarketRecord,
  parseSubgraphLenderStatus,
  parseSubgraphLenderHooksAccess,
  rayMulBigint,
  SECONDS_IN_365_DAYS,
  prepareTransaction,
  toNumber,
  type BigintNumberish
} from "../utils";
import { SupportedChainId, hasDeploymentAddress } from "../constants";
import {
  getRegisteredMarkets,
  getRegisteredMarketsCount,
  getRegisteredMarketsPage
} from "../internal/arch-controller";
import {
  getLatestLenderAccountData,
  getLatestLenderAccountsData,
  getLatestMarketDataWithLenderStatus,
  getLatestMarketsDataWithLenderStatus,
  getUnifiedMarketsLiveDataWithLenderStatusV2,
  getLegacyAllMarketsDataWithLenderStatus,
  getLegacyMarketDataWithLenderStatus,
  getLegacyMarketLenderStatus,
  getLegacyMarketsDataWithLenderStatus,
  getLegacyMarketsLenderStatus,
  getLegacyPaginatedMarketsDataWithLenderStatus
} from "../internal/market-lens";
import {
  HooksCredential,
  HooksKind,
  IndexedLenderAccountSnapshot,
  MarketVersion,
  PartialTransaction,
  ReadStateSource,
  SignerOrProvider,
  SubmittedTransactionResult,
  TransactionHash
} from "../types";
import { LenderWithdrawalStatus } from "../withdrawal-status";
import {
  SubgraphAccountDataForLenderViewFragment,
  SubgraphAccountDataForLenderListViewFragment,
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
  SetFixedTermEndTimePreview
} from "./validation";
import {
  iERC20Abi,
  iFixedTermHooksAbi,
  iOpenTermHooksAbi,
  wildcatMarketAbi,
  wildcatMarketControllerAbi,
  wildcatMarketV2Abi
} from "../abi";
import {
  submitPreparedTransaction,
  submitPreparedTransactionAndWait
} from "../internal/viem-write";
import { parseEventLogs, type TransactionReceipt } from "viem";
import { normalizeSubgraphLenderAccountSnapshot } from "../gql/normalizers";
import { roleProviderFromLensData } from "../access/utils";
export * from "./validation";

export enum LenderRole {
  Null = 0,
  Blocked = 1,
  WithdrawOnly = 2,
  DepositAndWithdraw = 3
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const hasUnifiedLatestLensForAccountReads = (chainId: SupportedChainId): boolean => {
  return hasDeploymentAddress(chainId, "MarketLensV2_5");
};

type LatestLenderAccountDataStructOutput =
  | LenderAccountDataStructOutput
  | LenderAccountDataV2_5StructOutput;

type MarketDataWithLenderStatusOutput =
  | MarketDataWithLenderStatusStructOutput
  | MarketDataWithLenderStatusV2StructOutput
  | MarketDataWithLenderStatusV2_5StructOutput;

const zeroLenderBalances = (
  info: LatestLenderAccountDataStructOutput
): LatestLenderAccountDataStructOutput => ({
  ...info,
  scaledBalance: 0n,
  normalizedBalance: 0n,
  underlyingBalance: 0n,
  underlyingApproval: 0n
});

const zeroLegacyLenderBalances = (
  info: MarketLenderStatusStructOutput
): MarketLenderStatusStructOutput => ({
  ...info,
  scaledBalance: 0n,
  normalizedBalance: 0n,
  underlyingBalance: 0n,
  underlyingApproval: 0n
});

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
  scaledMarketBalance: bigint;
  marketBalance: TokenAmount;
  underlyingBalance: TokenAmount;
  underlyingApproval: bigint;
  market: Market;
  deposits?: SubgraphDepositDataFragment[];
  totalDeposited?: TokenAmount;
  lastScaleFactor?: bigint;
  lastUpdatedTimestamp?: number;
  totalInterestEarned?: TokenAmount;
  numPendingWithdrawalBatches?: number;
  /** Whether lender had a LenderAccount entry in the subgraph */
  hadSubgraphEntry?: boolean;
  indexedSnapshot?: IndexedLenderAccountSnapshot;
  stateSource?: ReadStateSource;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MarketAccount extends Omit<MarketAccountArgs, "deposits" | "hadSubgraphEntry"> {
  stateSource: ReadStateSource;
}

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
    Object.assign(this, { ...args, stateSource: args.stateSource ?? args.market.stateSource });
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

  previewSetMaxTotalSupply(amount: TokenAmount): SetMaxTotalSupplyPreview {
    if (!this.isBorrower) return { status: SetMaxTotalSupplyStatus.NotBorrower };
    if (this.market.version === MarketVersion.V1 && amount.lt(this.market.totalSupply)) {
      return { status: SetMaxTotalSupplyStatus.BelowCurrentSupply };
    }
    return { status: SetMaxTotalSupplyStatus.Ready };
  }

  previewSetMinimumDeposit(amount: TokenAmount): SetMinimumDepositPreview {
    if (this.market.version !== MarketVersion.V2)
      return { status: SetMinimumDepositStatus.NotV2Market };
    if (!this.isBorrower) return { status: SetMinimumDepositStatus.NotBorrower };
    const config = this.market.hooksConfig;
    assert(config !== undefined, `V2 market missing hooksConfig`);
    if (amount.gt(0) && !config.flags.useOnDeposit) {
      return { status: SetMinimumDepositStatus.DepositHookNotEnabled };
    }
    if (config.kind === HooksKind.PeriodicTerm && amount.raw > (1n << 96n) - 1n) {
      return { status: SetMinimumDepositStatus.MinimumDepositTooHigh };
    }
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
    return prepareTransaction({
      to: config.hooksAddress,
      abi: iOpenTermHooksAbi,
      functionName: "setMinimumDeposit",
      args: [this.market.address, amount.raw]
    });
  }

  async populateSetFixedTermEndTime(endTime: number): Promise<PartialTransaction> {
    const { status } = this.previewSetFixedTermEndTime(endTime);
    assert(status === SetFixedTermEndTimeStatus.Ready, `Cannot set fixed term end time: ${status}`);
    const config = this.market.hooksConfig;
    assert(config !== undefined, `V2 market missing hooksConfig`);
    return prepareTransaction({
      to: config.hooksAddress,
      abi: iFixedTermHooksAbi,
      functionName: "setFixedTermEndTime",
      args: [this.market.address, endTime]
    });
  }

  async setMinimumDeposit(amount: TokenAmount): Promise<TransactionHash> {
    return submitPreparedTransaction(
      this.market.signer,
      await this.populateSetMinimumDeposit(amount)
    );
  }

  async setFixedTermEndTime(endTime: number): Promise<TransactionHash> {
    return submitPreparedTransaction(
      this.market.signer,
      await this.populateSetFixedTermEndTime(endTime)
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                             Management Actions                             */
  /* -------------------------------------------------------------------------- */

  async closeMarket(): Promise<TransactionHash> {
    return submitPreparedTransaction(this.market.signer, this.populateCloseMarket());
  }

  populateCloseMarket(): PartialTransaction {
    const { status } = this.previewCloseMarket();
    assert(status === CloseMarketStatus.Ready, `Cannot close market: ${status}`);

    if (this.market.version === MarketVersion.V1) {
      assert(this.market.controller !== undefined, "Controller address is required for V1 markets");
      return prepareTransaction({
        to: this.market.controller,
        abi: wildcatMarketControllerAbi,
        functionName: "closeMarket",
        args: [this.market.address]
      });
    }
    return prepareTransaction({
      to: this.market.address,
      abi: wildcatMarketV2Abi,
      functionName: "closeMarket"
    });
  }

  async setMaxTotalSupply(amount: TokenAmount): Promise<TransactionHash> {
    const { status } = this.previewSetMaxTotalSupply(amount);
    assert(status === SetMaxTotalSupplyStatus.Ready, `Cannot close market: ${status}`);
    if (this.market.version === MarketVersion.V1) {
      assert(this.market.controller !== undefined, "Controller address is required for V1 markets");
      return submitPreparedTransaction(
        this.market.signer,
        prepareTransaction({
          to: this.market.controller,
          abi: wildcatMarketControllerAbi,
          functionName: "setMaxTotalSupply",
          args: [this.market.address, amount.raw]
        })
      );
    }
    return submitPreparedTransaction(
      this.market.signer,
      prepareTransaction({
        to: this.market.address,
        abi: wildcatMarketV2Abi,
        functionName: "setMaxTotalSupply",
        args: [amount.raw]
      })
    );
  }

  async setAnnualInterestBips(newAprBips: number): Promise<TransactionHash> {
    const { status } = this.previewSetAPR(newAprBips);
    assert(
      status === SetAprStatus.Ready,
      `Cannot set new APR of ${newAprBips / 10_000}%: ${status}`
    );
    if (this.market.version === MarketVersion.V1) {
      assert(this.market.controller !== undefined, "Controller address is required for V1 markets");
      return submitPreparedTransaction(
        this.market.signer,
        prepareTransaction({
          to: this.market.controller,
          abi: wildcatMarketControllerAbi,
          functionName: "setAnnualInterestBips",
          args: [this.market.address, newAprBips]
        })
      );
    }
    return submitPreparedTransaction(
      this.market.signer,
      prepareTransaction({
        to: this.market.address,
        abi: wildcatMarketV2Abi,
        functionName: "setAnnualInterestAndReserveRatioBips",
        args: [newAprBips, this.market.reserveRatioBips]
      })
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Approval                                  */
  /* -------------------------------------------------------------------------- */

  isApprovedFor(amount: TokenAmount): boolean {
    return this.underlyingApproval >= amount.raw;
  }

  async approveMarket(amount: TokenAmount): Promise<TransactionHash> {
    return submitPreparedTransaction(this.market.signer, await this.populateApproveMarket(amount));
  }

  async populateApproveMarket(amount: TokenAmount): Promise<PartialTransaction> {
    const token = this.market.underlyingToken;
    const signer = await token.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    return prepareTransaction({
      to: token.address,
      abi: iERC20Abi,
      functionName: "approve",
      args: [this.market.address, amount.raw]
    });
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
    const hooksConfig = this.market.hooksConfig;
    if (
      !hooksConfig ||
      hooksConfig.kind === HooksKind.PeriodicTerm ||
      !hooksConfig.allowForceBuyBacks
    ) {
      return { status: ForceBuyBackStatus.HooksNotSupported };
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

  async forceBuyBack(lender: string, amount: TokenAmount): Promise<TransactionHash> {
    return submitPreparedTransaction(this.market.signer, this.populateForceBuyBack(lender, amount));
  }

  populateForceBuyBack(lender: string, amount: TokenAmount): PartialTransaction {
    const { status } = this.previewForceBuyBack(lender, amount);
    assert(status === ForceBuyBackStatus.Ready, `Cannot force buy back: ${status}`);

    return prepareTransaction({
      to: this.market.address,
      abi: wildcatMarketV2Abi,
      functionName: "forceBuyBack",
      args: [lender, amount.raw]
    });
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

    return prepareTransaction({
      to: this.market.address,
      abi: wildcatMarketAbi,
      functionName: "deposit",
      args: [amount.raw]
    });
  }

  async deposit(amount: TokenAmount): Promise<TransactionHash> {
    return submitPreparedTransaction(this.market.signer, await this.populateDeposit(amount));
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

  async queueWithdrawal(
    amount: TokenAmount
  ): Promise<SubmittedTransactionResult<LenderWithdrawalStatus>> {
    const { status } = this.previewQueueWithdrawal(amount);
    assert(status === QueueWithdrawalStatus.Ready, `Cannot queue withdrawal: ${status}`);

    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    const { hash, receipt, transaction } = await submitPreparedTransactionAndWait(
      this.market.provider,
      this.market.signer,
      prepareTransaction({
        to: this.market.address,
        abi: wildcatMarketAbi,
        functionName: "queueWithdrawal",
        args: [amount.raw]
      })
    );
    const queuedWithdrawalTransaction = toQueueWithdrawalTransaction(
      this.market.underlyingToken,
      receipt,
      this.market.address
    );
    const withdrawal = await LenderWithdrawalStatus.getWithdrawalForLender(
      this.market,
      queuedWithdrawalTransaction.expiry,
      this.account
    );
    return {
      hash,
      receipt,
      transaction,
      result: withdrawal
    };
  }

  async queueFullWithdrawal(): Promise<SubmittedTransactionResult<LenderWithdrawalStatus>> {
    const { status } = this.previewQueueWithdrawal(this.marketBalance);
    assert(status === QueueWithdrawalStatus.Ready, `Cannot queue withdrawal: ${status}`);

    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    const { hash, receipt, transaction } = await submitPreparedTransactionAndWait(
      this.market.provider,
      this.market.signer,
      this.market.version === MarketVersion.V2
        ? prepareTransaction({
            to: this.market.address,
            abi: wildcatMarketV2Abi,
            functionName: "queueFullWithdrawal"
          })
        : prepareTransaction({
            to: this.market.address,
            abi: wildcatMarketAbi,
            functionName: "queueWithdrawal",
            args: [this.marketBalance.raw]
          })
    );
    const queuedWithdrawalTransaction = toQueueWithdrawalTransaction(
      this.market.underlyingToken,
      receipt,
      this.market.address
    );
    const withdrawal = await LenderWithdrawalStatus.getWithdrawalForLender(
      this.market,
      queuedWithdrawalTransaction.expiry,
      this.account
    );
    return {
      hash,
      receipt,
      transaction,
      result: withdrawal
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

  async repay(amount: TokenAmount | BigintNumberish): Promise<TransactionHash> {
    return submitPreparedTransaction(this.market.signer, await this.populateRepay(amount));
  }

  async populateRepay(amount: TokenAmount | BigintNumberish): Promise<PartialTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) throw Error("Only borrower can repay");

    return prepareTransaction({
      to: this.market.address,
      abi: wildcatMarketAbi,
      functionName: "repay",
      args: [toRawAmount(amount)]
    });
  }

  async repayOutstandingDebt(): Promise<TransactionHash> {
    return submitPreparedTransaction(this.market.signer, await this.populateRepayOutstandingDebt());
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

    return prepareTransaction({
      to: this.market.address,
      abi: wildcatMarketAbi,
      functionName: "repayOutstandingDebt"
    });
  }

  async repayDelinquentDebt(): Promise<TransactionHash> {
    return submitPreparedTransaction(this.market.signer, await this.populateRepayDelinquentDebt());
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

    return prepareTransaction({
      to: this.market.address,
      abi: wildcatMarketAbi,
      functionName: "repayDelinquentDebt"
    });
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

  async borrow(amount: TokenAmount): Promise<TransactionHash> {
    const signer = await this.market.signer.getAddress();
    if (!this.isBorrower) throw Error("Only borrower can borrow");
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (amount.gt(this.market.borrowableAssets)) {
      throw Error("Insufficient borrowable assets");
    }
    return submitPreparedTransaction(
      this.market.signer,
      prepareTransaction({
        to: this.market.address,
        abi: wildcatMarketAbi,
        functionName: "borrow",
        args: [amount.raw]
      })
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Updates                                  */
  /* -------------------------------------------------------------------------- */

  async update(): Promise<void> {
    if (this.market.version === MarketVersion.V1) {
      const acccountMarketInfo = await getLegacyMarketLenderStatus(
        this.chainId,
        this.market.provider,
        this.account,
        this.market.address
      );
      this.updateWith(acccountMarketInfo);
      return;
    }
    const accountMarketInfo = await getLatestLenderAccountData(
      this.chainId,
      this.market.provider,
      this.account,
      this.market.address
    );
    this.updateWith(accountMarketInfo);
  }

  updateWith(info: MarketLenderStatusStructOutput | LatestLenderAccountDataStructOutput): void {
    if ("isAuthorizedOnController" in info) {
      assert(
        this.market.version === MarketVersion.V1,
        "V2 market can not be updated with V1 lens data"
      );
      this.isAuthorizedOnController = info.isAuthorizedOnController;
      this.role = toNumber(info.role) as LenderRole;
    } else {
      assert(
        this.market.version === MarketVersion.V2,
        "V1 market can not be updated with V2 lens data"
      );
      this.credential = {
        canRefresh: info.canRefresh,
        isBlockedFromDeposits: info.isBlockedFromDeposits,
        lastApprovalTimestamp: toNumber(info.lastApprovalTimestamp),
        lastProvider: roleProviderFromLensData(info.lastProvider)
      };
      this.isKnownLender = info.isKnownLender;
    }
    this.scaledMarketBalance = toRawAmount(info.scaledBalance);
    this.marketBalance = this.market.marketToken.getAmount(info.normalizedBalance);
    this.underlyingBalance = this.market.underlyingToken.getAmount(info.underlyingBalance);
    this.underlyingApproval = toRawAmount(info.underlyingApproval);
    this.processInterestAccrued();
    this.stateSource = "live";
  }

  private calculateInterestEarned(): bigint {
    if (!this.lastScaleFactor) return 0n;
    if (this.scaledMarketBalance === 0n || this.lastScaleFactor === this.market.scaleFactor) {
      return 0n;
    }
    const lastBalance = rayMulBigint(this.scaledMarketBalance, this.lastScaleFactor);
    const currentBalance = rayMulBigint(this.scaledMarketBalance, this.market.scaleFactor);
    return currentBalance - lastBalance;
  }

  processInterestAccrued(): void {
    if (!this.lastScaleFactor || !this.totalInterestEarned) return;
    if (this.lastScaleFactor !== this.market.scaleFactor) {
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
    data: SubgraphAccountDataForLenderViewFragment | SubgraphAccountDataForLenderListViewFragment
  ): MarketAccount {
    const indexedSnapshot = normalizeSubgraphLenderAccountSnapshot(data.snapshot);
    const indexedState = data.snapshot ?? data;
    const scaledBalance = toRawAmount(indexedState.scaledBalance);

    const account = new MarketAccount({
      account: data.address,
      isAuthorizedOnController: data.controllerAuthorization?.authorized ?? false,
      role: parseSubgraphLenderStatus(indexedState.role),
      scaledMarketBalance: scaledBalance,
      marketBalance: market.marketToken.getAmount(rayMulBigint(scaledBalance, market.scaleFactor)),
      underlyingBalance: market.underlyingToken.getAmount(0),
      underlyingApproval: 0n,
      market,
      deposits: "deposits" in data ? data.deposits : undefined,
      totalDeposited: market.underlyingToken.getAmount(indexedState.totalDeposited),
      lastScaleFactor: toRawAmount(indexedState.lastScaleFactor),
      lastUpdatedTimestamp: indexedState.lastUpdatedTimestamp,
      totalInterestEarned: market.underlyingToken.getAmount(indexedState.totalInterestEarned),
      numPendingWithdrawalBatches: indexedState.numPendingWithdrawalBatches,
      credential: data.hooksAccess ? parseSubgraphLenderHooksAccess(data.hooksAccess) : undefined,
      isKnownLender: !!data.knownLenderStatus?.id,
      hadSubgraphEntry: true,
      indexedSnapshot,
      stateSource: "indexed"
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
      scaledMarketBalance: toRawAmount(info.scaledBalance),
      marketBalance: market.marketToken.getAmount(info.normalizedBalance),
      underlyingBalance: market.underlyingToken.getAmount(info.underlyingBalance),
      underlyingApproval: toRawAmount(info.underlyingApproval),
      market
    });
  }

  static fromLenderAccountData(
    market: Market,
    data: LatestLenderAccountDataStructOutput
  ): MarketAccount {
    return new MarketAccount({
      account: data.lender,
      market,
      role: LenderRole.Null,
      marketBalance: market.marketToken.getAmount(data.normalizedBalance),
      scaledMarketBalance: toRawAmount(data.scaledBalance),
      underlyingApproval: toRawAmount(data.underlyingApproval),
      underlyingBalance: market.underlyingToken.getAmount(data.underlyingBalance),
      isAuthorizedOnController: false,
      isKnownLender: data.isKnownLender,
      credential: {
        canRefresh: data.canRefresh,
        isBlockedFromDeposits: data.isBlockedFromDeposits,
        lastApprovalTimestamp: toNumber(data.lastApprovalTimestamp),
        lastProvider: roleProviderFromLensData(data.lastProvider)
      }
    });
  }

  static async fromMarketDataWithLenderStatus(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    account: string,
    info: MarketDataWithLenderStatusOutput
  ): Promise<MarketAccount> {
    if ("controller" in info.market) {
      info = info as MarketDataWithLenderStatusStructOutput;
      return MarketAccount.fromMarketLenderStatus(
        account,
        info.lenderStatus,
        Market.fromMarketData(chainId, info.market, provider)
      );
    }
    if ("allowForceBuyBacks" in info.market.hooksConfig) {
      const infoV2 = info as MarketDataWithLenderStatusV2StructOutput;
      return MarketAccount.fromLenderAccountData(
        Market.fromMarketDataV2(chainId, provider, infoV2.market),
        infoV2.lenderStatus
      );
    }
    const infoV2_5 = info as MarketDataWithLenderStatusV2_5StructOutput;
    const market = await Market.fromUnifiedMarketData(chainId, provider, infoV2_5.market);
    return MarketAccount.fromLenderAccountData(market, infoV2_5.lenderStatus);
  }

  static async hydrateMarketAccounts(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    account: string,
    infos: MarketDataWithLenderStatusOutput[]
  ): Promise<MarketAccount[]> {
    return Promise.all(
      infos.map((info) =>
        MarketAccount.fromMarketDataWithLenderStatus(chainId, provider, account, info)
      )
    );
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
      scaledMarketBalance: 0n,
      marketBalance: market.marketToken.getAmount(0),
      underlyingBalance: market.underlyingToken.getAmount(0),
      underlyingApproval: 0n,
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
    if (market instanceof Market) {
      if (market.version === MarketVersion.V1) {
        return getLegacyMarketLenderStatus(chainId, provider, account, market.address).then(
          (info) => MarketAccount.fromMarketLenderStatus(account, info, market)
        );
      }
      return getLatestLenderAccountData(chainId, provider, account, market.address).then((info) =>
        MarketAccount.fromLenderAccountData(market, info)
      );
    }
    try {
      const info = await getLatestMarketDataWithLenderStatus(chainId, provider, account, market);
      return MarketAccount.fromMarketDataWithLenderStatus(chainId, provider, account, info);
    } catch (_) {
      const info = await getLegacyMarketDataWithLenderStatus(chainId, provider, account, market);
      return MarketAccount.fromMarketDataWithLenderStatus(chainId, provider, account, info);
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
    if (market instanceof Market) {
      return getLatestLenderAccountData(chainId, provider, account, market.address).then((info) =>
        MarketAccount.fromLenderAccountData(market, info)
      );
    }
    return getLatestMarketDataWithLenderStatus(chainId, provider, account, market).then((info) =>
      MarketAccount.fromMarketDataWithLenderStatus(chainId, provider, account, info)
    );
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
    if (markets.length === 0) {
      return [];
    }
    if (isMarketInstanceArray(markets)) {
      const results = new Array<MarketAccount>(markets.length);
      const legacyIndexes: number[] = [];
      const latestIndexes: number[] = [];

      markets.forEach((market, index) => {
        if (market.version === MarketVersion.V1) {
          legacyIndexes.push(index);
        } else {
          latestIndexes.push(index);
        }
      });

      if (legacyIndexes.length > 0) {
        const legacyMarkets = legacyIndexes.map((index) => markets[index]);
        const infos = await getLegacyMarketsLenderStatus(
          chainId,
          provider,
          account,
          legacyMarkets.map((market) => market.address)
        );
        infos.forEach((info, i) => {
          results[legacyIndexes[i]] = MarketAccount.fromMarketLenderStatus(
            account,
            info,
            legacyMarkets[i]
          );
        });
      }

      if (latestIndexes.length > 0) {
        const latestMarkets = latestIndexes.map((index) => markets[index]);
        const infos = await getLatestLenderAccountsData(
          chainId,
          provider,
          account,
          latestMarkets.map((market) => market.address)
        );
        infos.forEach((info, i) => {
          results[latestIndexes[i]] = MarketAccount.fromLenderAccountData(latestMarkets[i], info);
        });
      }

      return results;
    }
    try {
      const infos = await getLatestMarketsDataWithLenderStatus(chainId, provider, account, markets);
      return MarketAccount.hydrateMarketAccounts(chainId, provider, account, infos);
    } catch (_) {
      const infos = await getLegacyMarketsDataWithLenderStatus(chainId, provider, account, markets);
      return MarketAccount.hydrateMarketAccounts(chainId, provider, account, infos);
    }
  }

  /**
   * Refresh existing V2 lender market accounts using the focused live lens surface when available.
   * Falls back to existing broad V2 market reads plus lender-account reads.
   */
  static async refreshMarketAccountsV2LiveData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    account: string | undefined,
    marketAccounts: MarketAccount[]
  ): Promise<MarketAccount[]> {
    if (marketAccounts.length === 0) {
      return marketAccounts;
    }

    const lender = account ?? ZERO_ADDRESS;
    const shouldZeroBalances = !account;
    const marketAddresses = marketAccounts.map((marketAccount) => marketAccount.market.address);

    if (hasUnifiedLatestLensForAccountReads(chainId)) {
      try {
        const updates = await getUnifiedMarketsLiveDataWithLenderStatusV2(
          chainId,
          provider,
          lender,
          marketAddresses
        );
        updates.forEach((update: MarketLiveDataWithLenderStatusV2_5StructOutput, i) => {
          marketAccounts[i].market.updateWithLiveData(update.market);
          marketAccounts[i].updateWith(
            shouldZeroBalances ? zeroLenderBalances(update.lenderStatus) : update.lenderStatus
          );
        });
        return marketAccounts;
      } catch (_) {
        // Fall back to existing reads for older unified lens deployments.
      }
    }

    const [refreshedMarkets, lenderStatuses] = await Promise.all([
      Market.getMarketsV2(chainId, marketAddresses, provider),
      getLatestLenderAccountsData(chainId, provider, lender, marketAddresses)
    ]);

    marketAccounts.forEach((marketAccount, i) => {
      Object.assign(marketAccount.market, refreshedMarkets[i]);
      marketAccount.updateWith(
        shouldZeroBalances ? zeroLenderBalances(lenderStatuses[i]) : lenderStatuses[i]
      );
    });
    return marketAccounts;
  }

  /**
   * Mutate indexed lender accounts with current market, authorization, balance,
   * allowance, and credential state while preserving input order.
   */
  static async hydrateMarketAccountsLive(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    account: string | undefined,
    marketAccounts: MarketAccount[]
  ): Promise<MarketAccount[]> {
    const lender = account ?? ZERO_ADDRESS;
    const shouldZeroBalances = !account;
    const v1Accounts = marketAccounts.filter(({ market }) => market.version === MarketVersion.V1);
    const v2Accounts = marketAccounts.filter(({ market }) => market.version === MarketVersion.V2);

    await Promise.all([
      v1Accounts.length > 0
        ? getLegacyMarketsDataWithLenderStatus(
            chainId,
            provider,
            lender,
            v1Accounts.map(({ market }) => market.address)
          ).then((updates) =>
            updates.forEach((update, index) => {
              v1Accounts[index].market.updateWith(update.market);
              v1Accounts[index].updateWith(
                shouldZeroBalances
                  ? zeroLegacyLenderBalances(update.lenderStatus)
                  : update.lenderStatus
              );
            })
          )
        : Promise.resolve(),
      v2Accounts.length > 0
        ? MarketAccount.refreshMarketAccountsV2LiveData(chainId, provider, account, v2Accounts)
        : Promise.resolve()
    ]);

    return marketAccounts;
  }

  /**
   * Get all `MarketAccount`s for a given account.
   * Fetches the market data in the same call as the account data.
   */
  static async getAllMarketAccountsForLender(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    account: string
  ): Promise<MarketAccount[]> {
    if (hasUnifiedLatestLensForAccountReads(chainId)) {
      const markets = await getRegisteredMarkets(chainId, provider);
      if (markets.length === 0) {
        return [];
      }
      const infos = await getLatestMarketsDataWithLenderStatus(chainId, provider, account, markets);
      return MarketAccount.hydrateMarketAccounts(chainId, provider, account, infos);
    }
    const infos = await getLegacyAllMarketsDataWithLenderStatus(chainId, provider, account);
    return MarketAccount.hydrateMarketAccounts(chainId, provider, account, infos);
  }

  /**
   * Get paginated `MarketAccount`s for a given account.
   * Fetches the market data in the same call as the account data.
   * @note Throws an error if `start + count` exceeds the number of markets.
   */
  static async getPaginatedMarketAccounts(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    account: string,
    start = 0,
    count: number
  ): Promise<MarketAccount[]> {
    if (hasUnifiedLatestLensForAccountReads(chainId)) {
      if (count <= 0) {
        return [];
      }
      const totalMarkets = await getRegisteredMarketsCount(chainId, provider);
      if (start >= totalMarkets) {
        return [];
      }
      const end = Math.min(start + count, totalMarkets);
      const markets = await getRegisteredMarketsPage(chainId, provider, start, end);
      if (markets.length === 0) {
        return [];
      }
      const infos = await getLatestMarketsDataWithLenderStatus(chainId, provider, account, markets);
      return MarketAccount.hydrateMarketAccounts(chainId, provider, account, infos);
    }
    const infos = await getLegacyPaginatedMarketsDataWithLenderStatus(
      chainId,
      provider,
      account,
      start,
      count
    );
    return MarketAccount.hydrateMarketAccounts(chainId, provider, account, infos);
  }
}
type QueueWithdrawalTransaction = {
  expiry: number;
  lender: string;
  market: string;
  scaledAmount: bigint;
  originalAmount: TokenAmount;
  transactionHash: string;
  blockNumber: number;
};

const toQueueWithdrawalTransaction = (
  underlyingToken: Token,
  receipt: TransactionReceipt,
  marketAddress: string
): QueueWithdrawalTransaction => {
  const event = parseEventLogs({
    abi: wildcatMarketAbi,
    eventName: "WithdrawalQueued",
    logs: receipt.logs
  })[0];
  if (!event) throw Error("No queued withdrawal event found");
  return {
    transactionHash: receipt.transactionHash,
    blockNumber: Number(receipt.blockNumber),
    expiry: Number(event.args.expiry),
    lender: event.args.account,
    market: marketAddress,
    scaledAmount: toRawAmount(event.args.scaledAmount),
    originalAmount: underlyingToken.getAmount(event.args.normalizedAmount)
  };
};
