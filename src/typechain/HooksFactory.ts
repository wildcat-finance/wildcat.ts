import type { Result } from "@ethersproject/abi";
export type MarketDeployedEvent = {
  args: Result & {
    hooksTemplate: string;
    market: string;
    name: string;
    symbol: string;
    asset: string;
    maxTotalSupply: unknown;
    annualInterestBips: unknown;
    delinquencyFeeBips: unknown;
    withdrawalBatchDuration: unknown;
    reserveRatioBips: unknown;
    delinquencyGracePeriod: unknown;
    hooks: unknown;
  };
};
