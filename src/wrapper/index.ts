import { Token, TokenAmount, toRawAmount } from "../token";
import {
  ContractWrapper,
  PartialTransaction,
  Signer,
  SignerOrProvider,
  SubmittedDeployment,
  TransactionHash
} from "../types";
import { SupportedChainId, getDeploymentAddress } from "../constants";
import { assert, prepareTransaction, toNumber } from "../utils";
import { iERC20Abi, wildcat4626WrapperAbi, wildcat4626WrapperFactoryAbi } from "../abi";
import {
  Wildcat4626Wrapper,
  Wildcat4626Wrapper__factory,
  Wildcat4626WrapperFactory,
  Wildcat4626WrapperFactory__factory
} from "../typechain";
import {
  submitPreparedTransaction,
  submitPreparedTransactionAndWait
} from "../internal/viem-write";
import { parseEventLogs, zeroAddress } from "viem";
import { getViemPublicClientFromEthers } from "../internal/ethers-viem";
import { readViemContract } from "../internal/viem-read";

const getErc20Token = async (
  chainId: SupportedChainId,
  provider: SignerOrProvider,
  address: string
): Promise<Token> => {
  const publicClient = getViemPublicClientFromEthers(provider);
  const [name, symbol, decimals] = await Promise.all([
    readViemContract<string>(publicClient, address, iERC20Abi, "name"),
    readViemContract<string>(publicClient, address, iERC20Abi, "symbol"),
    readViemContract<bigint | number>(publicClient, address, iERC20Abi, "decimals")
  ]);
  return new Token(chainId, address, name, symbol, toNumber(decimals), false, provider);
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
  ): Promise<SubmittedDeployment<string>> {
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
    return readViemContract<string>(
      getViemPublicClientFromEthers(this.provider),
      this.address,
      wildcat4626WrapperFactoryAbi,
      "wrapperForMarket",
      [market]
    );
  }

  async createWrapper(market: string): Promise<SubmittedDeployment<string>> {
    const { hash, receipt } = await submitPreparedTransactionAndWait(
      this.provider,
      this.signer,
      this.populateCreateWrapper(market)
    );
    const event = parseEventLogs({
      abi: wildcat4626WrapperFactoryAbi,
      eventName: "WrapperDeployed",
      logs: receipt.logs
    })[0];
    const wrapper = event?.args.wrapper ?? (await this.getWrapperForMarket(market));
    return { hash, receipt, result: wrapper };
  }

  populateCreateWrapper(market: string): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: wildcat4626WrapperFactoryAbi,
      functionName: "createWrapper",
      args: [market]
    });
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
    const publicClient = getViemPublicClientFromEthers(provider);
    const [marketAddress, name, symbol, decimals] = await Promise.all([
      readViemContract<string>(publicClient, address, wildcat4626WrapperAbi, "market"),
      readViemContract<string>(publicClient, address, wildcat4626WrapperAbi, "name"),
      readViemContract<string>(publicClient, address, wildcat4626WrapperAbi, "symbol"),
      readViemContract<bigint | number>(publicClient, address, wildcat4626WrapperAbi, "decimals")
    ]);

    const [marketToken] = await Promise.all([getErc20Token(chainId, provider, marketAddress)]);
    const shareToken = new Token(
      chainId,
      address,
      name,
      symbol,
      toNumber(decimals),
      false,
      provider
    );

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
    assert(wrapperAddress !== zeroAddress, `No wrapper deployed for market ${marketAddress}`);
    return TokenWrapper.fromAddress(chainId, provider, wrapperAddress);
  }

  static async create(
    chainId: SupportedChainId,
    signer: Signer,
    marketAddress: string
  ): Promise<SubmittedDeployment<TokenWrapper>> {
    const factory = WrapperFactory.getFactory(chainId, signer);
    const { result: wrapperAddress, receipt, hash } = await factory.createWrapper(marketAddress);
    const wrapper = await TokenWrapper.fromAddress(chainId, signer, wrapperAddress);
    return { result: wrapper, receipt, hash };
  }

  private readWrapper<Result>(
    functionName: string,
    args: readonly unknown[] = []
  ): Promise<Result> {
    return readViemContract<Result>(
      getViemPublicClientFromEthers(this.provider),
      this.address,
      wildcat4626WrapperAbi,
      functionName,
      args
    );
  }

  async totalAssets(): Promise<TokenAmount> {
    const assets = await this.readWrapper<bigint>("totalAssets");
    return this.marketToken.getAmount(assets);
  }

  async convertToShares(assets: TokenAmount): Promise<TokenAmount> {
    const shares = await this.readWrapper<bigint>("convertToShares", [assets.raw]);
    return this.shareToken.getAmount(shares);
  }

  async convertToAssets(shares: TokenAmount): Promise<TokenAmount> {
    const assets = await this.readWrapper<bigint>("convertToAssets", [shares.raw]);
    return this.marketToken.getAmount(assets);
  }

  async maxDeposit(receiver: string): Promise<TokenAmount> {
    const assets = await this.readWrapper<bigint>("maxDeposit", [receiver]);
    return this.marketToken.getAmount(assets);
  }

  async previewDeposit(assets: TokenAmount): Promise<TokenAmount> {
    const shares = await this.readWrapper<bigint>("previewDeposit", [assets.raw]);
    return this.shareToken.getAmount(shares);
  }

  async maxMint(receiver: string): Promise<TokenAmount> {
    const shares = await this.readWrapper<bigint>("maxMint", [receiver]);
    return this.shareToken.getAmount(shares);
  }

  async previewMint(shares: TokenAmount): Promise<TokenAmount> {
    const assets = await this.readWrapper<bigint>("previewMint", [shares.raw]);
    return this.marketToken.getAmount(assets);
  }

  async maxWithdraw(owner: string): Promise<TokenAmount> {
    const assets = await this.readWrapper<bigint>("maxWithdraw", [owner]);
    return this.marketToken.getAmount(assets);
  }

  async previewWithdraw(assets: TokenAmount): Promise<TokenAmount> {
    const shares = await this.readWrapper<bigint>("previewWithdraw", [assets.raw]);
    return this.shareToken.getAmount(shares);
  }

  async maxRedeem(owner: string): Promise<TokenAmount> {
    const shares = await this.readWrapper<bigint>("maxRedeem", [owner]);
    return this.shareToken.getAmount(shares);
  }

  async previewRedeem(shares: TokenAmount): Promise<TokenAmount> {
    const assets = await this.readWrapper<bigint>("previewRedeem", [shares.raw]);
    return this.marketToken.getAmount(assets);
  }

  async assetsPerShareRay(): Promise<bigint> {
    return toRawAmount(await this.readWrapper<bigint>("assetsPerShareRay"));
  }

  async sharesPerAssetRay(): Promise<bigint> {
    return toRawAmount(await this.readWrapper<bigint>("sharesPerAssetRay"));
  }

  async deposit(assets: TokenAmount, receiver: string): Promise<TransactionHash> {
    return submitPreparedTransaction(this.signer, this.populateDeposit(assets, receiver));
  }

  populateDeposit(assets: TokenAmount, receiver: string): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: wildcat4626WrapperAbi,
      functionName: "deposit",
      args: [assets.raw, receiver]
    });
  }

  async mint(shares: TokenAmount, receiver: string): Promise<TransactionHash> {
    return submitPreparedTransaction(this.signer, this.populateMint(shares, receiver));
  }

  populateMint(shares: TokenAmount, receiver: string): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: wildcat4626WrapperAbi,
      functionName: "mint",
      args: [shares.raw, receiver]
    });
  }

  async withdraw(assets: TokenAmount, receiver: string, owner: string): Promise<TransactionHash> {
    return submitPreparedTransaction(this.signer, this.populateWithdraw(assets, receiver, owner));
  }

  populateWithdraw(assets: TokenAmount, receiver: string, owner: string): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: wildcat4626WrapperAbi,
      functionName: "withdraw",
      args: [assets.raw, receiver, owner]
    });
  }

  async redeem(shares: TokenAmount, receiver: string, owner: string): Promise<TransactionHash> {
    return submitPreparedTransaction(this.signer, this.populateRedeem(shares, receiver, owner));
  }

  populateRedeem(shares: TokenAmount, receiver: string, owner: string): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: wildcat4626WrapperAbi,
      functionName: "redeem",
      args: [shares.raw, receiver, owner]
    });
  }

  async sweep(token: string, to: string): Promise<TransactionHash> {
    return submitPreparedTransaction(this.signer, this.populateSweep(token, to));
  }

  populateSweep(token: string, to: string): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: wildcat4626WrapperAbi,
      functionName: "sweep",
      args: [token, to]
    });
  }
}
