import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import {
  GetActiveLendersByMarketDocument,
  SubgraphGetActiveLendersByMarketQuery,
  SubgraphGetActiveLendersByMarketQueryVariables
} from "./graphql";
import { Market } from "../market";
import { LenderRole } from "../account";
import { HooksCredential, HooksKind, MarketVersion } from "../types";
import { BigNumber } from "ethers";
import { TokenAmount } from "../token";
import { assert, parseSubgraphLenderHooksAccess, parseSubgraphLenderStatus } from "../utils";

export type GetActiveLendersByMarketOptions = SubgraphGetActiveLendersByMarketQueryVariables & {
  fetchPolicy?: FetchPolicy;
  market: Market;
};

type BasicLenderArgs = {
  market: Market;
  address: string;
  scaledBalance: BigNumber;
  addedTimestamp: number;
  isKnownLender?: boolean;
  /** For V2 markets - credentials on market hooks instance */
  credential?: HooksCredential;

  /** For V1 markets - whether lender has been manually approved on controller  */
  isAuthorizedOnController?: boolean;
  role?: LenderRole;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BasicLenderData extends BasicLenderArgs {}

export class BasicLenderData {
  constructor(args: BasicLenderArgs) {
    Object.assign(this, args);
  }

  get marketBalance(): TokenAmount {
    return this.market.marketToken.getAmount(this.market.normalizeAmount(this.scaledBalance));
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
    if (this.canDeposit) {
      return LenderRole.DepositAndWithdraw;
    }
    if (this.canWithdraw) {
      return LenderRole.WithdrawOnly;
    }
    if (this.credential?.isBlockedFromDeposits || this.role === LenderRole.Blocked) {
      return LenderRole.Blocked;
    }
    return LenderRole.Null;
  }

  get canDeposit(): boolean {
    if (this.market.isClosed) return false;
    if (this.market.version === MarketVersion.V1) {
      if (this.role === LenderRole.Blocked) return false;
      if (
        this.role === LenderRole.DepositAndWithdraw ||
        (this.role === LenderRole.Null && !!this.isAuthorizedOnController)
      ) {
        return true;
      }
      return false;
    } else {
      const config = this.market.hooksConfig;
      assert(config !== undefined, `V2 market missing hooksConfig`);
      // Can deposit if the market does not use the onDeposit hook
      if (!config.flags!.useOnDeposit) return true;
      // Can not deposit if the lender is blocked
      if (this.credential?.isBlockedFromDeposits) return false;
      // Can deposit if lender has credential or market does not require one
      if (config.depositRequiresAccess && !this.hasValidCredential) {
        return false;
      }
      return true;
    }
  }

  get canWithdraw(): boolean {
    if (this.market.version === MarketVersion.V1) {
      if (
        this.role === LenderRole.WithdrawOnly ||
        this.role === LenderRole.DepositAndWithdraw ||
        (this.role === LenderRole.Null && !!this.isAuthorizedOnController)
      ) {
        return true;
      }
      return false;
    } else {
      const config = this.market.hooksConfig;
      assert(config !== undefined, `V2 market missing hooksConfig`);
      // Can withdraw if market does not use wd hook
      if (!config.flags!.useOnQueueWithdrawal) return true;
      // Can not withdraw if market in fixed term
      if (this.market.isInFixedTerm) return false;
      // Can not withdraw if market requires access and lender has no credential and is not a known lender
      if (
        config.flags.useOnQueueWithdrawal &&
        (config.kind === HooksKind.OpenTerm || config.queueWithdrawalRequiresAccess) &&
        !(this.hasValidCredential || this.isKnownLender)
      ) {
        return false;
      }
      return true;
    }
  }
}

export async function getActiveLendersByMarket(
  subgraphClient: ApolloClient<NormalizedCacheObject>,
  { fetchPolicy, market, ...options }: GetActiveLendersByMarketOptions
): Promise<BasicLenderData[]> {
  const {
    data: { market: marketData }
  } = await subgraphClient.query<
    SubgraphGetActiveLendersByMarketQuery,
    SubgraphGetActiveLendersByMarketQueryVariables
  >({
    query: GetActiveLendersByMarketDocument,
    variables: {
      market: market.address.toLowerCase(),
      ...options
    },
    fetchPolicy
  });
  assert(marketData !== undefined && marketData !== null, `Market not found ${market.address}`);
  return marketData.lenders.map(
    ({ controllerAuthorization, hooksAccess, knownLenderStatus, scaledBalance, role, ...rest }) => {
      return new BasicLenderData({
        ...rest,
        market,
        scaledBalance: BigNumber.from(scaledBalance),
        credential: hooksAccess ? parseSubgraphLenderHooksAccess(hooksAccess) : undefined,
        isAuthorizedOnController: controllerAuthorization?.authorized,
        isKnownLender: !!knownLenderStatus?.id,
        role: parseSubgraphLenderStatus(role)
      });
    }
  );
}
