import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";
import { Token, TokenAmount, minTokenAmount, toBn } from "./token";
import { Market } from "./market";
import {
  MarketLenderStatusStructOutput,
  MarketDataWithLenderStatusStructOutput
} from "./typechain";
import { assert, bipMul, rayMul } from "./utils";
import { SupportedChainId, getControllerContract, getLensContract } from "./constants";
import { PartialTransaction, SignerOrProvider } from "./types";
import { LenderWithdrawalStatus } from "./withdrawal-status";
import { WithdrawalQueuedEvent } from "./typechain/WildcatMarket";
import {
  SubgraphAccountDataForLenderViewFragment,
  SubgraphDepositDataFragment
} from "./gql/graphql";

export type DepositStatus =
  | {
      status: "InsufficientBalance" | "ExceedsMaximumDeposit" | "Ready" | "InsufficientRole";
    }
  | {
      status: "InsufficientAllowance";
      remainder: TokenAmount;
    };

export type RepayStatus =
  | {
      status: "InsufficientBalance" | "ExceedsOutstandingDebt" | "Ready";
    }
  | {
      status: "InsufficientAllowance";
      remainder: TokenAmount;
    };

export type CloseMarketStatus =
  | {
      status: "InsufficientBalance" | "UnpaidWithdrawalBatches" | "Ready" | "NotBorrower";
    }
  | {
      status: "InsufficientAllowance";
      remainder: TokenAmount;
    };

export type SetAprStatus =
  | {
      status: "NotBorrower" | "InvalidApr";
    }
  | {
      status: "Ready";
      willChangeReserveRatio: true;
      // The new liquidity coverage that will be required for the temporary reserve ratio.
      newCoverageLiquidity: TokenAmount;
      // The new reserve ratio that will be temporarily imposed.
      newReserveRatio: number;
      // Whether the change to the reserve ratio will be caused by an old temporary
      // reserve ratio resetting.
      changeCausedByReset: boolean;
    }
  | {
      // This status indicates the change will not affect the reserve ratio,
      // i.e. the relative reduction is <= 1/2 of the reserve ratio.
      status: "Ready";
      willChangeReserveRatio: false;
    }
  | {
      // This status indicates the new reserve ratio required to set the new APR
      // would make the market delinquent.
      status: "InsufficientReserves";
      newReserveRatio: number;
      newCoverageLiquidity: TokenAmount;
      missingReserves: TokenAmount;
      changeCausedByReset: boolean;
    };
export type QueueWithdrawalStatus = {
  status: "Ready" | "InsufficientBalance" | "InsufficientRole";
};

export enum LenderRole {
  Null = 0,
  Blocked = 1,
  WithdrawOnly = 2,
  DepositAndWithdraw = 3
}

const isMarketInstanceArray = (markets: Market[] | string[]): markets is Market[] => {
  return typeof markets[0] !== "string";
};

/**
 * Class to provide information about a market user's account
 * and to wrap interactions.
 *
 * Use `update()` to update the account's state.
 *
 *
 */
export class MarketAccount {
  constructor(
    public account: string,
    public isAuthorizedOnController: boolean,
    public role: LenderRole,
    public scaledMarketBalance: BigNumber,
    public marketBalance: TokenAmount,
    public underlyingBalance: TokenAmount,
    public underlyingApproval: BigNumber,
    public market: Market,
    public deposits: SubgraphDepositDataFragment[] = [],
    public totalDeposited?: TokenAmount,
    public lastScaleFactor?: BigNumber,
    public lastUpdatedTimestamp?: number,
    public totalInterestEarned?: TokenAmount,
    public numPendingWithdrawalBatches?: number
  ) {}

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

  get canDeposit(): boolean {
    return (
      this.role === LenderRole.DepositAndWithdraw ||
      (this.role === LenderRole.Null && this.isAuthorizedOnController)
    );
  }

  get canWithdraw(): boolean {
    return (
      this.role === LenderRole.WithdrawOnly ||
      this.role === LenderRole.DepositAndWithdraw ||
      (this.role === LenderRole.Null && this.isAuthorizedOnController)
    );
  }

  canChangeAPR(apr: number): boolean {
    return this.isBorrower && apr > 0 && apr <= 10000 && this.market.canChangeAPR(apr);
  }

