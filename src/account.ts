import { BigNumber, ContractTransaction } from "ethers";
import { TokenAmount, minTokenAmount } from "./token";
import { Market } from "./market";
import {
  MarketLenderStatusStructOutput,
  MarketDataWithLenderStatusStructOutput
} from "./typechain";
import { updateObject } from "./utils";
import { getControllerContract, getLensContract } from "./constants";
import { SignerOrProvider } from "./types";
import { LenderWithdrawalStatus, toQueueWithdrawalTransaction } from "./withdrawal-status";
import { WithdrawalQueuedEvent } from "./typechain/WildcatMarket";

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
    public market: Market
  ) {}

  static readonly UpdatableKeys: Array<keyof MarketAccount> = [
    "marketBalance",
    "underlyingBalance",
    "underlyingApproval"
  ];

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

  async setAPR(newAprBips: number): Promise<ContractTransaction> {
    if (!this.isBorrower) {
      throw Error("Only borrower can set APR");
    }
    if (newAprBips > 10000) {
      throw Error("APR must be less than 100% (10000 BIPS)");
    }
    const controller = getControllerContract(this.market.provider, this.market.controller);
    if (this.market.controller !== controller.address) {
      throw Error(`Unexpected controller address: ${this.market.controller}`);
    }
    return controller.setAnnualInterestBips(this.market.address, newAprBips);
  }

  /* ------ Approval ------ */

  isApprovedFor(amount: TokenAmount): boolean {
    return this.underlyingApproval.gte(amount.raw);
  }

  /**
   * @returns Remaining amount of underlying token user must approve
   *          market to spend to make a deposit.
   */
  getAllowanceRemainder(amount: TokenAmount): TokenAmount {
    return amount.satsub(this.underlyingApproval);
  }

  async approveAllowanceRemainder(amount: TokenAmount): Promise<ContractTransaction> {
    const token = this.market.underlyingToken;
    const signer = await token.signer.getAddress();
    if (signer !== this.account) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    amount = this.getAllowanceRemainder(amount);
    return token.contract.approve(this.market.address, amount.raw);
  }

  /* ------ Deposits ------ */

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

  // TODO: Add support for depositUpTo
  async deposit(amount: TokenAmount): Promise<ContractTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer !== this.account) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (amount.gt(this.underlyingBalance)) {
      throw Error("Insufficient balance");
    }
    return this.market.contract.deposit(amount.raw);
  }

  /* ------ Withdrawals ------ */

  /**
   * @returns Amount of underlying token user can withdraw
   *          given their market balance and the market's assets.
   */
  get maximumWithdrawal(): TokenAmount {
    return minTokenAmount(this.market.totalAssets, this.marketBalance);
  }

  async queueWithdrawal(amount: TokenAmount): Promise<LenderWithdrawalStatus> {
    if (!this.canWithdraw) {
      throw Error(`Lender role insufficient to withdraw`);
    }
    const signer = await this.market.signer.getAddress();
    if (signer !== this.account) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    const tx = await this.market.contract.queueWithdrawal(amount.raw).then((tx) => tx.wait());
    const queuedWithdrawalTopic = this.market.contract.interface.getEventTopic("QueuedWithdrawal");
    const queuedWithdrawalTransaction = toQueueWithdrawalTransaction(
      this.market.underlyingToken,
      tx.events!.find((e) => e.topics[0] === queuedWithdrawalTopic) as WithdrawalQueuedEvent
    );
    if (!queuedWithdrawalTransaction) {
      throw Error("No queued withdrawal event found");
    }
    return LenderWithdrawalStatus.getWithdrawalForLender(
      this.market,
      queuedWithdrawalTransaction.expiry,
      this.account
    );
  }

  /* ------ Repaying ------ */

  get maximumRepay(): TokenAmount {
    return minTokenAmount(this.market.outstandingDebt, this.underlyingBalance);
  }

  get canRepayDelinquent(): boolean {
    return this.market.delinquentDebt.lt(this.maximumRepay) && this.isBorrower;
  }

  get canRepayOutstanding(): boolean {
    return this.market.outstandingDebt.lt(this.maximumRepay) && this.isBorrower;
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
    if (signer !== this.account) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) {
      throw Error("Only borrower can repay");
    }

    return this.market.contract.repay(amount);
  }

  async repayOutstandingDebt(): Promise<ContractTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer !== this.account) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) {
      throw Error("Only borrower can repay");
    }

    return this.market.contract.repayOutstandingDebt();
  }

  async repayDelinquentDebt(): Promise<ContractTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer !== this.account) {
      throw Error(`MarketAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) {
      throw Error("Only borrower can repay");
    }

    return this.market.contract.repayDelinquentDebt();
  }

  /* ------ Borrowing ------ */

  /**
   * @returns Amount of underlying token borrower can borrow
   */
  getBorrowableAmount(amount: TokenAmount): TokenAmount {
    return minTokenAmount(amount, this.market.borrowableAssets);
  }

  async borrow(amount: TokenAmount): Promise<ContractTransaction> {
    const signer = await this.market.signer.getAddress();
    if (signer !== this.account) {
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

  /* ------ Updates ------ */

  async update(): Promise<void> {
    const acccountMarketInfo = await this.market.getAccount(this.account);
    updateObject(this, acccountMarketInfo, MarketAccount.UpdatableKeys);
  }

  applyUpdate(info: MarketLenderStatusStructOutput): void {
    const account = MarketAccount.fromMarketLenderStatus(this.account, info, this.market);
    updateObject(this, account, MarketAccount.UpdatableKeys);
  }

  /* ------ Builders / Getters ------ */

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
    provider: SignerOrProvider,
    account: string,
    info: MarketDataWithLenderStatusStructOutput
  ): MarketAccount {
    return MarketAccount.fromMarketLenderStatus(
      account,
      info.lenderStatus,
      Market.fromMarketData(info.market, provider)
    );
  }

  /**
   * Get a `MarketAccount` for a given account and existing `Market` instance.
   * If `market` is a string, the market data will be fetched in the same call as the account data.
   */
  static async getMarketAccount(
    provider: SignerOrProvider,
    account: string,
    market: Market | string
  ): Promise<MarketAccount> {
    const lens = getLensContract(provider);
    if (market instanceof Market) {
      return lens
        .getMarketLenderStatus(account, market.address)
        .then((info) => MarketAccount.fromMarketLenderStatus(account, info, market));
    } else {
      return lens
        .getMarketDataWithLenderStatus(account, market)
        .then((info) => MarketAccount.fromMarketDataWithLenderStatus(provider, account, info));
    }
  }

  /**
   * Get multiple `MarketAccount`s given an account and existing list of `Market`
   * instances or market addresses. If `markets` is an array of strings, the market
   * data will be fetched in the same call as the account data.
   */
  static async getMarketAccountsForLender(
    provider: SignerOrProvider,
    account: string,
    markets: Market[] | string[]
  ): Promise<MarketAccount[]> {
    const lens = getLensContract(provider);
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
          infos.map((info) => MarketAccount.fromMarketDataWithLenderStatus(provider, account, info))
        );
    }
  }

  /**
   * Get all `MarketAccount`s for a given account.
   * Fetches the market data in the same call as the account data.
   */
  static getAllMarketAccountsForLender(
    provider: SignerOrProvider,
    account: string
  ): Promise<MarketAccount[]> {
    const lens = getLensContract(provider);
    return lens
      .getAllMarketsDataWithLenderStatus(account)
      .then((infos) =>
        infos.map((info) => MarketAccount.fromMarketDataWithLenderStatus(provider, account, info))
      );
  }

  /**
   * Get paginated `MarketAccount`s for a given account.
   * Fetches the market data in the same call as the account data.
   * @note Throws an error if `start + count` exceeds the number of markets.
   */
  static getPaginatedMarketAccounts(
    provider: SignerOrProvider,
    account: string,
    start = 0,
    count: number
  ): Promise<MarketAccount[]> {
    const lens = getLensContract(provider);
    return lens
      .getPaginatedMarketsDataWithLenderStatus(account, start, count)
      .then((infos) =>
        infos.map((info) => MarketAccount.fromMarketDataWithLenderStatus(provider, account, info))
      );
  }
}
