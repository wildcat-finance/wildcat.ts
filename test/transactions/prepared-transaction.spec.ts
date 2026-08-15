import { expect } from "chai";
import { providers } from "ethers";
import { decodeFunctionData, encodeFunctionData, type Address } from "viem";
import {
  iERC20Abi,
  iOpenTermHooksAbi,
  wildcat4626WrapperAbi,
  wildcat4626WrapperFactoryAbi,
  wildcatMarketControllerAbi,
  wildcatMarketV2Abi
} from "../../src/abi";
import { getDeploymentAddress, SupportedChainId } from "../../src/constants";
import { MarketController } from "../../src/controller";
import { OpenTermHooks, OpenTermHooksTemplate } from "../../src/access";
import { TokenWrapper, WrapperFactory } from "../../src/wrapper";
import { prepareTransaction, toSafeTransactionInput } from "../../src/utils";
import { submitPreparedTransaction } from "../../src/internal/viem-write";
import {
  FeeConfiguration,
  HooksKind,
  MarketParameterConstraints,
  MarketVersion
} from "../../src/types";
import {
  ForceBuyBackStatus,
  LenderRole,
  MarketAccount,
  SetMinimumDepositStatus
} from "../../src/account";
import { Token } from "../../src/token";
import {
  PeriodicAprSettlementStatus,
  populatePeriodicAprReductionPlan
} from "../../src/periodic-settlement";

const provider = new providers.JsonRpcProvider();

const makeAddress = (suffix: number): Address => {
  return `0x${suffix.toString(16).padStart(40, "0")}` as Address;
};

const constraints: MarketParameterConstraints = {
  minimumDelinquencyGracePeriod: 0,
  maximumDelinquencyGracePeriod: 90 * 86_400,
  minimumReserveRatioBips: 0,
  maximumReserveRatioBips: 10_000,
  minimumDelinquencyFeeBips: 0,
  maximumDelinquencyFeeBips: 10_000,
  minimumWithdrawalBatchDuration: 0,
  maximumWithdrawalBatchDuration: 365 * 86_400,
  minimumAnnualInterestBips: 0,
  maximumAnnualInterestBips: 10_000
};

const fees: FeeConfiguration = {
  feeRecipient: makeAddress(20),
  protocolFeeBips: 25,
  originationFeeToken: undefined,
  originationFeeAmount: undefined
};

const makeHooksFlagsBase = () => ({
  useOnDeposit: false,
  useOnQueueWithdrawal: false,
  useOnExecuteWithdrawal: false,
  useOnTransfer: false,
  useOnBorrow: false,
  useOnRepay: false,
  useOnCloseMarket: false,
  useOnNukeFromOrbit: false,
  useOnSetMaxTotalSupply: false,
  useOnSetAnnualInterestAndReserveRatioBips: false,
  useOnSetProtocolFeeBips: false,
  useOnExecutePendingAnnualInterestBipsReduction: false
});

const makeHooksFlags = (overrides: Partial<ReturnType<typeof makeHooksFlagsBase>> = {}) => ({
  ...makeHooksFlagsBase(),
  ...overrides
});

