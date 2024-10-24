import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";
import { Token, TokenAmount, minTokenAmount, toBn } from "../token";
import { Market } from "../market";
import {
  MarketLenderStatusStructOutput,
  MarketDataWithLenderStatusStructOutput,
  WildcatMarketV2__factory,
  LenderAccountDataStructOutput
} from "../typechain";
import { assert, bipMul, DepositRecord, parseMarketRecord, rayMul } from "../utils";
import { SupportedChainId, getControllerContract, getLensContract } from "../constants";
import {
  HooksKind,
  MarketVersion,
  PartialTransaction,
  RoleProvider,
  SignerOrProvider
} from "../types";
import { LenderWithdrawalStatus } from "../withdrawal-status";
import { WithdrawalQueuedEvent } from "../typechain/WildcatMarket";
import {
  SubgraphAccountDataForLenderViewFragment,
  SubgraphDepositDataFragment,
  SubgraphLenderHooksAccessDataFragment
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
  RepayPreview
} from "./validation";
export * from "./validation";

export enum LenderRole {
  Null = 0,
  Blocked = 1,
  WithdrawOnly = 2,
  DepositAndWithdraw = 3
}

export type MarketAccountArgs = {
  account: string;
  isAuthorizedOnController?: boolean;
  credential?: HooksCredential;
  isKnownLender?: boolean;
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
};

export type HooksCredential = {
  isBlockedFromDeposits: boolean;
  canRefresh: boolean;
  lastApprovalTimestamp: number;
  lastProvider?: RoleProvider;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MarketAccount extends Omit<MarketAccountArgs, "deposits"> {}

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

  constructor(args: MarketAccountArgs) {
    Object.assign(this, args);
    this.depositRecords = (args.deposits ?? []).map((log) =>
      parseMarketRecord(this.market.underlyingToken, log)
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
        (config.kind === HooksKind.FixedTerm
          ? config.queueWithdrawalRequiresAccess
          : config.flags.useOnQueueWithdrawal) &&
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

  previewCloseMarket(): CloseMarketPreview {
    if (!this.isBorrower) return { status: CloseMarketStatus.NotBorrower };
    if (this.market.version === MarketVersion.V2) {
      const config = this.market.hooksConfig;
      assert(config !== undefined, `V2 market missing hooksConfig`);
      if (
        this.market.isInFixedTerm &&
        config.kind === HooksKind.FixedTerm &&
        config.allowClosureBeforeTerm
      ) {
        return { status: CloseMarketStatus.EarlyClosureNotAllowed };
      }
    }

    // add 0.1% to account for interest
    const amount = this.market.underlyingToken.getAmount(
      bipMul(this.market.outstandingDebt.raw, toBn(10010))
    );
    if (amount.gt(this.underlyingBalance)) {
      return { status: CloseMarketStatus.InsufficientBalance };
    }
    if (this.market.unpaidWithdrawalBatchExpiries.length > 0) {
      return { status: CloseMarketStatus.UnpaidWithdrawalBatches };
    }
    if (
      // @todo proper calculation
      !this.isApprovedFor(
        this.market.underlyingToken.getAmount(bipMul(this.market.outstandingDebt.raw, toBn(10006)))
      )
    ) {
      return { status: CloseMarketStatus.InsufficientAllowance };
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

  async populateCloseMarket(): Promise<PartialTransaction> {
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

  updateWith(info: MarketLenderStatusStructOutput): void {
    this.isAuthorizedOnController = info.isAuthorizedOnController;
    this.role = info.role;
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
    const RolesMap = {
      Null: LenderRole.Null,
      Blocked: LenderRole.Blocked,
      WithdrawOnly: LenderRole.WithdrawOnly,
      DepositAndWithdraw: LenderRole.DepositAndWithdraw
    };
    const scaledBalance = BigNumber.from(data.scaledBalance);

    const account = new MarketAccount({
      account: data.address,
      isAuthorizedOnController: data.controllerAuthorization?.authorized ?? false,
      role: RolesMap[data.role],
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
      credential: data.hooksAccess ? toCredential(data.hooksAccess) : undefined,
      isKnownLender: !!data.knownLenderStatus?.id
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

  static fromLenderAccountData(market: Market, data: LenderAccountDataStructOutput): MarketAccount {
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
          isPullProvider:
            data.lastProvider.pullProviderIndex !== BigNumber.from(2).pow(24).sub(1).toNumber(),
          providerAddress: data.lastProvider.providerAddress,
          pullProviderIndex: data.lastProvider.pullProviderIndex,
          timeToLive: data.lastProvider.timeToLive
        }
      }
    });
  }

  static fromMarketDataWithLenderStatus(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    account: string,
    info: MarketDataWithLenderStatusStructOutput
  ): MarketAccount {
    return MarketAccount.fromMarketLenderStatus(
      account,
      info.lenderStatus,
      Market.fromMarketData(chainId, info.market, provider)
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

const toCredential = ({
  canRefresh,
  isBlockedFromDeposits,
  lastApprovalTimestamp,
  lender,
  lastProvider
}: SubgraphLenderHooksAccessDataFragment): HooksCredential => {
  const { isApproved, isPullProvider, providerAddress, pullProviderIndex, timeToLive } =
    lastProvider!;
  return {
    canRefresh,
    isBlockedFromDeposits,
    lastApprovalTimestamp,
    lastProvider: { isApproved, isPullProvider, providerAddress, pullProviderIndex, timeToLive }
  };
};
