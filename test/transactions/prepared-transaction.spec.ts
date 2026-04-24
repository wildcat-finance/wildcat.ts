import { expect } from "chai";
import { providers } from "ethers";
import { iERC20Abi, iOpenTermHooksAbi, wildcat4626WrapperFactoryAbi } from "../../src/abi";
import { getDeploymentAddress, SupportedChainId } from "../../src/constants";
import { MarketController } from "../../src/controller";
import { OpenTermHooks, OpenTermHooksTemplate } from "../../src/access";
import { WrapperFactory } from "../../src/wrapper";
import { prepareTransaction, toSafeTransactionInput } from "../../src/utils";
import { submitPreparedTransaction } from "../../src/internal/viem-write";
import {
  IERC20__factory,
  IOpenTermHooks__factory,
  Wildcat4626WrapperFactory__factory,
  WildcatMarketController__factory
} from "../../src/typechain";
import {
  FeeConfiguration,
  HooksKind,
  MarketParameterConstraints,
  MarketVersion
} from "../../src/types";
import { LenderRole, MarketAccount } from "../../src/account";
import { Token } from "../../src/token";

const provider = new providers.JsonRpcProvider();

const makeAddress = (suffix: number): string => {
  return `0x${suffix.toString(16).padStart(40, "0")}`;
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
      IERC20__factory.createInterface().encodeFunctionData("approve", [spender, 123])
    );
    expect(tx.value).to.equal(0n);
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

    const iface = IOpenTermHooks__factory.createInterface();
    expect(single.data).to.equal(iface.encodeFunctionData("blockFromDeposits(address)", [lender]));
    expect(batch.data).to.equal(
      iface.encodeFunctionData("blockFromDeposits(address[])", [lenders])
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
      data: WildcatMarketController__factory.createInterface().encodeFunctionData(
        "authorizeLenders",
        [lenders]
      ),
      value: 0n
    });
  });

  it("uses viem encoding through hooks and wrapper populate helpers", () => {
    const hooksTemplate = new OpenTermHooksTemplate(SupportedChainId.Sepolia, provider, {
      hooksFactory: getDeploymentAddress(SupportedChainId.Sepolia, "HooksFactory"),
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
      name: "OpenTermHooksInstance"
    });
    const wrapperFactory = new WrapperFactory(SupportedChainId.Sepolia, makeAddress(16), provider);
    const market = makeAddress(17);

    expect(hooks.populateUnblockLender(makeAddress(18)).data).to.equal(
      IOpenTermHooks__factory.createInterface().encodeFunctionData("unblockFromDeposits", [
        makeAddress(18)
      ])
    );
    expect(wrapperFactory.populateCreateWrapper(market).data).to.equal(
      Wildcat4626WrapperFactory__factory.createInterface().encodeFunctionData("createWrapper", [
        market
      ])
    );
    expect(
      prepareTransaction({
        to: wrapperFactory.address,
        abi: wildcat4626WrapperFactoryAbi,
        functionName: "createWrapper",
        args: [market]
      }).data
    ).to.equal(wrapperFactory.populateCreateWrapper(market).data);
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
      data: IERC20__factory.createInterface().encodeFunctionData("approve", [spender, 123]),
      value: 0n
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

    expect(hash).to.equal(expectedHash);
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
          hooksAddress
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
      IOpenTermHooks__factory.createInterface().encodeFunctionData("setMinimumDeposit", [
        marketAddress,
        1
      ])
    );
  });
});