describe("prepared transaction encoding", () => {
  it("encodes calldata with viem and converts explicitly to Safe payloads", () => {
    const token = makeAddress(1);
    const spender = makeAddress(2);
    const tx = prepareTransaction({
      to: token,
      abi: iERC20Abi,
      functionName: "approve",
      args: [spender, 123n]
    });

    expect(tx.to).to.equal(token);
    expect(tx.data).to.equal(
      encodeFunctionData({ abi: iERC20Abi, functionName: "approve", args: [spender, 123n] })
    );
    expect(tx.value).to.equal("0");
    expect(toSafeTransactionInput(tx)).to.deep.equal({
      to: token,
      data: tx.data,
      value: "0"
    });
  });

  it("supports overloaded hooks functions without ethers interfaces", () => {
    const hooks = makeAddress(3);
    const lender = makeAddress(4);
    const lenders = [makeAddress(5), makeAddress(6)];

    const single = prepareTransaction({
      to: hooks,
      abi: iOpenTermHooksAbi,
      functionName: "blockFromDeposits",
      args: [lender]
    });
    const batch = prepareTransaction({
      to: hooks,
      abi: iOpenTermHooksAbi,
      functionName: "blockFromDeposits",
      args: [lenders]
    });

    expect(single.data).to.equal(
      encodeFunctionData({
        abi: iOpenTermHooksAbi,
        functionName: "blockFromDeposits",
        args: [lender]
      })
    );
    expect(batch.data).to.equal(
      encodeFunctionData({
        abi: iOpenTermHooksAbi,
        functionName: "blockFromDeposits",
        args: [lenders]
      })
    );
  });

  it("uses viem encoding through controller populate helpers", () => {
    const controller = new MarketController(
      SupportedChainId.Sepolia,
      makeAddress(7),
      makeAddress(8),
      makeAddress(9),
      true,
      true,
      fees,
      constraints,
      [],
      provider
    );
    const lenders = [makeAddress(10), makeAddress(11)];
    const tx = controller.populateAuthorizeLenders(lenders);

    expect(tx).to.deep.equal({
      to: controller.address,
      data: encodeFunctionData({
        abi: wildcatMarketControllerAbi,
        functionName: "authorizeLenders",
        args: [lenders]
      }),
      value: "0"
    });
  });

  it("uses viem encoding through hooks and wrapper populate helpers", () => {
    const hooksTemplate = new OpenTermHooksTemplate(SupportedChainId.Sepolia, provider, {
      hooksFactory: getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactoryStandard"),
      hooksTemplate: makeAddress(12),
      fees: {
        feeRecipient: makeAddress(13),
        protocolFeeBips: 25
      },
      enabled: true,
      index: 0,
      name: "OpenTermHooks",
      totalMarkets: 0
    });
    const hooks = new OpenTermHooks({
      chainId: SupportedChainId.Sepolia,
      provider,
      address: makeAddress(14),
      hooksTemplate,
      borrower: makeAddress(15),
      administrator: makeAddress(15),
      name: "OpenTermHooksInstance"
    });
    const wrapperFactory = new WrapperFactory(SupportedChainId.Sepolia, makeAddress(16), provider);
    const market = makeAddress(17);
    const wrapperAddress = makeAddress(19);
    const marketToken = new Token(
      SupportedChainId.Sepolia,
      market,
      "Mock Market",
      "mMOCK",
      18,
      false,
      provider
    );
    const wrapper = new TokenWrapper({
      chainId: SupportedChainId.Sepolia,
      provider,
      address: wrapperAddress,
      marketAddress: market,
      marketToken,
      shareToken: new Token(
        SupportedChainId.Sepolia,
        wrapperAddress,
        "Wrapped Mock Market",
        "wmMOCK",
        18,
        false,
        provider
      )
    });

    expect(hooks.populateUnblockLender(makeAddress(18)).data).to.equal(
      encodeFunctionData({
        abi: iOpenTermHooksAbi,
        functionName: "unblockFromDeposits",
        args: [makeAddress(18)]
      })
    );
    expect(wrapperFactory.populateCreateWrapper(market).data).to.equal(
      encodeFunctionData({
        abi: wildcat4626WrapperFactoryAbi,
        functionName: "createWrapper",
        args: [market]
      })
    );
    expect(
      prepareTransaction({
        to: wrapperFactory.address,
        abi: wildcat4626WrapperFactoryAbi,
        functionName: "createWrapper",
        args: [market]
      }).data
    ).to.equal(wrapperFactory.populateCreateWrapper(market).data);
    expect(wrapper.populateNukeFromOrbit(makeAddress(20)).data).to.equal(
      encodeFunctionData({
        abi: wildcat4626WrapperAbi,
        functionName: "nukeFromOrbit",
        args: [makeAddress(20)]
      })
    );

    const account = makeAddress(21);
    const shares = wrapper.shareToken.getAmount(123n);
    const [redeem, queue] = wrapper.populateRedeemAndQueueWithdrawalScaledBatch(shares, account);
    expect([redeem.to, queue.to]).to.deep.equal([wrapper.address, market]);
    expect(
      decodeFunctionData({
        abi: wildcat4626WrapperAbi,
        data: redeem.data as `0x${string}`
      })
    ).to.deep.equal({
      functionName: "redeem",
      args: [123n, account, account]
    });
    expect(
      decodeFunctionData({
        abi: wildcatMarketV2Abi,
        data: queue.data as `0x${string}`
      })
    ).to.deep.equal({
      functionName: "queueWithdrawalScaled",
      args: [123n]
    });
  });

  it("uses viem encoding through token approval helpers", () => {
    const token = new Token(
      SupportedChainId.Sepolia,
      makeAddress(19),
      "Mock Token",
      "MOCK",
      18,
      false,
      provider
    );
    const spender = makeAddress(20);
    const tx = token.populateApprove(spender, token.getAmount(123n));

    expect(tx).to.deep.equal({
      to: token.address,
      data: encodeFunctionData({ abi: iERC20Abi, functionName: "approve", args: [spender, 123n] }),
      value: "0"
    });
  });

  it("submits prepared transactions as hashes without leaking ethers transaction objects", async () => {
    const expectedHash = `0x${"1".padStart(64, "0")}`;
    const tx = prepareTransaction({
      to: makeAddress(19),
      abi: iERC20Abi,
      functionName: "approve",
      args: [makeAddress(20), 123n],
      value: 456n
    });
    let sentTransaction: any;
    const signer = {
      sendTransaction: async (transaction: any) => {
        sentTransaction = transaction;
        return { hash: expectedHash };
      }
    } as any;

    const hash = await submitPreparedTransaction(signer, tx);

    expect(String(hash)).to.equal(expectedHash);
    expect(hash.hash).to.equal(expectedHash);
    expect(sentTransaction).to.deep.equal({
      to: tx.to,
      data: tx.data,
      value: "456"
    });
  });

  it("targets borrower hook config writes to the hooks instance address", async () => {
    const borrower = makeAddress(21);
    const marketAddress = makeAddress(22);
    const hooksAddress = makeAddress(23);
    const token = new Token(
      SupportedChainId.Sepolia,
      makeAddress(24),
      "Mock Token",
      "MOCK",
      18,
      false,
      provider
    );
    const account = new MarketAccount({
      account: borrower,
      role: LenderRole.Null,
      market: {
        address: marketAddress,
        borrower,
        version: MarketVersion.V2,
        hooksConfig: {
          kind: HooksKind.OpenTerm,
          hooksAddress,
          flags: makeHooksFlags({ useOnDeposit: true })
        }
      },
      scaledMarketBalance: 0n,
      marketBalance: token.getAmount(0n),
      underlyingBalance: token.getAmount(0n),
      underlyingApproval: token.getAmount(0n)
    } as any);

    const tx = await account.populateSetMinimumDeposit(token.getAmount(1n));

    expect(tx.to).to.equal(hooksAddress);
    expect(tx.data).to.equal(
      encodeFunctionData({
        abi: iOpenTermHooksAbi,
        functionName: "setMinimumDeposit",
        args: [marketAddress, 1n]
      })
    );
  });

  it("prevents positive minimum deposits when the deposit hook is disabled", () => {
    const borrower = makeAddress(34);
    const token = new Token(
      SupportedChainId.Sepolia,
      makeAddress(35),
      "Mock Token",
      "MOCK",
      18,
      false,
      provider
    );
    const account = new MarketAccount({
      account: borrower,
      role: LenderRole.Null,
      market: {
        address: makeAddress(36),
        borrower,
        version: MarketVersion.V2,
        hooksConfig: {
          kind: HooksKind.OpenTerm,
          hooksAddress: makeAddress(37),
          flags: makeHooksFlags()
        }
      },
      scaledMarketBalance: 0n,
      marketBalance: token.getAmount(0n),
      underlyingBalance: token.getAmount(0n),
      underlyingApproval: token.getAmount(0n)
    } as any);

    expect(account.previewSetMinimumDeposit(token.getAmount(1n)).status).to.equal(
      SetMinimumDepositStatus.DepositHookNotEnabled
    );
  });

  it("prevents force-buyback transaction population for unsupported hooks", () => {
    const borrower = makeAddress(25);
    const marketAddress = makeAddress(26);
    const token = new Token(
      SupportedChainId.Sepolia,
      makeAddress(27),
      "Mock Token",
      "MOCK",
      18,
      false,
      provider
    );
    const account = new MarketAccount({
      account: borrower,
      role: LenderRole.Null,
      market: {
        address: marketAddress,
        borrower,
        chainId: SupportedChainId.Sepolia,
        version: MarketVersion.V2,
        hooksConfig: {
          kind: HooksKind.OpenTerm,
          hooksAddress: makeAddress(28),
          allowForceBuyBacks: false
        }
      },
      scaledMarketBalance: 0n,
      marketBalance: token.getAmount(0n),
      underlyingBalance: token.getAmount(10n),
      underlyingApproval: token.getAmount(0n)
    } as any);

    expect(account.previewForceBuyBack(makeAddress(29), token.getAmount(1n)).status).to.equal(
      ForceBuyBackStatus.HooksNotSupported
    );
    expect(() => account.populateForceBuyBack(makeAddress(29), token.getAmount(1n))).to.throw(
      "Cannot force buy back: HooksNotSupported"
    );
  });

  it("plans permissionless periodic APR reduction execution on the market", async () => {
    const lender = makeAddress(30);
    const borrower = makeAddress(31);
    const marketAddress = makeAddress(32);
    const token = new Token(
      SupportedChainId.Sepolia,
      makeAddress(33),
      "Mock Token",
      "MOCK",
      18,
      false,
      provider
    );
    const account = new MarketAccount({
      account: lender,
      role: LenderRole.Null,
      market: {
        address: marketAddress,
        borrower,
        chainId: SupportedChainId.Sepolia,
        version: MarketVersion.V2,
        underlyingToken: token,
        hooksConfig: {
          kind: HooksKind.PeriodicTerm,
          hooksAddress: makeAddress(34),
          flags: makeHooksFlags({
            useOnExecutePendingAnnualInterestBipsReduction: true
          })
        }
      },
      scaledMarketBalance: 0n,
      marketBalance: token.getAmount(0n),
      underlyingBalance: token.getAmount(0n),
      underlyingApproval: token.getAmount(0n)
    } as any);
    const zero = token.getAmount(0n);

    const readyQuote = {
      status: PeriodicAprSettlementStatus.Ready,
      amountToSettle: zero,
      suggestedApprovalAmount: zero,
      needsRepayment: false,
      needsBatchProcessing: false,
      unpaidBatchCount: 0,
      maxBatches: 0,
      remainingBatchesAfterThisPass: 0,
      settlementIsPermissionless: true,
      isWithdrawalWindowOpen: false,
      responseWindowEnd: 1_000,
      proposedAprBips: 900
    };

    const plan = await populatePeriodicAprReductionPlan(account, 900, readyQuote);

    expect(plan.safeBatchable).to.equal(true);
    expect(plan.transactions).to.have.length(1);
    expect(plan.transactions[0]).to.deep.equal({
      tx: {
        to: marketAddress,
        data: encodeFunctionData({
          abi: wildcatMarketV2Abi,
          functionName: "executePendingAnnualInterestBipsReduction"
        }),
        value: "0"
      },
      kind: "executeApr",
      requiresBorrower: false,
      description: "Execute the proposed APR reduction to 9%"
    });

    const staleTargetPlan = await populatePeriodicAprReductionPlan(account, 800, readyQuote);

    expect(staleTargetPlan.quote.status).to.equal(PeriodicAprSettlementStatus.ProposalDoesNotMatch);
    expect(staleTargetPlan.safeBatchable).to.equal(false);
    expect(staleTargetPlan.transactions).to.deep.equal([]);

    account.market.hooksConfig!.flags.useOnExecutePendingAnnualInterestBipsReduction = false;
    const disabledPlan = await populatePeriodicAprReductionPlan(account, 900, readyQuote);

    expect(disabledPlan.quote.status).to.equal(PeriodicAprSettlementStatus.ExecutionNotEnabled);
    expect(disabledPlan.safeBatchable).to.equal(false);
    expect(disabledPlan.transactions).to.deep.equal([]);
  });
});
