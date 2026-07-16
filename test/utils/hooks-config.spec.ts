import { expect } from "chai";
import { decodeHooksConfig, encodeHooksConfig } from "../../src/utils";

describe("V2.5 hooks config encoding", () => {
  it("round-trips the permissionless periodic APR execution flag at bit 84", () => {
    const hooksAddress = "0x0000000000000000000000000000000000000001";
    const encoded = encodeHooksConfig({
      hooksAddress,
      useOnExecutePendingAnnualInterestBipsReduction: true
    });

    expect((encoded >> 84n) & 1n).to.equal(1n);
    expect(decodeHooksConfig(encoded)).to.include({
      hooksAddress,
      useOnExecutePendingAnnualInterestBipsReduction: true
    });
  });
});
