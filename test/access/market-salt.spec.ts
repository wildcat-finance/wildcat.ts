import { expect } from "chai";
import { getAddress, zeroAddress } from "viem";
import {
  encodeMarketSalt,
  getMarketSaltFactoryCaller,
  isMarketSaltForFactoryCaller,
  isMarketSaltFormatValid
} from "../../src/access";

const factoryCaller = getAddress("0x0000000000000000000000000000000000000001");
const otherCaller = getAddress("0x0000000000000000000000000000000000000002");
const nonce = "0x000000000000000000000003";

describe("v2.5 market salts", () => {
  it("encodes the immediate factory caller and a 12-byte nonce", () => {
    const salt = encodeMarketSalt(factoryCaller, nonce);

    expect(salt).to.equal(`${factoryCaller.toLowerCase()}${nonce.slice(2)}`);
    expect(getMarketSaltFactoryCaller(salt)).to.equal(factoryCaller);
    expect(isMarketSaltFormatValid(salt)).to.equal(true);
    expect(isMarketSaltForFactoryCaller(salt, factoryCaller)).to.equal(true);
    expect(isMarketSaltForFactoryCaller(salt, otherCaller)).to.equal(false);
  });

  it("rejects salts that the v2.5 factories can never accept", () => {
    expect(() => encodeMarketSalt(zeroAddress, nonce)).to.throw(
      "Market salt factory caller must not be the zero address"
    );
    expect(() => encodeMarketSalt(factoryCaller, "0x01")).to.throw(
      "Market salt nonce must be exactly 12 bytes"
    );
    expect(() => getMarketSaltFactoryCaller("0x01")).to.throw(
      "Market salt must be exactly 32 bytes"
    );
    expect(isMarketSaltFormatValid(`0x${"00".repeat(32)}`)).to.equal(false);
  });
});