  checkCloseMarketStep(): CloseMarketStatus {
    if (!this.isBorrower) return { status: "NotBorrower" };
    // add 0.1% to account for interest
    const amount = this.market.underlyingToken.getAmount(
      bipMul(this.market.outstandingDebt.raw, toBn(10010))
    );
    if (amount.gt(this.underlyingBalance)) {
      return { status: "InsufficientBalance" };
    }
    if (this.market.unpaidWithdrawalBatchExpiries.length > 0) {
      return { status: "UnpaidWithdrawalBatches" };
    }
    if (
      !this.isApprovedFor(
        this.market.underlyingToken.getAmount(bipMul(this.market.outstandingDebt.raw, toBn(10006)))
      )
    ) {
      return {
        status: "InsufficientAllowance",
        remainder: amount
      };
    }
    return { status: "Ready" };
  }

  checkSetAPRStep(apr: number): SetAprStatus {
    if (!this.isBorrower) return { status: "NotBorrower" };
    if (!(apr > 0 && apr <= 10000)) return { status: "InvalidApr" };

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
          status: "InsufficientReserves",
          newCoverageLiquidity,
          newReserveRatio: newReserveRatioBips,
          missingReserves: newCoverageLiquidity.sub(this.market.totalAssets),
          changeCausedByReset
        };
      } else {
        return {
          status: "Ready",
          willChangeReserveRatio: true,
          newCoverageLiquidity,
          newReserveRatio: newReserveRatioBips,
          changeCausedByReset
        };
      }
    } else {
      return {
        status: "Ready",
        willChangeReserveRatio: false
      };
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                             Management Actions                             */
  /* -------------------------------------------------------------------------- */

  async closeMarket(): Promise<ContractTransaction> {
    const { status } = this.checkCloseMarketStep();
    if (status !== "Ready") {
      throw Error(`Cannot close market: ${status}`);
    }
    const controller = getControllerContract(this.market.signer, this.market.controller);
    return controller.closeMarket(this.market.address);
  }

  async populateCloseMarket(): Promise<PartialTransaction> {
    const { status } = this.checkCloseMarketStep();
    if (status !== "Ready") {
      throw Error(`Cannot close market: ${status}`);
    }
    const controller = getControllerContract(this.market.signer, this.market.controller);

    return {
      to: controller.address,
      data: controller.interface.encodeFunctionData("closeMarket", [this.market.address]),
      value: "0"
    };
  }

  async setMaxTotalSupply(amount: TokenAmount): Promise<ContractTransaction> {
    assert(this.isBorrower, "Only borrower can set maxTotalSupply");
    if (amount.lt(this.market.totalSupply)) {
      throw Error("New max total supply must be at least current total supply");
    }
    const controller = getControllerContract(this.market.signer, this.market.controller);
    return controller.setMaxTotalSupply(this.market.address, amount.raw);
  }

  async setAnnualInterestBips(newAprBips: number): Promise<ContractTransaction> {
    const { status } = this.checkSetAPRStep(newAprBips);
    if (status !== "Ready") {
      throw Error(`Cannot set new APR of ${newAprBips / 10_000}%: ${status}`);
    }
    const controller = getControllerContract(this.market.provider, this.market.controller);
    assert(this.market.controller === controller.address, "Unexpected controller address");
    return controller.setAnnualInterestBips(this.market.address, newAprBips);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Approval                                  */
  /* -------------------------------------------------------------------------- */

  isApprovedFor(amount: TokenAmount): boolean {
    return this.underlyingApproval.gte(amount.raw);
  }

  /**
   * @returns Amount of underlying token user must approve
   *          market to spend to make a deposit.
   */
  getAllowanceRemainder(amount: TokenAmount): TokenAmount {
    return this.underlyingApproval.gte(amount.raw)
      ? this.market.underlyingToken.getAmount(0)
      : amount;
  }

  async approveAllowanceRemainder(amount: TokenAmount): Promise<ContractTransaction> {
    const token = this.market.underlyingToken;
    const signer = await token.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    amount = this.getAllowanceRemainder(amount);
    return token.contract.approve(this.market.address, amount.raw);
  }

  async populateApproveMarket(amount: TokenAmount): Promise<PartialTransaction> {
    const token = this.market.underlyingToken;
    const signer = await token.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    amount = this.getAllowanceRemainder(amount);
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

  /**
   * @returns Status for deposit
   */
  checkDepositStep(amount: TokenAmount): DepositStatus {
    if (!this.canDeposit) {
      return { status: "InsufficientRole" };
    }
    if (amount.gt(this.market.maximumDeposit)) {
      return { status: "ExceedsMaximumDeposit" };
    }
    if (amount.gt(this.underlyingBalance)) {
      return { status: "InsufficientBalance" };
    }
    if (!this.isApprovedFor(amount)) {
      return {
        status: "InsufficientAllowance",
        remainder: this.getAllowanceRemainder(amount)
      };
    }
    return { status: "Ready" };
  }

  async populateDeposit(amount: TokenAmount): Promise<PartialTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (amount.gt(this.underlyingBalance)) {
      throw Error("Insufficient balance");
    }

    return {
      to: this.market.address,
      data: this.market.contract.interface.encodeFunctionData("deposit", [amount.raw]),
      value: "0"
    };
  }

  // TODO: Add support for depositUpTo
  async deposit(amount: TokenAmount): Promise<ContractTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (amount.gt(this.underlyingBalance)) {
      throw Error("Insufficient balance");
    }
    return this.market.contract.deposit(amount.raw);
  }

  /* ------ Withdrawals ------ */

  checkQueueWithdrawalStep(amount: TokenAmount): QueueWithdrawalStatus {
    if (!this.canWithdraw) {
      return { status: "InsufficientRole" };
    }
    if (amount.gt(this.marketBalance)) {
      return { status: "InsufficientBalance" };
    }
    return { status: "Ready" };
  }

  async queueWithdrawal(amount: TokenAmount): Promise<{
    withdrawal: LenderWithdrawalStatus;
    transaction: ContractTransaction;
    receipt: ContractReceipt;
  }> {
    if (!this.canWithdraw) {
      throw Error(`Lender role insufficient to withdraw`);
    }
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
    if (!queuedWithdrawalTransaction) {
      throw Error("No queued withdrawal event found");
    }
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

  /**
   * @returns Status for deposit
   */
  checkRepayStep(amount: TokenAmount): RepayStatus {
    if (amount.gt(this.underlyingBalance)) {
      return { status: "InsufficientBalance" };
    }
    if (!this.isApprovedFor(amount)) {
      return {
        status: "InsufficientAllowance",
        remainder: this.getAllowanceRemainder(amount)
      };
    }
    return { status: "Ready" };
  }

  async repay(amount: BigNumber): Promise<ContractTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) {
      throw Error("Only borrower can repay");
    }

    return this.market.contract.repay(amount);
  }

  async populateRepay(amount: BigNumber): Promise<PartialTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) {
      throw Error("Only borrower can repay");
    }

    return {
      to: this.market.address,
      data: this.market.contract.interface.encodeFunctionData("repay", [amount]),
      value: "0"
    };
  }

  async repayOutstandingDebt(): Promise<ContractTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) {
      throw Error("Only borrower can repay");
    }

    return this.market.contract.repayOutstandingDebt();
  }

  async populateRepayOutstandingDebt(): Promise<PartialTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) {
      throw Error("Only borrower can repay");
    }

    return {
      to: this.market.address,
      data: this.market.contract.interface.encodeFunctionData("repayOutstandingDebt"),
      value: "0"
    };
  }

  async repayDelinquentDebt(): Promise<ContractTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) {
      throw Error("Only borrower can repay");
    }

    return this.market.contract.repayDelinquentDebt();
  }

  async populateRepayDelinquentDebt(): Promise<PartialTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) {
      throw Error("Only borrower can repay");
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
    if (signer.toLowerCase() !== this.account.toLowerCase()) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) {
      throw Error("Only borrower can borrow");
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
    const account = new MarketAccount(
      data.address,
      data.controllerAuthorization.authorized,
      RolesMap[data.role],
      scaledBalance,
      market.marketToken.getAmount(rayMul(scaledBalance, market.scaleFactor)),
      market.underlyingToken.getAmount(0),
      BigNumber.from(0),
      market,
      data.deposits,
      market.underlyingToken.getAmount(data.totalDeposited),
      BigNumber.from(data.lastScaleFactor),
      data.lastUpdatedTimestamp,
      market.underlyingToken.getAmount(data.totalInterestEarned),
      data.numPendingWithdrawalBatches
    );
    account.processInterestAccrued();
    return account;
  }

  static fromMarketLenderStatus(
    account: string,
    info: MarketLenderStatusStructOutput,
    market: Market
  ): MarketAccount {
    return new MarketAccount(
      account,
      info.isAuthorizedOnController,
      info.role as LenderRole,
      info.scaledBalance,
      market.marketToken.getAmount(info.normalizedBalance),
      market.underlyingToken.getAmount(info.underlyingBalance),
      info.underlyingApproval,
      market
    );
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
    return new MarketAccount(
      account,
      isAuthorizedOnController,
      LenderRole.Null,
      BigNumber.from(0),
      market.marketToken.getAmount(0),
      market.underlyingToken.getAmount(0),
      BigNumber.from(0),
      market
    );
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
