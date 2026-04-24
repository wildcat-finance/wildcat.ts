import { expect } from "chai";
import type { Address, PublicClient, WalletClient } from "viem";
import {
  asWildcatWriteClient,
  getAccountAddress,
  getWildcatClientAccount,
  normalizeWildcatClient,
  requireWildcatWriteClient,
  WildcatClientError,
  WildcatClient
} from "../../src/client";

const publicClient = {} as PublicClient;
const account = "0x0000000000000000000000000000000000000001" as Address;
const otherAccount = "0x0000000000000000000000000000000000000002" as Address;

const walletClient = {
  account: { address: account }
} as WalletClient;

describe("Wildcat viem client helpers", () => {
  it("resolves explicit and wallet-client account addresses", () => {
    expect(getAccountAddress(account)).to.equal(account);
    expect(getAccountAddress(walletClient.account!)).to.equal(account);
    expect(getWildcatClientAccount({ publicClient, walletClient })).to.equal(account);
    expect(getWildcatClientAccount({ publicClient, walletClient, account: otherAccount })).to.equal(
      otherAccount
    );
  });

  it("normalizes inferred wallet-client accounts into the client shape", () => {
    const normalized = normalizeWildcatClient({ publicClient, walletClient });

    expect(normalized.account).to.equal(account);
    expect(normalized.publicClient).to.equal(publicClient);
    expect(normalized.walletClient).to.equal(walletClient);
  });

  it("builds write clients only when wallet client and account are available", () => {
    const readOnlyClient: WildcatClient = { publicClient };
    const writeClient = asWildcatWriteClient({ publicClient, walletClient });

    expect(asWildcatWriteClient(readOnlyClient)).to.equal(undefined);
    expect(writeClient?.account).to.equal(account);
    expect(writeClient?.walletClient).to.equal(walletClient);
  });

  it("throws a typed error when a write client is required but unavailable", () => {
    expect(() => requireWildcatWriteClient({ publicClient })).to.throw(
      WildcatClientError,
      "Wildcat write operations require a wallet client and account"
    );
  });
});
