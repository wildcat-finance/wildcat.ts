import { expect } from "chai";
import { decodeFunctionData, type Hex } from "viem";
import { wildcatCollateralFactoryAbi } from "../../src/abi";
import { MarketCollateralV1 } from "../../src/collateral";
import { getDeploymentAddress, SupportedChainId } from "../../src/constants";
import { Token } from "../../src/token";
import type { Signer } from "../../src/types";
import { makeAddress, makeMarket, offlineProvider } from "../helpers/review-fixtures";

const makeFixture = (chainId: SupportedChainId) => ({
  market: makeMarket({ chainId }),
  collateralAsset: new Token(
    chainId,
    makeAddress(40),
    "Collateral",
    "COL",
    18,
    false,
    offlineProvider
  )
});

describe("collateral deployment calldata", () => {
  // Exercise both configured factory destinations without contacting either network.
  for (const chainId of [SupportedChainId.Mainnet, SupportedChainId.Sepolia]) {
    it(`encodes the collateral token before the associated market on chain ${chainId}`, () => {
      const { market, collateralAsset } = makeFixture(chainId);
      const transaction = MarketCollateralV1.populateCreate(
        chainId,
        offlineProvider,
        market,
        collateralAsset
      );
      const decoded = decodeFunctionData({
        abi: wildcatCollateralFactoryAbi,
        data: transaction.data as Hex
      });

      expect(collateralAsset.address).not.to.equal(market.address);
      expect(transaction.to).to.equal(getDeploymentAddress(chainId, "WildcatCollateralFactory"));
      expect(transaction.value).to.equal("0");
      expect(decoded.functionName).to.equal("deployCollateralContract");
      expect(decoded.args?.[0]).to.equal(collateralAsset.address);
      expect(decoded.args?.[1]).to.equal(market.address);
    });

    it(`submits the corrected address order through create on chain ${chainId}`, async () => {
      const { market, collateralAsset } = makeFixture(chainId);
      const submitted: Array<Parameters<Signer["sendTransaction"]>[0]> = [];
      const expectedHash = `0x${"1".repeat(64)}`;
      const signer: Signer = {
        _isSigner: true,
        call: offlineProvider.call,
        getAddress: async () => market.borrower,
        sendTransaction: async (transaction) => {
          submitted.push(transaction);
          return { hash: expectedHash };
        }
      };

      const result = await MarketCollateralV1.create(chainId, signer, market, collateralAsset);

      expect(submitted).to.have.length(1);
      expect(submitted[0].to).to.equal(getDeploymentAddress(chainId, "WildcatCollateralFactory"));
      expect(submitted[0].value).to.equal("0");
      expect(
        decodeFunctionData({ abi: wildcatCollateralFactoryAbi, data: submitted[0].data as Hex })
      ).to.deep.equal({
        functionName: "deployCollateralContract",
        args: [collateralAsset.address, market.address]
      });
      expect(result.hash).to.equal(expectedHash);
      expect(String(result)).to.equal(expectedHash);
    });
  }
});
