import { expect } from "chai";
import { providers } from "ethers";
import { SupportedChainId } from "../../src/constants";
import { SubgraphTokenWrapperData, TokenWrapper } from "../../src/wrapper";

const provider = new providers.JsonRpcProvider();

const token = (address: string, name: string, symbol: string) => ({
  __typename: "Token" as const,
  id: address.toLowerCase(),
  address,
  name,
  symbol,
  decimals: 18,
  isMock: false
});

describe("TokenWrapper subgraph hydration", () => {
  it("hydrates static wrapper metadata without live contract reads", () => {
    const marketAddress = "0x4000000000000000000000000000000000000004";
    const wrapperAddress = "0x5000000000000000000000000000000000000005";
    const data: SubgraphTokenWrapperData = {
      id: wrapperAddress.toLowerCase(),
      address: wrapperAddress,
      marketAddress,
      marketToken: token(marketAddress, "Mock Market", "mMOCK"),
      token: token(wrapperAddress, "Wrapped Mock Market", "wmMOCK"),
      factory: {
        id: "0x2000000000000000000000000000000000000002",
        address: "0x2000000000000000000000000000000000000002"
      },
      deployedEvent: {
        blockNumber: 1,
        blockTimestamp: 2,
        transactionHash: "0x1234"
      }
    };

    const wrapper = TokenWrapper.fromSubgraphData(SupportedChainId.Sepolia, provider, data);

    expect(wrapper.address).to.equal(wrapperAddress);
    expect(wrapper.marketAddress).to.equal(marketAddress);
    expect(wrapper.marketToken.address).to.equal(marketAddress);
    expect(wrapper.marketToken.symbol).to.equal("mMOCK");
    expect(wrapper.shareToken.address).to.equal(wrapperAddress);
    expect(wrapper.shareToken.symbol).to.equal("wmMOCK");
    expect(wrapper.name).to.equal("Wrapped Mock Market");
    expect(wrapper.symbol).to.equal("wmMOCK");
  });
});
