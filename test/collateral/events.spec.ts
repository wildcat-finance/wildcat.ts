import { expect } from "chai";
import { providers } from "ethers";
import { collateralContractEventParsers } from "../../src/collateral";
import { SupportedChainId } from "../../src/config";
import {
  SubgraphSimpleCollateralContractDepositDataFragment,
  SubgraphSimpleCollateralContractLiquidatedSharesResetDataFragment,
  SubgraphSimpleCollateralContractReclaimDataFragment
} from "../../src/gql/graphql";
import { Token } from "../../src/token";

const makeAddress = (suffix: number): string => `0x${suffix.toString(16).padStart(40, "0")}`;

const collateralContract = {
  __typename: "SimpleCollateralContract" as const,
  id: makeAddress(1)
};
const lender = makeAddress(2);
const account = {
  __typename: "SimpleCollateralContractDepositor" as const,
  id: `${collateralContract.id}-${lender}`,
  address: lender
};
const eventFields = {
  blockNumber: 1,
  blockTimestamp: 2,
  transactionHash: makeAddress(3)
};
const token = new Token(
  SupportedChainId.Sepolia,
  makeAddress(4),
  "Test Token",
  "TEST",
  18,
  false,
  new providers.JsonRpcProvider()
);

describe("collateral subgraph event parsing", () => {
  it("returns explicit depositor addresses instead of composite entity IDs", () => {
    const deposit: SubgraphSimpleCollateralContractDepositDataFragment = {
      __typename: "SimpleCollateralContractDeposit",
      id: "deposit",
      collateralContract,
      account,
      amountDeposited: "10",
      sharesMinted: "10",
      lastFullLiquidationIndex: 0,
      depositIndex: 1,
      ...eventFields
    };
    const reclaim: SubgraphSimpleCollateralContractReclaimDataFragment = {
      __typename: "SimpleCollateralContractReclaim",
      id: "reclaim",
      collateralContract,
      account,
      amountReclaimed: "5",
      sharesBurned: "5",
      ...eventFields
    };
    const reset: SubgraphSimpleCollateralContractLiquidatedSharesResetDataFragment = {
      __typename: "SimpleCollateralContractLiquidatedSharesReset",
      id: "reset",
      collateralContract,
      account,
      sharesReset: "4",
      eventIndex: 3,
      ...eventFields
    };

    expect(
      collateralContractEventParsers.SimpleCollateralContractDeposit(token, token, deposit).account
    ).to.equal(lender);
    expect(
      collateralContractEventParsers.SimpleCollateralContractReclaim(token, token, reclaim).account
    ).to.equal(lender);
    expect(
      collateralContractEventParsers.SimpleCollateralContractLiquidatedSharesReset(
        token,
        token,
        reset
      ).account
    ).to.equal(lender);
  });
});
