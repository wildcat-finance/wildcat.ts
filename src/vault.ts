import { BigNumber } from "ethers";
import { WildcatVaultToken, WildcatVaultToken__factory } from "./typechain";
import { VaultDataStructOutput } from "./typechain";
import { getLensContract } from "./constants";
import { TokenAmount, Token } from "./token";
import { SignerOrProvider, ContractWrapper } from "./types";
import { formatUnits } from "ethers/lib/utils";
import { updateObject } from "./misc";
import { VaultAccount } from "./account";
import { RAY } from "./constants";

export type CollateralizationInfo = {
  // Percentage of total assets that must be held in reserve
  targetRatio: number;
  // Percentage of total assets actually held in reserve
  actualRatio: number;
  // Indicates whether the ratio is temporarily increased due to reduction in APR
  isTemporary?: boolean;
  // Original target collateralization ratio (percentage) before any temporary changes
  originalTargetRatio?: number;
  // Expiry of temporary ratio
  temporaryExpiry?: number;
};

export class Vault extends ContractWrapper<WildcatVaultToken> {
  static readonly UpdatableKeys: Array<keyof Vault> = [
    "vaultToken",
    "underlyingToken",
    "borrower",
    "controller",
    "feeRecipient",
    "interestFeeBips",
    "penaltyFeeBips",
    "gracePeriod",
    "annualInterestBips",
    "liquidityCoverageBips",
    "temporaryLiquidityCoverage",
    "originalLiquidityCoverageBips",
    "temporaryLiquidityCoverageExpiry",
    "borrowableAssets",
    "maxTotalSupply",
    "scaledTotalSupply",
    "totalSupply",
    "totalAssets",
    "coverageLiquidity",
    "scaleFactor",
    "lastAccruedProtocolFees",
    "isDelinquent",
    "timeDelinquent",
    "lastInterestAccruedTimestamp"
  ];

  constructor(
    public vaultToken: Token,
    public underlyingToken: Token,
    public borrower: string,
    public controller: string,
    public feeRecipient: string,
    public interestFeeBips: number,
    public penaltyFeeBips: number,
    // Seconds delinquency is allowed before liquidation
    public gracePeriod: number,
    public annualInterestBips: number,
    public liquidityCoverageBips: number,
    public temporaryLiquidityCoverage: boolean,
    public originalLiquidityCoverageBips: number,
    public temporaryLiquidityCoverageExpiry: number,
    public borrowableAssets: TokenAmount,
    // Maximum amount of vault tokens that can be minted
    public maxTotalSupply: TokenAmount,
    public scaledTotalSupply: BigNumber,
    // Total amount of vault tokens in existence
    public totalSupply: TokenAmount,
    // Total amount of underlying assets held in the vault
    public totalAssets: TokenAmount,
    // Amount of underlying assets that should be held in reserve for current supply
    public coverageLiquidity: TokenAmount,
    public scaleFactor: BigNumber,
    public lastAccruedProtocolFees: BigNumber,
    // Whether the vault is delinquent
    public isDelinquent: boolean,
    // Seconds the vault has been delinquent
    public timeDelinquent: number,
    // Timestamp of last interest accrual
    public lastInterestAccruedTimestamp: number,
    _provider: SignerOrProvider
  ) {
    super(_provider);
  }

  readonly contractFactory = WildcatVaultToken__factory;

  /** @returns Address of the vault token */
  get address(): string {
    return this.vaultToken.address;
  }

  get name(): string {
    return this.vaultToken.name;
  }

  get symbol(): string {
    return this.vaultToken.symbol;
  }

  get decimals(): number {
    return this.vaultToken.decimals;
  }

  /** @returns Percentage growth of the vault since it was created */
  get allTimeGrowth(): number {
    // 27 - 2 to convert to percentage
    return +formatUnits(this.scaleFactor, 25);
  }

  /** @returns Maximum amount of underlying token that can be deposited */
  get maximumDeposit(): TokenAmount {
    return this.underlyingToken.getAmount(this.maxTotalSupply.raw.sub(this.totalSupply.raw));
  }

  /** @returns Amount of assets borrower must deposit to not be delinquent */
  get collateralNeededForGoodStanding(): TokenAmount {
    const collateral = this.totalAssets;
    const coverage = this.coverageLiquidity;

    return coverage.satsub(collateral);
  }

  get isIncurringPenalties(): boolean {
    return this.isDelinquent && this.timeDelinquent > this.gracePeriod;
  }

  get delinquentDebt(): TokenAmount {
    const collateral = this.totalAssets;
    const coverage = this.coverageLiquidity;

    return coverage.satsub(collateral);
  }

  get outstandingDebt(): TokenAmount {
    const totalSupply = this.totalSupply;
    const collateral = this.totalAssets;

    return totalSupply.satsub(collateral);
  }

