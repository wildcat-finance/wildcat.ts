import { rejects } from "assert";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { decodeFunctionData, encodeFunctionResult, type Hex } from "viem";
import {
  iERC20Abi,
  wildcat4626WrapperAbi,
  wildcatMarketV2Abi,
  simpleMarketCollateralAbi
} from "../../src/abi";
import { QueueWithdrawalStatus, SetMaxTotalSupplyStatus } from "../../src/account";
import { MarketCollateralV1 } from "../../src/collateral";
import { SupportedChainId } from "../../src/constants";
import { Token } from "../../src/token";
import { HooksKind, MarketVersion, PartialTransaction, SignerOrProvider } from "../../src/types";
import { TokenWrapper } from "../../src/wrapper";
import { makeAddress, makeMarket, makeMarketAccount } from "../helpers/review-fixtures";

const makeFixture = () => {
  let addressReads = 0;
  let rpcReads = 0;
  const sent: PartialTransaction[] = [];
  const provider = {
    send: async (method: string, params: unknown[]) => {
      rpcReads++;
      if (method === "eth_chainId") return "0xaa36a7";
      if (method !== "eth_call") throw Error(`Unexpected RPC method: ${method}`);
      const { data } = params[0] as { data: Hex };
      const { functionName, args } = decodeFunctionData({ abi: wildcat4626WrapperAbi, data });
      // Controlled wrapper rate: two normalized asset units per share.
      const input = args?.[0] as bigint;
      const assetsInput = ["convertToShares", "previewDeposit", "previewWithdraw"].includes(
        functionName
      );
      return encodeFunctionResult({
        abi: wildcat4626WrapperAbi,
        functionName,
        result: assetsInput ? input / 2n : input * 2n
      });
    }
  } as unknown as SignerOrProvider;
  const market = makeMarket({ chainId: SupportedChainId.Sepolia, provider }, 6);
  market.totalSupply = market.marketToken.getAmount(market.totalSupply.raw);
  market.maxTotalSupply = market.marketToken.getAmount(market.maxTotalSupply.raw);
  const signer = {
    getAddress: async () => {
      addressReads++;
      return market.borrower;
    },
    sendTransaction: async (transaction: PartialTransaction) => {
      sent.push(transaction);
      return { hash: `0x${"1".repeat(64)}` };
    }
  };
  Object.defineProperty(market, "signer", { value: signer });
  Object.defineProperty(market.underlyingToken, "signer", { value: signer });
  if (market.hooksConfig?.kind === HooksKind.OpenTerm) {
    market.hooksConfig.allowForceBuyBacks = true;
  }
  const account = makeMarketAccount(market, {
    underlyingBalance: market.underlyingToken.getAmount(1_000_000_000n),
    underlyingApproval: 1_000_000_000n
  });
  const shareToken = new Token(
    market.chainId,
    makeAddress(30),
    "Wrapper",
    "WRAP",
    6,
    false,
    provider
  );
  const wrapper = new TokenWrapper({
    chainId: market.chainId,
    provider,
    address: shareToken.address,
    marketAddress: market.address,
    marketToken: market.marketToken,
    shareToken
  });
  const collateral = new MarketCollateralV1({
    provider,
    address: makeAddress(31),
    market,
    underlyingAsset: market.underlyingToken,
    collateralAsset: shareToken,
    liquidationCooldown: 0,
    maxRepaymentBips: 5_000,
    fullLiquidationIndex: 0,
    totalShares: 0n,
    availableCollateral: shareToken.getAmount(0),
    nextLiquidationTrigger: 0
  });
  return { market, account, wrapper, collateral, sent, calls: () => ({ addressReads, rpcReads }) };
};

const mismatchedAmount = (expected: Token, dimension: "chain" | "address" | "decimals") =>
  new Token(
    dimension === "chain" ? SupportedChainId.Mainnet : expected.chainId,
    dimension === "address" ? makeAddress(99) : expected.address,
    expected.name,
    expected.symbol,
    dimension === "decimals" ? 18 : expected.decimals,
    false,
    expected.provider
  ).getAmount(1_000_000n);

