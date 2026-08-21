import { expect } from "chai";
import { providers } from "ethers";
import { encodeFunctionData, encodeFunctionResult, type Address } from "viem";
import { iPeriodicTermHooksAbi } from "../../src/abi";
import { LenderRole, MarketAccount, ProposeAnnualInterestBipsStatus } from "../../src/account";
import { SupportedChainId } from "../../src/constants";
import { Token } from "../../src/token";
import { HooksKind, MarketVersion } from "../../src/types";
import { Market } from "../../src/market";
import {
  getPeriodicAprReductionSettlementQuote,
  PeriodicAprSettlementStatus
} from "../../src/periodic-settlement";

const provider = new providers.JsonRpcProvider();

const makeAddress = (suffix: number): Address =>
  `0x${suffix.toString(16).padStart(40, "0")}` as Address;

const borrower = makeAddress(1);
const marketAddress = makeAddress(2);
const hooksAddress = makeAddress(3);

type AccountOverrides = {
  account?: Address;
  version?: MarketVersion;
  hooksKind?: HooksKind;
  annualInterestBips?: number;
  isPeriodicWithdrawalWindowOpen?: boolean;
  signer?: unknown;
};

const makeAccount = ({
  account = borrower,
  version = MarketVersion.V2,
  hooksKind = HooksKind.PeriodicTerm,
  annualInterestBips = 1_000,
  isPeriodicWithdrawalWindowOpen = false,
  signer = provider
}: AccountOverrides = {}): MarketAccount => {
  const token = new Token(
    SupportedChainId.Sepolia,
    makeAddress(4),
    "Mock Token",
    "MOCK",
    18,
    false,
    provider
  );

  return new MarketAccount({
    account,
    role: LenderRole.Null,
    market: {
      address: marketAddress,
      borrower,
      chainId: SupportedChainId.Sepolia,
      version,
      underlyingToken: token,
      annualInterestBips,
      signer,
      hooksConfig: {
        kind: hooksKind,
        hooksAddress
      },
      isPeriodicWithdrawalWindowOpen
    },
    scaledMarketBalance: 0n,
    marketBalance: token.getAmount(0n),
    underlyingBalance: token.getAmount(0n),
    underlyingApproval: token.getAmount(0n)
  } as any);
};

describe("periodic APR reduction proposals", () => {
  it("previews borrower, market, APR and withdrawal-window constraints", () => {
    expect(makeAccount().previewProposeAnnualInterestBips(900).status).to.equal(
      ProposeAnnualInterestBipsStatus.Ready
    );
    expect(
      makeAccount({ version: MarketVersion.V1 }).previewProposeAnnualInterestBips(900).status
    ).to.equal(ProposeAnnualInterestBipsStatus.NotV2Market);
    expect(
      makeAccount({ account: makeAddress(5) }).previewProposeAnnualInterestBips(900).status
    ).to.equal(ProposeAnnualInterestBipsStatus.NotBorrower);
    expect(makeAccount().previewProposeAnnualInterestBips(0).status).to.equal(
      ProposeAnnualInterestBipsStatus.InvalidApr
    );
    expect(
      makeAccount({ hooksKind: HooksKind.OpenTerm }).previewProposeAnnualInterestBips(900).status
    ).to.equal(ProposeAnnualInterestBipsStatus.NotPeriodicTermMarket);
    expect(makeAccount().previewProposeAnnualInterestBips(1_000).status).to.equal(
      ProposeAnnualInterestBipsStatus.NotReduction
    );
    expect(
      makeAccount({ isPeriodicWithdrawalWindowOpen: true }).previewProposeAnnualInterestBips(900)
        .status
    ).to.equal(ProposeAnnualInterestBipsStatus.WithdrawalWindowOpen);
  });

  it("encodes and submits the market address with the proposed APR", async () => {
    const expectedHash = `0x${"1".padStart(64, "0")}`;
    let sentTransaction: unknown;
    const signer = {
      sendTransaction: async (transaction: unknown) => {
        sentTransaction = transaction;
        return { hash: expectedHash };
      }
    };
    const account = makeAccount({ signer });
    const expectedData = encodeFunctionData({
      abi: iPeriodicTermHooksAbi,
      functionName: "proposeAnnualInterestBips",
      args: [marketAddress, 900]
    });

    expect(account.populateProposeAnnualInterestBips(900)).to.deep.equal({
      to: hooksAddress,
      data: expectedData,
      value: "0"
    });

    const hash = await account.proposeAnnualInterestBips(900);

    expect(String(hash)).to.equal(expectedHash);
    expect(sentTransaction).to.deep.equal({
      to: hooksAddress,
      data: expectedData,
      value: "0"
    });
  });

  it("uses the quote timestamp when reporting whether the withdrawal window is open", async () => {
    const quoteTimestamp = 1_050;
    const rpcProvider = {
      send: async (method: string) => {
        if (method === "eth_chainId") return "0xaa36a7";
        if (method === "eth_call") {
          return encodeFunctionResult({
            abi: iPeriodicTermHooksAbi,
            functionName: "getPendingAprChange",
            result: [{ annualInterestBips: 900, proposalTimestamp: 1_010 }, 1_000, 1_040]
          });
        }
        throw new Error(`Unexpected RPC method: ${method}`);
      }
    };
    const token = new Token(
      SupportedChainId.Sepolia,
      makeAddress(4),
      "Mock Token",
      "MOCK",
      18,
      false,
      rpcProvider as unknown as providers.Provider
    );
    const zero = token.getAmount(0n);
    const market = Object.create(Market.prototype) as Market;
    Object.assign(market, {
      address: marketAddress,
      provider: rpcProvider,
      version: MarketVersion.V2,
      underlyingToken: token,
      hooksConfig: {
        kind: HooksKind.PeriodicTerm,
        hooksAddress,
        flags: {
          useOnExecutePendingAnnualInterestBipsReduction: true
        },
        firstWithdrawalWindowStart: 1_000,
        periodDuration: 300,
        withdrawalWindowDuration: 60,
        periodicTermClosed: false
      },
      update: async () => undefined,
      isClosed: false,
      totalAssets: zero,
      coverageLiquidity: zero,
      unpaidWithdrawalBatchExpiries: []
    });
    const account = { market } as MarketAccount;
    const originalDateNow = Date.now;

    try {
      Date.now = () => 1_200_000;
      expect(market.isPeriodicWithdrawalWindowOpen).to.equal(false);
      const quote = await getPeriodicAprReductionSettlementQuote(account, 900, quoteTimestamp);

      expect(quote.status).to.equal(PeriodicAprSettlementStatus.Ready);
      expect(quote.isWithdrawalWindowOpen).to.equal(true);
    } finally {
      Date.now = originalDateNow;
    }
  });
});
