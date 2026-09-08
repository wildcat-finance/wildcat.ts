import { rejects } from "assert";
import { expect } from "chai";
import { providers } from "ethers";
import { decodeFunctionData, getAddress, type Address, type Hex } from "viem";
import { iERC20Abi, wildcatMarketV2Abi } from "../../src/abi";
import { LenderRole, MarketAccount } from "../../src/account";
import { SupportedChainId } from "../../src/constants";
import { Market } from "../../src/market";
import {
  PeriodicAprSettlementQuote,
  PeriodicAprSettlementStatus,
  populatePeriodicAprReductionPlan
} from "../../src/periodic-settlement";
import { Token } from "../../src/token";
import { HooksKind, MarketVersion } from "../../src/types";

const makeAddress = (suffix: number): Address =>
  `0x${suffix.toString(16).padStart(40, "0")}` as Address;

const provider = {
  send: async (method: string) => {
    throw new Error(`Unexpected RPC request: ${method}`);
  }
} as unknown as providers.Provider;

const makeToken = (overrides: Partial<Pick<Token, "chainId" | "address" | "decimals">> = {}) =>
  new Token(
    overrides.chainId ?? SupportedChainId.Sepolia,
    overrides.address ?? makeAddress(0xabcd),
    "Mock Token",
    "MOCK",
    overrides.decimals ?? 6,
    false,
    provider
  );

const makeFixture = (underlyingApproval = 0n) => {
  const token = makeToken();
  const market = Object.create(Market.prototype) as Market;
  Object.assign(market, {
    address: makeAddress(1),
    chainId: SupportedChainId.Sepolia,
    provider,
    version: MarketVersion.V2,
    underlyingToken: token,
    hooksConfig: {
      kind: HooksKind.PeriodicTerm,
      hooksAddress: makeAddress(2),
      flags: { useOnExecutePendingAnnualInterestBipsReduction: true }
    },
    update: async () => {
      throw new Error("Existing quotes must not refresh the market");
    }
  });
  const account = new MarketAccount({
    account: makeAddress(3),
    role: LenderRole.Null,
    market,
    scaledMarketBalance: 0n,
    marketBalance: token.getAmount(0n),
    underlyingBalance: token.getAmount(10_000_000n),
    underlyingApproval
  });
  const quote: PeriodicAprSettlementQuote = {
    status: PeriodicAprSettlementStatus.NeedsSettlement,
    amountToSettle: token.getAmount(1_000_000n),
    suggestedApprovalAmount: token.getAmount(2_000_000n),
    needsRepayment: true,
    needsBatchProcessing: true,
    unpaidBatchCount: 1,
    maxBatches: 10,
    remainingBatchesAfterThisPass: 0,
    settlementIsPermissionless: false,
    isWithdrawalWindowOpen: false,
    responseWindowEnd: 1_000,
    proposedAprBips: 900
  };
  return { account, market, token, quote };
};

describe("periodic APR settlement plans", () => {
  for (const field of ["amountToSettle", "suggestedApprovalAmount"] as const) {
    for (const [dimension, overrides] of [
      ["chain", { chainId: 1 }],
      ["address", { address: makeAddress(4) }],
      ["decimals", { decimals: 18 }]
    ] as const) {
      it(`rejects ${field} with a different token ${dimension} before preparing transactions`, async () => {
        const { account, market, quote } = makeFixture();
        quote[field] = makeToken(overrides).getAmount(quote[field].raw);
        account.isApprovedFor = () => {
          throw new Error("Asset validation must precede allowance checks");
        };
        market.populateRepayAndProcessUnpaidWithdrawalBatches = () => {
          throw new Error("Asset validation must precede settlement encoding");
        };

        await rejects(populatePeriodicAprReductionPlan(account, 900, quote), {
          message: `Settlement quote ${field} token ${dimension} mismatch`
        });
      });
    }
  }

  it("checks the approval asset even when the account already has enough allowance", async () => {
    const { account, quote } = makeFixture(10_000_000n);
    quote.suggestedApprovalAmount = makeToken({ address: makeAddress(4) }).getAmount(2_000_000n);

    await rejects(populatePeriodicAprReductionPlan(account, 900, quote), {
      message: "Settlement quote suggestedApprovalAmount token address mismatch"
    });
  });

  it("checks the asset on a zero-amount Ready quote", async () => {
    const { account, token, quote } = makeFixture();
    quote.status = PeriodicAprSettlementStatus.Ready;
    quote.amountToSettle = token.getAmount(0n);
    quote.suggestedApprovalAmount = makeToken({ decimals: 18 }).getAmount(0n);

    await rejects(populatePeriodicAprReductionPlan(account, 900, quote), {
      message: "Settlement quote suggestedApprovalAmount token decimals mismatch"
    });
  });

  it("preserves an older quote's exact amounts and accepts equivalent token objects without reads", async () => {
    const { account, market, token, quote } = makeFixture();
    const checksumAddress = getAddress(token.address);
    expect(checksumAddress).not.to.equal(token.address);
    quote.amountToSettle = makeToken({ address: checksumAddress }).getAmount(1_234_567n);
    quote.suggestedApprovalAmount = makeToken({ address: checksumAddress }).getAmount(2_345_678n);
    Object.freeze(quote);

    const plan = await populatePeriodicAprReductionPlan(account, 900, quote);

    expect(plan.quote).to.equal(quote);
    expect(plan.transactions.map(({ kind }) => kind)).to.deep.equal([
      "approve",
      "settle",
      "executeApr"
    ]);
    expect(plan.transactions[0].tx.to).to.equal(token.address);
    expect(
      decodeFunctionData({ abi: iERC20Abi, data: plan.transactions[0].tx.data as Hex })
    ).to.deep.equal({ functionName: "approve", args: [market.address, 2_345_678n] });
    expect(plan.transactions[1].tx.to).to.equal(market.address);
    expect(
      decodeFunctionData({ abi: wildcatMarketV2Abi, data: plan.transactions[1].tx.data as Hex })
    ).to.deep.equal({
      functionName: "repayAndProcessUnpaidWithdrawalBatches",
      args: [1_234_567n, 10n]
    });
    expect(plan.transactions[2].tx.to).to.equal(market.address);
    expect(plan.safeBatchable).to.equal(true);
  });

  for (const repayment of [0n, 1_000_000n]) {
    it(`describes the encoded ${repayment} repayment even when needsRepayment disagrees`, async () => {
      const { account, token, quote } = makeFixture(10_000_000n);
      quote.amountToSettle = token.getAmount(repayment);
      quote.needsRepayment = repayment === 0n;

      const plan = await populatePeriodicAprReductionPlan(account, 900, quote);

      expect(plan.transactions.map(({ kind }) => kind)).to.deep.equal(["settle", "executeApr"]);
      expect(
        decodeFunctionData({ abi: wildcatMarketV2Abi, data: plan.transactions[0].tx.data as Hex })
      ).to.deep.equal({
        functionName: "repayAndProcessUnpaidWithdrawalBatches",
        args: [repayment, 10n]
      });
      expect(plan.transactions[0].description).to.equal(
        repayment > 0n
          ? "Repay 1 MOCK and process up to 10 unpaid withdrawal batch(es)"
          : "Process up to 10 unpaid withdrawal batch(es) (no repayment required; any wallet may send this)"
      );
      expect(plan.quote).to.equal(quote);
      expect(quote.needsRepayment).to.equal(repayment === 0n);
    });
  }
});
