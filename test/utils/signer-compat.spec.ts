import { expect } from "chai";
import { Signer } from "../../src";
import { getEthersSignerAddress, isEthersSigner } from "../../src/internal/ethers-signer";

const fakeSigner = {
  _isSigner: true,
  getAddress: async () => "0x0000000000000000000000000000000000000001"
};

describe("ethers signer compatibility shim", () => {
  it("preserves Signer.isSigner compatibility without importing ethers at runtime", async () => {
    expect(Signer.isSigner(fakeSigner)).to.equal(true);
    expect(isEthersSigner(fakeSigner)).to.equal(true);
    expect(await getEthersSignerAddress(fakeSigner)).to.equal(
      "0x0000000000000000000000000000000000000001"
    );
  });

  it("does not classify provider-like objects as signers", async () => {
    const providerLike = { request: async () => undefined };

    expect(Signer.isSigner(providerLike)).to.equal(false);
    expect(isEthersSigner(providerLike)).to.equal(false);
    expect(await getEthersSignerAddress(providerLike)).to.equal(undefined);
  });
});
