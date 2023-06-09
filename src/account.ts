import { BigNumber, ContractTransaction } from "ethers";
import { TokenAmount, maxTokenAmount, minTokenAmount } from "./token";
import { Vault } from "./vault";
import { AccountVaultInfoStructOutput } from "./typechain";
import { updateObject } from "./misc";
import { getControllerContract } from "./constants";

export type DepositStatus =
  | {
      status: "InsufficientBalance";
    }
  | {
      status: "ExceedsMaximumDeposit";
    }
  | {
      status: "InsufficientAllowance";
      remainder: TokenAmount;
    }
  | {
      status: "Ready";
    };

/**
 * Class to provide information about a vault user's account
 * and to wrap interactions.
 *
 * Use `update()` to update the account's state.
 *
 *
 */
export class VaultAccount {
  constructor(
    public account: string,
    public vaultBalance: TokenAmount,
    public underlyingBalance: TokenAmount,
    public underlyingApproval: BigNumber,
    public vault: Vault
  ) {}

  static readonly UpdatableKeys: (keyof VaultAccount)[] = [
    "vaultBalance",
    "underlyingBalance",
    "underlyingApproval",
  ];

  isBorrower(): boolean {
    return this.vault.borrower.toLowerCase() === this.account.toLowerCase();
  }

  async setAPR(newAprBips: number): Promise<ContractTransaction> {
    if (!this.isBorrower) {
      throw Error("Only borrower can set APR");
    }
    if (newAprBips > 10000) {
      throw Error("APR must be less than 100% (10000 BIPS)");
    }
    if (!this.vault.canChangeAPR) {
      throw Error("APR cannot be changed - change in progress");
    }
    const controller = getControllerContract(this.vault.provider);
    if (this.vault.controller !== controller.address) {
      throw Error(`Unexpected controller address: ${this.vault.controller}`);
    }
    return controller.reduceInterestRate(this.vault.address, newAprBips);
  }

  async approveAllowanceRemainder(amount: TokenAmount): Promise<ContractTransaction> {
    const token = this.vault.underlyingToken;
    const signer = await token.signer.getAddress();
    if (signer !== this.account) {
      throw Error(`VaultAccount signer ${signer} does not match ${this.account}`);
    }
    amount = this.getAllowanceRemainder(amount);
    return token.contract.approve(this.vault.address, amount.raw);
  }

  // TODO: Add support for depositUpTo
  async deposit(amount: TokenAmount): Promise<ContractTransaction> {
    const signer = await this.vault.signer.getAddress();
    if (signer !== this.account) {
      throw Error(`VaultAccount signer ${signer} does not match ${this.account}`);
    }
    if (amount.gt(this.underlyingBalance)) {
      throw Error("Insufficient balance");
    }
    return this.vault.contract.deposit(amount.raw, this.account);
  }

  async withdraw(amount: TokenAmount): Promise<ContractTransaction> {
    const signer = await this.vault.signer.getAddress();
    if (signer !== this.account) {
      throw Error(`VaultAccount signer ${signer} does not match ${this.account}`);
    }
    return this.vault.contract.withdraw(amount.raw, this.account);
  }

  /**
   * @returns Amount of underlying token borrower can borrow
   */
  getBorrowableAmount(amount: TokenAmount): TokenAmount {
    return minTokenAmount(amount, this.vault.borrowableAssets);
  }

  async update() {
    const acccountVaultInfo = await this.vault.getAccountInfo();
    updateObject(this, acccountVaultInfo, VaultAccount.UpdatableKeys);
  }

  /**
   * @returns Maximum amount of underlying token user can deposit
   *          given their underlying balance and the vault's max supply
   */
  get maximumDeposit(): TokenAmount {
    return minTokenAmount(this.vault.maximumDeposit, this.underlyingBalance);
  }

  /**
   * @returns Amount of underlying token user can withdraw
   *          given their vault balance and the vault's assets.
   */
  get maximumWithdrawal(): TokenAmount {
    return minTokenAmount(this.vault.totalAssets, this.vaultBalance);
  }

  /**
   * @returns Amount of underlying token user can actually deposit
   *          given a target amount.
   */
  getDepositAmount(amount: TokenAmount): TokenAmount {
    return minTokenAmount(amount, this.maximumDeposit);
  }

  /**
   * @returns Amount of underlying token user can actually withdraw
   *          given a target amount.
   */
  getWithdrawalAmount(amount: TokenAmount): TokenAmount {
    return minTokenAmount(amount, this.maximumWithdrawal);
  }

  isApprovedFor(amount: TokenAmount): boolean {
    return this.underlyingApproval.gte(amount.raw);
  }

  /**
   * @returns Remaining amount of underlying token user must approve
   *          vault to spend to make a deposit.
   */
  getAllowanceRemainder(amount: TokenAmount): TokenAmount {
    return amount.satsub(this.underlyingApproval);
  }

  /**
   * @returns Status for deposit
  */
  checkDepositStep(amount: TokenAmount): DepositStatus {
    if (amount.gt(this.vault.maximumDeposit)) {
      return { status: "ExceedsMaximumDeposit" };
    }
    if (amount.gt(this.underlyingBalance)) {
      return { status: "InsufficientBalance" };
    }
    if (!this.isApprovedFor(amount)) {
      return {
        status: "InsufficientAllowance",
        remainder: this.getAllowanceRemainder(amount),
      };
    }
    return { status: "Ready" };
  }

  static fromAccountVaultInfoStruct(
    account: string,
    info: AccountVaultInfoStructOutput,
    vault: Vault
  ) {
    return new VaultAccount(
      account,
      vault.vaultToken.getAmount(info.normalizedBalance),
      vault.underlyingToken.getAmount(info.underlyingBalance),
      info.underlyingApproval,
      vault
    );
  }
}
