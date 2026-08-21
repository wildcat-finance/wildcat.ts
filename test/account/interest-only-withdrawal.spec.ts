import { expect } from "chai";
import { providers } from "ethers";
import { SupportedChainId } from "../../src/constants";
import { createInterestOnlyWithdrawalQuote } from "../../src/interest-only-withdrawal";
import { Token } from "../../src/token";

const provider = new providers.JsonRpcProvider();
const asset = new Token(
  SupportedChainId.Sepolia,
  "0x0000000000000000000000000000000000000001",
  "USD Coin",
  "USDC",
  6,
  false,
  provider
);
const ray = 10n ** 27n;
const indexedAt = {
  blockNumber: 100n,
  blockTimestamp: 200n,
  transactionHash: `0x${"1".repeat(64)}`,
  logIndex: 3n
};

const quote = (
  indexedScaledBalance: bigint,
  currentScaledBalance: bigint,
  currentBalance: bigint,
  principalBasis: bigint
) =>
  createInterestOnlyWithdrawalQuote({
    account: "0x0000000000000000000000000000000000000002",
    market: "0x0000000000000000000000000000000000000003",
    position: { kind: "market", address: "0x0000000000000000000000000000000000000003" },
    assetToken: asset,
    indexedScaledBalance,
    currentScaledBalance,
    currentBalance: asset.getAmount(currentBalance),
    principalBasis: asset.getAmount(principalBasis),
    currentScaleFactor: (11n * ray) / 10n,
    basisIndexedAt: indexedAt,
    balanceStateSource: "live",
    quotedAtTimestamp: 300
  });

describe("interest-only withdrawal quotes", () => {
  it("returns the full-precision excess over indexed principal basis", () => {
    const result = quote(100n, 100n, 110n, 100n);

    expect(result.status).to.equal("ready");
    expect(result.indexedPositionBalance.raw).to.equal(110n);
    expect(result.availableInterest.raw).to.equal(10n);
    expect(result.basisIndexedAt).to.deep.equal(indexedAt);
    expect(result.quotedAtTimestamp).to.equal(300);
  });

  it("saturates at zero when the position is below basis", () => {
    const result = quote(100n, 100n, 110n, 125n);

    expect(result.status).to.equal("ready");
    expect(result.availableInterest.raw).to.equal(0n);
  });

  it("does not quote against a position that changed after the indexed basis", () => {
    const incoming = quote(100n, 150n, 165n, 100n);
    const outgoing = quote(100n, 5n, 5n, 100n);

    expect(incoming.status).to.equal("position-changed");
    expect(incoming.availableInterest.raw).to.equal(0n);
    expect(outgoing.status).to.equal("position-changed");
    expect(outgoing.availableInterest.raw).to.equal(0n);
  });

  it("never quotes more than the latest known normalized balance", () => {
    const result = quote(100n, 100n, 7n, 100n);

    expect(result.status).to.equal("ready");
    expect(result.availableInterest.raw).to.equal(7n);
  });
});
