import { expect } from "chai";
import * as sdk from "../../src";

describe("SDK public surface smoke", () => {
  it("exports the canonical read helpers and explicit V2 compatibility wrappers", () => {
    expect(typeof sdk.getMarket).to.equal("function");
    expect(typeof sdk.getMarketV2).to.equal("function");
    expect(typeof sdk.getMarkets).to.equal("function");
    expect(typeof sdk.getAllMarkets).to.equal("function");
    expect(typeof sdk.getMarketsCount).to.equal("function");
    expect(typeof sdk.getPaginatedMarkets).to.equal("function");
    expect(typeof sdk.getMarketAccount).to.equal("function");
    expect(typeof sdk.getMarketAccountV2).to.equal("function");
    expect(typeof sdk.getMarketAccountsForLender).to.equal("function");
    expect(typeof sdk.getAllMarketAccountsForLender).to.equal("function");
    expect(typeof sdk.getPaginatedMarketAccounts).to.equal("function");
    expect(typeof sdk.getTokenData).to.equal("function");
    expect(typeof sdk.getTokensData).to.equal("function");
    expect(typeof sdk.getWithdrawalBatch).to.equal("function");
    expect(typeof sdk.getWithdrawalForLender).to.equal("function");
    expect(typeof sdk.normalizeWildcatClient).to.equal("function");
    expect(typeof sdk.requireWildcatWriteClient).to.equal("function");
    expect(Array.isArray(sdk.marketLensV2_5Abi)).to.equal(true);
    expect(Array.isArray(sdk.wildcatArchControllerAbi)).to.equal(true);
  });
});