describe("transaction amount identity", () => {
  for (const dimension of ["chain", "address", "decimals"] as const) {
    it(`rejects a different ${dimension} at market amount boundaries before signer or RPC access`, async () => {
      const { market, account, calls, sent } = makeFixture();
      const amount = mismatchedAmount(market.underlyingToken, dimension);
      const operations: Array<() => unknown> = [
        () => account.isApprovedFor(amount),
        () => account.populateApproveMarket(amount),
        () => account.approveMarket(amount),
        () => account.getDepositAmount(amount),
        () => account.previewDeposit(amount),
        () => account.populateDeposit(amount),
        () => account.deposit(amount),
        () => account.getRepayAmount(amount),
        () => account.previewRepay(amount),
        () => account.populateRepay(amount),
        () => account.repay(amount),
        () => account.getBorrowableAmount(amount),
        () => account.borrow(amount),
        () => account.previewSetMinimumDeposit(amount),
        () => account.populateSetMinimumDeposit(amount),
        () => account.previewSetMaxTotalSupply(amount),
        () => account.setMaxTotalSupply(amount),
        () => account.previewForceBuyBack(makeAddress(40), amount),
        () => account.populateForceBuyBack(makeAddress(40), amount),
        () => account.previewQueueWithdrawal(amount),
        () => account.populateQueueWithdrawal(amount),
        () => market.populateRepayAndProcessUnpaidWithdrawalBatches(amount),
        () => market.getSecondsBeforeDelinquencyForBorrowedAmount(amount)
      ];
      for (const operation of operations) {
        await rejects(async () => operation(), new RegExp(`token ${dimension} mismatch`));
      }
      expect(calls()).to.deep.equal({ addressReads: 0, rpcReads: 0 });
      expect(sent).to.deep.equal([]);
    });

    it(`checks ${dimension} against wrapper assets, wrapper shares, and collateral separately`, async () => {
      const { wrapper, collateral, calls } = makeFixture();
      const assets = mismatchedAmount(wrapper.marketToken, dimension);
      const shares = mismatchedAmount(wrapper.shareToken, dimension);
      const receiver = makeAddress(40);
      const operations: Array<() => unknown> = [
        () => wrapper.convertToShares(assets),
        () => wrapper.convertToAssets(shares),
        () => wrapper.previewDeposit(assets),
        () => wrapper.previewMint(shares),
        () => wrapper.previewWithdraw(assets),
        () => wrapper.previewRedeem(shares),
        () => wrapper.populateDeposit(assets, receiver),
        () => wrapper.populateMint(shares, receiver),
        () => wrapper.populateWithdraw(assets, receiver, receiver),
        () => wrapper.populateRedeem(shares, receiver, receiver),
        () => wrapper.populateRedeemAndQueueWithdrawalScaledBatch(shares, receiver),
        () => collateral.populateDeposit(shares)
      ];
      for (const operation of operations) {
        await rejects(async () => operation(), new RegExp(`token ${dimension} mismatch`));
      }
      expect(calls()).to.deep.equal({ addressReads: 0, rpcReads: 0 });
    });
  }

  it("preserves the exact approval, deposit, repayment, borrow, and collateral quantities", async () => {
    const { market, account, collateral, sent, calls } = makeFixture();
    const amount = market.underlyingToken.getAmount(1_234_567n);
    const approval = await account.populateApproveMarket(amount);
    expect(approval.to).to.equal(market.underlyingToken.address);
    expect(decodeFunctionData({ abi: iERC20Abi, data: approval.data as Hex }).args).to.deep.equal([
      market.address,
      amount.raw
    ]);
    for (const transaction of [
      await account.populateDeposit(amount),
      await account.populateRepay(amount),
      market.populateRepayAndProcessUnpaidWithdrawalBatches(amount)
    ]) {
      expect(transaction.to).to.equal(market.address);
      expect(
        decodeFunctionData({ abi: wildcatMarketV2Abi, data: transaction.data as Hex }).args?.[0]
      ).to.equal(amount.raw);
    }
    await account.borrow(amount);
    expect(
      decodeFunctionData({ abi: wildcatMarketV2Abi, data: sent[0].data as Hex })
    ).to.deep.equal({ functionName: "borrow", args: [amount.raw] });
    const deposit = collateral.populateDeposit(collateral.collateralAsset.getAmount(2_000n));
    expect(
      decodeFunctionData({ abi: simpleMarketCollateralAbi, data: deposit.data as Hex }).args
    ).to.deep.equal([2_000n]);
    expect(calls().rpcReads).to.equal(0);
  });

  it("retains bigint, integer string, and ethers BigNumber repayment inputs", async () => {
    const { account } = makeFixture();
    const raw = (1n << 80n) + 123n;
    for (const amount of [raw, raw.toString(), BigNumber.from(raw.toString())]) {
      const tx = await account.populateRepay(amount);
      expect(decodeFunctionData({ abi: wildcatMarketV2Abi, data: tx.data as Hex })).to.deep.equal({
        functionName: "repay",
        args: [raw]
      });
    }
  });

  it("accepts only the market's own normalized receipt/underlying pair for withdrawals and supply", async () => {
    const { account, market, wrapper } = makeFixture();
    market.version = MarketVersion.V1;
    const raw = market.totalSupply.raw + 1n;
    for (const token of [market.underlyingToken, market.marketToken]) {
      expect(account.previewSetMaxTotalSupply(token.getAmount(raw)).status).to.equal(
        SetMaxTotalSupplyStatus.Ready
      );
      const amount = token.getAmount(100n);
      expect(account.previewQueueWithdrawal(amount).status).to.equal(QueueWithdrawalStatus.Ready);
      const tx = await account.populateQueueWithdrawal(amount);
      expect(
        decodeFunctionData({ abi: wildcatMarketV2Abi, data: tx.data as Hex }).args
      ).to.deep.equal([100n]);
    }
    expect(() => account.previewQueueWithdrawal(wrapper.shareToken.getAmount(100n))).to.throw(
      /token address mismatch/
    );
    expect(() => account.previewSetMaxTotalSupply(wrapper.shareToken.getAmount(raw))).to.throw(
      /token address mismatch/
    );
    // Receipt amounts cannot be used for approval or repayment of the underlying asset.
    await rejects(
      account.populateApproveMarket(market.marketToken.getAmount(100n)),
      /token address mismatch/
    );
    await rejects(
      account.populateRepay(market.marketToken.getAmount(100n)),
      /token address mismatch/
    );
  });

  it("retains wrapper rate conversions and the exact scaled-share batch", async () => {
    const { wrapper, market } = makeFixture();
    const assets = market.marketToken.getAmount(200n);
    const shares = wrapper.shareToken.getAmount(100n);
    const receiver = makeAddress(40);
    for (const result of [
      await wrapper.convertToShares(assets),
      await wrapper.previewDeposit(assets),
      await wrapper.previewWithdraw(assets)
    ]) {
      expect(result.raw).to.equal(shares.raw);
      expect(result.token).to.equal(wrapper.shareToken);
    }
    for (const result of [
      await wrapper.convertToAssets(shares),
      await wrapper.previewMint(shares),
      await wrapper.previewRedeem(shares)
    ]) {
      expect(result.raw).to.equal(assets.raw);
      expect(result.token).to.equal(market.marketToken);
    }
    for (const [transaction, raw] of [
      [wrapper.populateDeposit(assets, receiver), assets.raw],
      [wrapper.populateMint(shares, receiver), shares.raw],
      [wrapper.populateWithdraw(assets, receiver, receiver), assets.raw],
      [wrapper.populateRedeem(shares, receiver, receiver), shares.raw]
    ] as const) {
      expect(
        decodeFunctionData({ abi: wildcat4626WrapperAbi, data: transaction.data as Hex }).args?.[0]
      ).to.equal(raw);
    }
    const batch = wrapper.populateRedeemAndQueueWithdrawalScaledBatch(shares, receiver);
    expect(
      decodeFunctionData({ abi: wildcatMarketV2Abi, data: batch[1].data as Hex })
    ).to.deep.equal({ functionName: "queueWithdrawalScaled", args: [shares.raw] });
    expect(() => wrapper.populateDeposit(shares, receiver)).to.throw(/token address mismatch/);
    expect(() => wrapper.populateRedeem(assets, receiver, receiver)).to.throw(
      /token address mismatch/
    );
  });

  it("keeps normalized debt and capacity calculations working across distinct receipt and asset tokens", () => {
    const { market } = makeFixture();
    expect(market.maximumDeposit.token).to.equal(market.underlyingToken);
    expect(market.maximumDeposit.raw).to.equal(market.maxTotalSupply.raw - market.totalSupply.raw);
    expect(market.outstandingTotalSupply.token).to.equal(market.marketToken);
    expect(market.getTotalDebtBreakdown().status).to.equal("healthy");
    market.totalAssets = market.underlyingToken.getAmount(0n);
    expect(market.getTotalDebtBreakdown().status).to.equal("delinquent");
  });
});
