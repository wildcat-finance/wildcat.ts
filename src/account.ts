import { BigNumber, ContractTransaction } from "ethers";
import { TokenAmount, minTokenAmount } from "./token";
import { Vault } from "./vault";
import { AccountVaultInfoStructOutput, VaultDataWithAccountStructOutput } from "./typechain";
import { updateObject } from "./misc";
import { getControllerContract, getLensContract } from "./constants";
import { SignerOrProvider } from "./types";

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

const isVaultInstanceArray = (vaults: Vault[] | string[]): vaults is Vault[] => {
  return typeof vaults[0] !== "string";
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

  static readonly UpdatableKeys: Array<keyof VaultAccount> = [
    "vaultBalance",
    "underlyingBalance",
    "underlyingApproval"
  ];

  get userHasBalance(): boolean {
    return this.vaultBalance.gt(0);
  }

  get userHasUnderlyingBalance(): boolean {
    return this.underlyingBalance.gt(0);
  }

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
    return controller.setAnnualInterestBips(this.vault.address, newAprBips);
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

  async repay(amount: BigNumber): Promise<ContractTransaction> {
    const signer = await this.vault.signer.getAddress();
    if (signer !== this.account) {
      throw Error(`VaultAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) {
      throw Error("Only borrower can repay");
    }

    return this.vault.contract.repay(amount);
  }

  async repayOutstandingDebt(): Promise<ContractTransaction> {
    const signer = await this.vault.signer.getAddress();
    if (signer !== this.account) {
      throw Error(`VaultAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) {
      throw Error("Only borrower can repay");
    }

    return this.vault.contract.repayOutstandingDebt();
  }

  async repayDelinquentDebt(): Promise<ContractTransaction> {
    const signer = await this.vault.signer.getAddress();
    if (signer !== this.account) {
      throw Error(`VaultAccount signer ${signer} does not match ${this.account}`);
    }
    if (!this.isBorrower) {
      throw Error("Only borrower can repay");
    }

    return this.vault.contract.repayDelinquentDebt();
  }

  /**
   * @returns Amount of underlying token borrower can borrow
   */
  getBorrowableAmount(amount: TokenAmount): TokenAmount {
    return minTokenAmount(amount, this.vault.borrowableAssets);
  }

  async update(): Promise<void> {
    const acccountVaultInfo = await this.vault.getAccountInfo();
    updateObject(this, acccountVaultInfo, VaultAccount.UpdatableKeys);
  }

  applyUpdate(info: AccountVaultInfoStructOutput): void {
    const account = VaultAccount.fromAccountVaultInfoStruct(this.account, info, this.vault);
    updateObject(this, account, VaultAccount.UpdatableKeys);
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
        remainder: this.getAllowanceRemainder(amount)
      };
    }
    return { status: "Ready" };
  }

  static fromAccountVaultInfoStruct(
    account: string,
    info: AccountVaultInfoStructOutput,
    vault: Vault
  ): VaultAccount {
    return new VaultAccount(
      account,
      vault.vaultToken.getAmount(info.normalizedBalance),
      vault.underlyingToken.getAmount(info.underlyingBalance),
      info.underlyingApproval,
      vault
    );
  }

  static fromVaultDataWithAccountStruct(
    provider: SignerOrProvider,
    account: string,
    info: VaultDataWithAccountStructOutput
  ): VaultAccount {
    return VaultAccount.fromAccountVaultInfoStruct(
      account,
      info.account,
      Vault.fromVaultMetadataStruct(info.vault, provider)
    );
  }

  /**
   * Get a `VaultAccount` for a given account and existing `Vault` instance.
   * If `vault` is a string, the vault data will be fetched in the same call as the account data.
   */
  static async getVaultAccount(
    provider: SignerOrProvider,
    account: string,
    vault: Vault | string
  ): Promise<VaultAccount> {
    const lens = getLensContract(provider);
    if (vault instanceof Vault) {
      return lens
        .getAccountVaultInfo(account, vault.address)
        .then((info) => VaultAccount.fromAccountVaultInfoStruct(account, info, vault));
    } else {
      return lens
        .getVaultDataWithAccount(account, vault)
        .then((info) => VaultAccount.fromVaultDataWithAccountStruct(provider, account, info));
    }
  }

  /**
   * Get multiple `VaultAccount`s given an account and existing list of `Vault`
   * instances or vault addresses. If `vaults` is an array of strings, the vault
   * data will be fetched in the same call as the account data.
   */
  static async getVaultAccounts(
    provider: SignerOrProvider,
    account: string,
    vaults: Vault[] | string[]
  ): Promise<VaultAccount[]> {
    const lens = getLensContract(provider);
    if (vaults.length === 0) {
      return [];
    }
    if (isVaultInstanceArray(vaults)) {
      return lens
        .getAccountVaultsInfo(
          account,
          vaults.map((v) => v.address)
        )
        .then((infos) =>
          infos.map((info, i) => VaultAccount.fromAccountVaultInfoStruct(account, info, vaults[i]))
        );
    } else {
      return lens
        .getVaultsDataWithAccount(account, vaults)
        .then((infos) =>
          infos.map((info) => VaultAccount.fromVaultDataWithAccountStruct(provider, account, info))
        );
    }
  }

  /**
   * Get all `VaultAccount`s for a given account.
   * Fetches the vault data in the same call as the account data.
   */
  static getAllVaultAccounts(provider: SignerOrProvider, account: string): Promise<VaultAccount[]> {
    const lens = getLensContract(provider);
    return lens
      .getAllVaultsDataWithAccount(account)
      .then((infos) =>
        infos.map((info) => VaultAccount.fromVaultDataWithAccountStruct(provider, account, info))
      );
  }

  /**
   * Get paginated `VaultAccount`s for a given account.
   * Fetches the vault data in the same call as the account data.
   * @note Throws an error if `start + count` exceeds the number of vaults.
   */
  static getPaginatedVaultAccounts(
    provider: SignerOrProvider,
    account: string,
    start = 0,
    count: number
  ): Promise<VaultAccount[]> {
    const lens = getLensContract(provider);
    return lens
      .getPaginatedVaultsDataWithAccount(account, start, count)
      .then((infos) =>
        infos.map((info) => VaultAccount.fromVaultDataWithAccountStruct(provider, account, info))
      );
  }
}
