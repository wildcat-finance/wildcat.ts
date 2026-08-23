import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { Token, TokenAmount, toRawAmount } from "../token";
import {
  ContractWrapper,
  PartialTransaction,
  Signer,
  SignerOrProvider,
  SubmittedDeployment,
  TransactionHash
} from "../types";
import { SupportedChainId, getDeploymentAddress, hasDeploymentAddress } from "../constants";
import { assert, prepareTransaction, rayMulBigint, toNumber } from "../utils";
import {
  iERC20Abi,
  wildcat4626WrapperAbi,
  wildcat4626WrapperFactoryAbi,
  wildcatMarketV2Abi
} from "../abi";
import {
  submitPreparedTransaction,
  submitPreparedTransactionAndWait
} from "../internal/viem-write";
import { parseEventLogs, zeroAddress } from "viem";
import { getViemPublicClientFromEthers } from "../internal/ethers-viem";
import { readViemContract } from "../internal/viem-read";
import {
  GetIndexedTokenWrapperAccountDocument,
  GetIndexedTokenWrapperActivityDocument,
  GetTokenWrapperForMarketDocument,
  SubgraphGetIndexedTokenWrapperAccountQuery,
  SubgraphGetIndexedTokenWrapperAccountQueryVariables,
  SubgraphGetIndexedTokenWrapperActivityQuery,
  SubgraphGetIndexedTokenWrapperActivityQueryVariables,
  SubgraphGetTokenWrapperForMarketQuery,
  SubgraphGetTokenWrapperForMarketQueryVariables,
  SubgraphTokenWrapperDataFragment
} from "../gql/graphql";
import { Market } from "../market";
import { IndexedAt } from "../domain";
import {
  InterestOnlyWithdrawalQuote,
  createInterestOnlyWithdrawalQuote
} from "../interest-only-withdrawal";
import { usesLegacySubgraphSchema } from "../config";

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