  /** @returns Address of underlying token */
  get asset(): string {
    return this.underlyingToken.address;
  }

  /** @returns Percentage of the interest fee that goes to the protocol */
  get protocolFee(): number {
    return this.interestFeeBips / 100;
  }

  /** @returns Percentage fee added to base interest rate when delinquency exceeds grace period */
  get penaltyFee(): number {
    return this.penaltyFeeBips / 100;
  }

  /** @returns Percentage of total assets that must be held in reserve */
  get collateralization(): CollateralizationInfo {
    const targetRatio = this.liquidityCoverageBips / 100;

    const actualRatio = this.totalSupply.eq(0)
      ? 100
      : +formatUnits(this.totalAssets.raw.mul(RAY).div(this.totalSupply.raw), 25);
    if (this.temporaryLiquidityCoverage) {
      return {
        targetRatio,
        actualRatio,
        isTemporary: true,
        originalTargetRatio: this.originalLiquidityCoverageBips / 100,
        temporaryExpiry: this.temporaryLiquidityCoverageExpiry
      };
    }
    return { targetRatio, actualRatio };
  }

  /** @returns Whether the borrower can change the APR */
  get canReduceAPR(): boolean {
    return this.collateralization.actualRatio >= 90;
  }

  get isClosed(): boolean {
    return this.annualInterestBips == 0;
  }

  async update(): Promise<void> {
    const vault = await Vault.getVaultData(this.address, this.provider);
    updateObject(this, vault, Vault.UpdatableKeys);
  }

  /**
   * @returns Balance of an account in both vault and underlying tokens,
   *          as well as the amount of underlying tokens approved for the vault.
   */
  async getAccountInfo(account?: string): Promise<VaultAccount> {
    const lens = getLensContract(this.provider);
    if (!account) {
      account = await this.signer.getAddress();
    }
    const info = await lens.getAccountVaultInfo(this.address, account);
    return VaultAccount.fromAccountVaultInfoStruct(account, info, this);
  }

  static fromVaultMetadataStruct(data: VaultDataStructOutput, provider: SignerOrProvider): Vault {
    const vaultToken = Token.fromTokenMetadataStruct(data.vaultToken, provider);
    const underlyingToken = Token.fromTokenMetadataStruct(data.underlyingToken, provider);
    return new Vault(
      vaultToken,
      underlyingToken,
      data.borrower,
      data.controller,
      data.feeRecipient,
      data.interestFeeBips.toNumber(),
      data.penaltyFeeBips.toNumber(),
      data.gracePeriod.toNumber(),
      data.annualInterestBips.toNumber(),
      data.liquidityCoverageRatio.toNumber(),
      data.temporaryLiquidityCoverage,
      data.originalLiquidityCoverageRatio.toNumber(),
      data.temporaryLiquidityCoverageExpiry.toNumber(),
      underlyingToken.getAmount(data.borrowableAssets),
      vaultToken.getAmount(data.maxTotalSupply),
      data.scaledTotalSupply,
      vaultToken.getAmount(data.totalSupply),
      underlyingToken.getAmount(data.totalAssets),
      underlyingToken.getAmount(data.coverageLiquidity),
      data.scaleFactor,
      data.lastAccruedProtocolFees,
      data.isDelinquent,
      data.timeDelinquent.toNumber(),
      data.lastInterestAccruedTimestamp.toNumber(),
      provider
    );
  }

  static async getVaultData(vault: string, provider: SignerOrProvider): Promise<Vault> {
    const lens = getLensContract(provider);
    const data = await lens.getVaultData(vault);
    return Vault.fromVaultMetadataStruct(data, provider);
  }

  static async getVaultsData(vaults: string[], provider: SignerOrProvider): Promise<Vault[]> {
    const lens = getLensContract(provider);
    const data = await lens.getVaultsData(vaults);
    return data.map((vault) => Vault.fromVaultMetadataStruct(vault, provider));
  }

  /**
   * Get all deployed vaults.
   */
  static async getAllVaultsData(provider: SignerOrProvider): Promise<Vault[]> {
    const lens = getLensContract(provider);
    return lens
      .getAllVaultsData()
      .then((data) => data.map((vault) => Vault.fromVaultMetadataStruct(vault, provider)));
  }

  /**
   * Get the total number of deployed vaults.
   */
  static async getVaultsCount(provider: SignerOrProvider): Promise<number> {
    const lens = getLensContract(provider);
    return lens.getVaultsCount().then((count) => count.toNumber());
  }

  /**
   * Get a paginated list of deployed vaults.
   */
  static async getPaginatedVaultsData(
    provider: SignerOrProvider,
    start = 0,
    count: number
  ): Promise<Vault[]> {
    const lens = getLensContract(provider);
    return lens
      .getPaginatedVaultsData(start, count)
      .then((data) => data.map((vault) => Vault.fromVaultMetadataStruct(vault, provider)));
  }
}
