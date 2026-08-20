import type { Result } from "@ethersproject/abi";
export type MarketDeployedEvent = {
  args: Result & {
    hooksTemplate: string;
    hooksInstance: string;
    market: string;
    borrower: string;
    borrowerPrincipal: string;
    borrowerIdentityRegistry: string;
    name: string;
    symbol: string;
    asset: string;
    requestedHooks: unknown;
    hooks: unknown;
  };
};