export class WrapperFactory extends ContractWrapper {
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
    const publicClient = getViemPublicClientFromEthers(providerOrSigner);
    try {
      const registeredWrapper = await readViemContract<string>(
        publicClient,
        market,
        wildcatMarketV2Abi,
        "registeredWrapper"
      );
      if (registeredWrapper !== zeroAddress) {
        return registeredWrapper;
      }
    } catch (_) {
      // Markets before V2.5 do not expose registeredWrapper; use the
      // generation-routing factory facade for those markets.
    }
    const factory = WrapperFactory.getFactory(chainId, providerOrSigner);
    return factory.getWrapperForMarket(market);
  }

  static async isFloorRoundingMarket(
    chainId: SupportedChainId,
    providerOrSigner: SignerOrProvider,
    market: string
  ): Promise<boolean> {
    return WrapperFactory.getFactory(chainId, providerOrSigner).isFloorRoundingMarket(market);
  }

  static async createWrapper(
    chainId: SupportedChainId,
    signer: Signer,
    market: string
  ): Promise<SubmittedDeployment<string> & { wrapper: string }> {
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

  async isFloorRoundingMarket(market: string): Promise<boolean> {
    return readViemContract<boolean>(
      getViemPublicClientFromEthers(this.provider),
      this.address,
      wildcat4626WrapperFactoryAbi,
      "isFloorRoundingMarket",
      [market]
    );
  }

  async getV1Factory(): Promise<string> {
    return readViemContract<string>(
      getViemPublicClientFromEthers(this.provider),
      this.address,
      wildcat4626WrapperFactoryAbi,
      "v1Factory"
    );
  }

  async createWrapper(market: string): Promise<SubmittedDeployment<string> & { wrapper: string }> {
    const { hash, receipt, transaction } = await submitPreparedTransactionAndWait(
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
    return { hash, receipt, transaction, result: wrapper, wrapper };
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

export {
  GetIndexedTokenWrapperAccountDocument,
  GetIndexedTokenWrapperActivityDocument,
  GetTokenWrapperForMarketDocument
} from "../gql/graphql";

type SubgraphTokenWrapperFactoryData = SubgraphTokenWrapperDataFragment["factory"];
type SubgraphTokenWrapperDeployedEventData = NonNullable<
  SubgraphTokenWrapperDataFragment["deployedEvent"]
>;

export type SubgraphTokenWrapperData = Omit<
  SubgraphTokenWrapperDataFragment,
  "__typename" | "deployedEvent" | "factory"
> & {
  __typename?: SubgraphTokenWrapperDataFragment["__typename"];
  factory: Omit<SubgraphTokenWrapperFactoryData, "__typename"> & {
    __typename?: SubgraphTokenWrapperFactoryData["__typename"];
  };
  deployedEvent?:
    | (Omit<SubgraphTokenWrapperDeployedEventData, "__typename"> & {
        __typename?: SubgraphTokenWrapperDeployedEventData["__typename"];
      })
    | null;
};

export type GetTokenWrapperForMarketOptions = {
  chainId: SupportedChainId;
  signerOrProvider: SignerOrProvider;
  market: string;
  fetchPolicy?: FetchPolicy;
  fallbackToFactory?: boolean;
};

export type IndexedTokenWrapperAccount = {
  account: string;
  wrapper: string;
  shares: TokenAmount;
  /** Nominal underlying principal in the market asset's raw units. */
  principalBasis: bigint;
  indexedAt: IndexedAt;
};

type IndexedTokenWrapperActivityBase = IndexedAt & {
  id: string;
  wrapper: string;
};

export type IndexedTokenWrapperDeposit = IndexedTokenWrapperActivityBase & {
  kind: "deposit";
  account: string;
  caller: string;
  assets: TokenAmount;
  shares: TokenAmount;
  principalBasisAmount: bigint;
  marketTransfer?: string;
};

export type IndexedTokenWrapperWithdrawal = IndexedTokenWrapperActivityBase & {
  kind: "withdrawal";
  account: string;
  caller: string;
  receiver: string;
  assets: TokenAmount;
  shares: TokenAmount;
  principalBasisAmount: bigint;
  marketTransfer?: string;
};

export type IndexedTokenWrapperTransfer = IndexedTokenWrapperActivityBase & {
  kind: "transfer";
  fromAddress: string;
  toAddress: string;
  fromAccount?: string;
  toAccount?: string;
  shares: TokenAmount;
  principalBasisAmount: bigint;
};

export type IndexedTokenWrapperTokensSwept = IndexedTokenWrapperActivityBase & {
  kind: "tokens-swept";
  token: string;
  receiver: string;
  amount: bigint;
  principalBasisAmount: bigint;
  marketTransfer?: string;
};

export type IndexedTokenWrapperActivityPage = {
  deposits: IndexedTokenWrapperDeposit[];
  withdrawals: IndexedTokenWrapperWithdrawal[];
  transfers: IndexedTokenWrapperTransfer[];
  tokenSweeps: IndexedTokenWrapperTokensSwept[];
};

export type GetIndexedTokenWrapperAccountOptions = {
  account: string;
  fetchPolicy?: FetchPolicy;
};

export type GetIndexedTokenWrapperActivityOptions = {
  /** applied independently to each of the four wrapper event streams. */
  first?: number;
  /** applied independently to each of the four wrapper event streams. */
  skip?: number;
  fetchPolicy?: FetchPolicy;
};

export async function getTokenWrapperDataForMarket(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  market: string,
  fetchPolicy: FetchPolicy = "cache-first"
): Promise<SubgraphTokenWrapperData | undefined> {
  const result = await subgraphClient.query<
    SubgraphGetTokenWrapperForMarketQuery,
    SubgraphGetTokenWrapperForMarketQueryVariables
  >({
    query: GetTokenWrapperForMarketDocument,
    variables: {
      market: market.toLowerCase()
    },
    fetchPolicy
  });

  return result.data.market?.tokenWrapper ?? undefined;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TokenWrapper extends Omit<TokenWrapperArgs, "provider"> {}

export class TokenWrapper extends ContractWrapper {
  public name: string;
  public symbol: string;
  public decimals: number;

  constructor({ provider, ...args }: TokenWrapperArgs) {
    super(provider);
    Object.assign(this, args);
    this.name = this.shareToken.name;
    this.symbol = this.shareToken.symbol;
    this.decimals = this.shareToken.decimals;
  }

  static fromSubgraphData(
    chainId: SupportedChainId,
    provider: SignerOrProvider,
    data: SubgraphTokenWrapperData
  ): TokenWrapper {
    return new TokenWrapper({
      chainId,
      provider,
      address: data.address,
      marketAddress: data.marketAddress,
      marketToken: Token.fromSubgraphToken(chainId, data.marketToken, provider),
      shareToken: Token.fromSubgraphToken(chainId, data.token, provider)
    });
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

  static async fromMarketWithSubgraph(
    subgraphClient: ApolloClient<NormalizedCacheObject>,
    {
      chainId,
      signerOrProvider,
      market,
      fetchPolicy = "cache-first",
      fallbackToFactory = true
    }: GetTokenWrapperForMarketOptions
  ): Promise<TokenWrapper | undefined> {
    try {
      const wrapper = await getTokenWrapperDataForMarket(subgraphClient, market, fetchPolicy);
      if (wrapper) {
        return TokenWrapper.fromSubgraphData(chainId, signerOrProvider, wrapper);
      }
    } catch (error) {
      if (!fallbackToFactory) {
        throw error;
      }
    }

    if (!fallbackToFactory || !hasDeploymentAddress(chainId, "Wildcat4626WrapperFactory")) {
      return undefined;
    }

    const wrapperAddress = await WrapperFactory.getWrapperForMarket(
      chainId,
      signerOrProvider,
      market
    );
    if (!wrapperAddress || wrapperAddress === zeroAddress) {
      return undefined;
    }
    return TokenWrapper.fromAddress(chainId, signerOrProvider, wrapperAddress);
  }

  static async create(
    chainId: SupportedChainId,
    signer: Signer,
    marketAddress: string
  ): Promise<SubmittedDeployment<TokenWrapper> & { wrapper: TokenWrapper }> {
    const factory = WrapperFactory.getFactory(chainId, signer);
    const {
      result: wrapperAddress,
      receipt,
      hash,
      transaction
    } = await factory.createWrapper(marketAddress);
    const wrapper = await TokenWrapper.fromAddress(chainId, signer, wrapperAddress);
    return { result: wrapper, receipt, hash, transaction, wrapper };
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

  async getIndexedAccount(
    subgraphClient: ApolloClient<NormalizedCacheObject>,
    { account, fetchPolicy = "cache-first" }: GetIndexedTokenWrapperAccountOptions
  ): Promise<IndexedTokenWrapperAccount | undefined> {
    if (usesLegacySubgraphSchema(this.chainId)) return undefined;
    const normalizedAccount = account.toLowerCase();
    const { data } = await subgraphClient.query<
      SubgraphGetIndexedTokenWrapperAccountQuery,
      SubgraphGetIndexedTokenWrapperAccountQueryVariables
    >({
      query: GetIndexedTokenWrapperAccountDocument,
      variables: {
        wrapper: this.address.toLowerCase(),
        account: normalizedAccount
      },
      fetchPolicy
    });
    const indexedAccount = data.wildcat4626Wrapper?.accounts[0];
    if (!indexedAccount) return undefined;
    return {
      account: indexedAccount.address,
      wrapper: this.address,
      shares: this.shareToken.getAmount(indexedAccount.shares),
      principalBasis: BigInt(indexedAccount.principalBasis),
      indexedAt: {
        blockNumber: BigInt(indexedAccount.updatedAtBlock),
        blockTimestamp: BigInt(indexedAccount.updatedAtTimestamp),
        transactionHash: indexedAccount.updatedAtTransaction,
        logIndex: BigInt(indexedAccount.updatedAtLogIndex)
      }
    };
  }

  async getIndexedActivity(
    subgraphClient: ApolloClient<NormalizedCacheObject>,
    {
      first = 100,
      skip = 0,
      fetchPolicy = "cache-first"
    }: GetIndexedTokenWrapperActivityOptions = {}
  ): Promise<IndexedTokenWrapperActivityPage | undefined> {
    if (usesLegacySubgraphSchema(this.chainId)) return undefined;
    assert(Number.isInteger(first) && first > 0, "first must be a positive integer");
    assert(Number.isInteger(skip) && skip >= 0, "skip must be a non-negative integer");
    const wrapper = this.address.toLowerCase();
    const { data } = await subgraphClient.query<
      SubgraphGetIndexedTokenWrapperActivityQuery,
      SubgraphGetIndexedTokenWrapperActivityQueryVariables
    >({
      query: GetIndexedTokenWrapperActivityDocument,
      variables: { wrapper, first, skip },
      fetchPolicy
    });
    const activity = data.wildcat4626Wrapper;
    if (!activity) return undefined;
    const indexedAt = (
      blockNumber: string,
      blockTimestamp: string,
      transactionHash: string,
      blockLogIndex: string
    ): IndexedAt => ({
      blockNumber: BigInt(blockNumber),
      blockTimestamp: BigInt(blockTimestamp),
      transactionHash,
      logIndex: BigInt(blockLogIndex)
    });
    const byIndexedAt = (left: IndexedAt, right: IndexedAt): number => {
      if (left.blockNumber !== right.blockNumber) {
        return left.blockNumber < right.blockNumber ? -1 : 1;
      }
      if (left.logIndex === right.logIndex) return 0;
      return left.logIndex < right.logIndex ? -1 : 1;
    };
    return {
      deposits: activity.deposits
        .map((event) => ({
          id: event.id,
          kind: "deposit" as const,
          wrapper,
          account: event.account.address,
          caller: event.caller,
          assets: this.marketToken.getAmount(event.assets),
          shares: this.shareToken.getAmount(event.shares),
          principalBasisAmount: BigInt(event.principalBasisAmount),
          ...(event.marketTransfer ? { marketTransfer: event.marketTransfer.id } : {}),
          ...indexedAt(
            event.blockNumber,
            event.blockTimestamp,
            event.transactionHash,
            event.blockLogIndex
          )
        }))
        .sort(byIndexedAt),
      withdrawals: activity.withdrawals
        .map((event) => ({
          id: event.id,
          kind: "withdrawal" as const,
          wrapper,
          account: event.account.address,
          caller: event.caller,
          receiver: event.receiver,
          assets: this.marketToken.getAmount(event.assets),
          shares: this.shareToken.getAmount(event.shares),
          principalBasisAmount: BigInt(event.principalBasisAmount),
          ...(event.marketTransfer ? { marketTransfer: event.marketTransfer.id } : {}),
          ...indexedAt(
            event.blockNumber,
            event.blockTimestamp,
            event.transactionHash,
            event.blockLogIndex
          )
        }))
        .sort(byIndexedAt),
      transfers: activity.transfers
        .map((event) => ({
          id: event.id,
          kind: "transfer" as const,
          wrapper,
          fromAddress: event.fromAddress,
          toAddress: event.toAddress,
          ...(event.from ? { fromAccount: event.from.address } : {}),
          ...(event.to ? { toAccount: event.to.address } : {}),
          shares: this.shareToken.getAmount(event.shares),
          principalBasisAmount: BigInt(event.principalBasisAmount),
          ...indexedAt(
            event.blockNumber,
            event.blockTimestamp,
            event.transactionHash,
            event.blockLogIndex
          )
        }))
        .sort(byIndexedAt),
      tokenSweeps: activity.tokenSweeps
        .map((event) => ({
          id: event.id,
          kind: "tokens-swept" as const,
          wrapper,
          token: event.token,
          receiver: event.receiver,
          amount: BigInt(event.amount),
          principalBasisAmount: BigInt(event.principalBasisAmount),
          ...(event.marketTransfer ? { marketTransfer: event.marketTransfer.id } : {}),
          ...indexedAt(
            event.blockNumber,
            event.blockTimestamp,
            event.transactionHash,
            event.blockLogIndex
          )
        }))
        .sort(byIndexedAt)
    };
  }

  /**
   * Quote interest attached to an indexed wrapper-share position. Wrapper
   * interest still has to be unwrapped before it can use ordinary
   * queueWithdrawal(amount); this helper does not approximate that action.
   */
  async getInterestOnlyWithdrawalQuote(
    subgraphClient: ApolloClient<NormalizedCacheObject>,
    market: Market,
    options: GetIndexedTokenWrapperAccountOptions & { quotedAtTimestamp?: number }
  ): Promise<InterestOnlyWithdrawalQuote | undefined> {
    assert(
      market.address.toLowerCase() === this.marketAddress.toLowerCase(),
      "Wrapper does not belong to the supplied market"
    );
    const [indexedAccount, currentShares] = await Promise.all([
      this.getIndexedAccount(subgraphClient, options),
      this.shareToken.balanceOf(options.account)
    ]);
    if (!indexedAccount) return undefined;
    const currentBalance = market.underlyingToken.getAmount(
      rayMulBigint(currentShares.raw, market.scaleFactor)
    );
    return createInterestOnlyWithdrawalQuote({
      account: indexedAccount.account,
      market: market.address,
      position: { kind: "wrapper", address: this.address },
      assetToken: market.underlyingToken,
      indexedScaledBalance: indexedAccount.shares.raw,
      currentScaledBalance: currentShares.raw,
      currentBalance,
      principalBasis: market.underlyingToken.getAmount(indexedAccount.principalBasis),
      currentScaleFactor: market.scaleFactor,
      basisIndexedAt: indexedAccount.indexedAt,
      balanceStateSource: market.stateSource,
      quotedAtTimestamp: options.quotedAtTimestamp
    });
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

  async nukeFromOrbit(account: string): Promise<TransactionHash> {
    return submitPreparedTransaction(this.signer, this.populateNukeFromOrbit(account));
  }

  populateNukeFromOrbit(account: string): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: wildcat4626WrapperAbi,
      functionName: "nukeFromOrbit",
      args: [account]
    });
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

  /**
   * Prepare the v2.5 Safe batch for exact wrapped-share queueing.
   *
   * Both transactions must execute atomically from `account`. The market call
   * uses the raw wrapper share amount without converting it to normalized
   * assets. Markets deployed before the v2.5 scaled-queue change do not expose
   * the second selector.
   */
  populateRedeemAndQueueWithdrawalScaledBatch(
    shares: TokenAmount,
    account: string
  ): [PartialTransaction, PartialTransaction] {
    return [
      this.populateRedeem(shares, account, account),
      prepareTransaction({
        to: this.marketAddress,
        abi: wildcatMarketV2Abi,
        functionName: "queueWithdrawalScaled",
        args: [shares.raw]
      })
    ];
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
