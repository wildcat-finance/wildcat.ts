import { BigNumber, ContractReceipt, ContractTransaction, constants } from "ethers";
import { Token, TokenAmount } from "../token";
import { ContractWrapper, PartialTransaction, Signer, SignerOrProvider } from "../types";
import { SupportedChainId, getDeploymentAddress } from "../constants";
import { assert } from "../utils";
import {
  IERC20__factory,
  Wildcat4626Wrapper,
  Wildcat4626Wrapper__factory,
  Wildcat4626WrapperFactory,
  Wildcat4626WrapperFactory__factory
} from "../typechain";
import { WrapperDeployedEvent } from "../typechain/Wildcat4626WrapperFactory";

const getErc20Token = async (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  address: string
): Promise<Token> => {
  const erc20 = IERC20__factory.connect(address, provider);
  const [name, symbol, decimals] = await Promise.all([
    erc20.name(),
    erc20.symbol(),
    erc20.decimals()
  ]);
  return new Token(chainId, address, name, symbol, decimals, false, provider);
};

export class WrapperFactory extends ContractWrapper<Wildcat4626WrapperFactory> {
  readonly contractFactory = Wildcat4626WrapperFactory__factory;

  protected get _contractAddress(): string {
    return this.address;
  }

  constructor(
    public chainId: SupportedChainId,
    public address: string,
    provider: SignerOrProvider
  ) {
    super(provider);
  }

  static getFactory(chainId: SupportedChainId, providerOrSigner: SignerOrProvider): WrapperFactory {
    assert(providerOrSigner !== undefined, "Signer does not have a provider");
    return new WrapperFactory(
      chainId,
      getDeploymentAddress(chainId, "Wildcat4626WrapperFactory"),
      providerOrSigner
    );
  }

  static async getWrapperForMarket(
    chainId: SupportedChainId,
    providerOrSigner: SignerOrProvider,
    market: string
  ): Promise<string> {
    const factory = WrapperFactory.getFactory(chainId, providerOrSigner);
    return factory.getWrapperForMarket(market);
  }

  static async createWrapper(
    chainId: SupportedChainId,
    signer: Signer,
    market: string
  ): Promise<{ wrapper: string; receipt: ContractReceipt; transaction: ContractTransaction }> {
    const factory = WrapperFactory.getFactory(chainId, signer);
    return factory.createWrapper(market);
  }

  static populateCreateWrapper(
    chainId: SupportedChainId,
    providerOrSigner: SignerOrProvider,
    market: string
  ): PartialTransaction {
    const factory = WrapperFactory.getFactory(chainId, providerOrSigner);
    return factory.populateCreateWrapper(market);
  }

  async getWrapperForMarket(market: string): Promise<string> {
    return this.contract.wrapperForMarket(market);
  }

  async createWrapper(market: string): Promise<{
    wrapper: string;
    receipt: ContractReceipt;
    transaction: ContractTransaction;
  }> {
    const transaction = await this.contract.createWrapper(market);
    const receipt = await transaction.wait();
    const event = receipt.events?.find((e) => e.event === "WrapperDeployed") as
      | WrapperDeployedEvent
      | undefined;
    const wrapper = event?.args?.wrapper ?? (await this.contract.wrapperForMarket(market));
    return { wrapper, receipt, transaction };
  }

  populateCreateWrapper(market: string): PartialTransaction {
    return {
      to: this.address,
      data: this.contract.interface.encodeFunctionData("createWrapper", [market]),
      value: "0"
    };
  }
}

export type TokenWrapperArgs = {
  chainId: SupportedChainId;
  provider: SignerOrProvider;
  address: string;
  marketAddress: string;
  marketToken: Token;
  shareToken: Token;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TokenWrapper extends Omit<TokenWrapperArgs, "provider"> {}

export class TokenWrapper extends ContractWrapper<Wildcat4626Wrapper> {
  readonly contractFactory = Wildcat4626Wrapper__factory;
  public name: string;
  public symbol: string;
  public decimals: number;

  protected get _contractAddress(): string {
    return this.address;
  }

  constructor({ provider, ...args }: TokenWrapperArgs) {
    super(provider);
    Object.assign(this, args);
    this.name = this.shareToken.name;
    this.symbol = this.shareToken.symbol;
    this.decimals = this.shareToken.decimals;
  }

  static async fromAddress(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    address: string
  ): Promise<TokenWrapper> {
    const wrapper = Wildcat4626Wrapper__factory.connect(address, provider);
    const [marketAddress, name, symbol, decimals] = await Promise.all([
      wrapper.market(),
      wrapper.name(),
      wrapper.symbol(),
      wrapper.decimals()
    ]);

    const [marketToken] = await Promise.all([
      getErc20Token(chainId, provider, marketAddress)
    ]);
    const shareToken = new Token(chainId, address, name, symbol, decimals, false, provider);

    return new TokenWrapper({
      chainId,
      provider,
      address,
      marketAddress,
      marketToken,
      shareToken
    });
  }

  static async fromMarket(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    marketAddress: string
  ): Promise<TokenWrapper> {
    const wrapperAddress = await WrapperFactory.getWrapperForMarket(
      chainId,
      provider,
      marketAddress
    );
    assert(
      wrapperAddress !== constants.AddressZero,
      `No wrapper deployed for market ${marketAddress}`
    );
    return TokenWrapper.fromAddress(chainId, provider, wrapperAddress);
  }

  static async create(
    chainId: SupportedChainId,
    signer: Signer,
    marketAddress: string
  ): Promise<{ wrapper: TokenWrapper; receipt: ContractReceipt; transaction: ContractTransaction }> {
    const factory = WrapperFactory.getFactory(chainId, signer);
    const { wrapper: wrapperAddress, receipt, transaction } = await factory.createWrapper(
      marketAddress
    );
    const wrapper = await TokenWrapper.fromAddress(chainId, signer, wrapperAddress);
    return { wrapper, receipt, transaction };
  }

  async totalAssets(): Promise<TokenAmount> {
    const assets = await this.contract.totalAssets();
    return this.marketToken.getAmount(assets);
  }

  async convertToShares(assets: TokenAmount): Promise<TokenAmount> {
    const shares = await this.contract.convertToShares(assets.raw);
    return this.shareToken.getAmount(shares);
  }

  async convertToAssets(shares: TokenAmount): Promise<TokenAmount> {
    const assets = await this.contract.convertToAssets(shares.raw);
    return this.marketToken.getAmount(assets);
  }

  async maxDeposit(receiver: string): Promise<TokenAmount> {
    const assets = await this.contract.maxDeposit(receiver);
    return this.marketToken.getAmount(assets);
  }

  async previewDeposit(assets: TokenAmount): Promise<TokenAmount> {
    const shares = await this.contract.previewDeposit(assets.raw);
    return this.shareToken.getAmount(shares);
  }

  async maxMint(receiver: string): Promise<TokenAmount> {
    const shares = await this.contract.maxMint(receiver);
    return this.shareToken.getAmount(shares);
  }

  async previewMint(shares: TokenAmount): Promise<TokenAmount> {
    const assets = await this.contract.previewMint(shares.raw);
    return this.marketToken.getAmount(assets);
  }

  async maxWithdraw(owner: string): Promise<TokenAmount> {
    const assets = await this.contract.maxWithdraw(owner);
    return this.marketToken.getAmount(assets);
  }

  async previewWithdraw(assets: TokenAmount): Promise<TokenAmount> {
    const shares = await this.contract.previewWithdraw(assets.raw);
    return this.shareToken.getAmount(shares);
  }

  async maxRedeem(owner: string): Promise<TokenAmount> {
    const shares = await this.contract.maxRedeem(owner);
    return this.shareToken.getAmount(shares);
  }

  async previewRedeem(shares: TokenAmount): Promise<TokenAmount> {
    const assets = await this.contract.previewRedeem(shares.raw);
    return this.marketToken.getAmount(assets);
  }

  async assetsPerShareRay(): Promise<BigNumber> {
    return this.contract.assetsPerShareRay();
  }

  async sharesPerAssetRay(): Promise<BigNumber> {
    return this.contract.sharesPerAssetRay();
  }

  async deposit(assets: TokenAmount, receiver: string): Promise<ContractTransaction> {
    return this.contract.deposit(assets.raw, receiver);
  }

  populateDeposit(assets: TokenAmount, receiver: string): PartialTransaction {
    return {
      to: this.address,
      data: this.contract.interface.encodeFunctionData("deposit", [assets.raw, receiver]),
      value: "0"
    };
  }

  async mint(shares: TokenAmount, receiver: string): Promise<ContractTransaction> {
    return this.contract.mint(shares.raw, receiver);
  }

  populateMint(shares: TokenAmount, receiver: string): PartialTransaction {
    return {
      to: this.address,
      data: this.contract.interface.encodeFunctionData("mint", [shares.raw, receiver]),
      value: "0"
    };
  }

  async withdraw(
    assets: TokenAmount,
    receiver: string,
    owner: string
  ): Promise<ContractTransaction> {
    return this.contract.withdraw(assets.raw, receiver, owner);
  }

  populateWithdraw(assets: TokenAmount, receiver: string, owner: string): PartialTransaction {
    return {
      to: this.address,
      data: this.contract.interface.encodeFunctionData("withdraw", [
        assets.raw,
        receiver,
        owner
      ]),
      value: "0"
    };
  }

  async redeem(
    shares: TokenAmount,
    receiver: string,
    owner: string
  ): Promise<ContractTransaction> {
    return this.contract.redeem(shares.raw, receiver, owner);
  }

  populateRedeem(shares: TokenAmount, receiver: string, owner: string): PartialTransaction {
    return {
      to: this.address,
      data: this.contract.interface.encodeFunctionData("redeem", [
        shares.raw,
        receiver,
        owner
      ]),
      value: "0"
    };
  }

  async sweep(token: string, to: string): Promise<ContractTransaction> {
    return this.contract.sweep(token, to);
  }

  populateSweep(token: string, to: string): PartialTransaction {
    return {
      to: this.address,
      data: this.contract.interface.encodeFunctionData("sweep", [token, to]),
      value: "0"
    };
  }
}
