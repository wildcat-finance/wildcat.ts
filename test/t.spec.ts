import { ethers } from "hardhat";
import { WildcatVaultController } from "../src/typechain";
import { IERC20, WildcatVaultToken } from "../typechain-types";
import { ControllerAddress } from "../src/constants";
import { Vault, getAllVaults } from "../src";
import { expect } from "chai";

describe("Test", () => {
  let vaultContract: WildcatVaultToken;
  let controller: WildcatVaultController;
  let vault: Vault;
  let underlying: IERC20;

  before(async () => {
    controller = await ethers.getContractAt(
      "WildcatVaultController",
      ControllerAddress
    );
    vault = (await getAllVaults(ethers.provider))[0];
    vaultContract = await ethers.getContractAt(
      "WildcatVaultToken",
      vault.address
    );
    underlying = await ethers.getContractAt(
      "IERC20",
      await vaultContract.asset()
    );
  });

  it("Should have right info", async () => {
    expect(await vaultContract.name()).to.eq(vault.name);
    expect(await vaultContract.symbol()).to.eq(vault.symbol);
    expect(await vaultContract.decimals()).to.eq(vault.decimals);
    expect(underlying.address).to.eq(vault.asset);
    expect(vaultContract.address).to.eq(vault.address);
    expect(await vaultContract.borrower()).to.eq(vault.borrower);
    expect(await vaultContract.controller()).to.eq(vault.controller);
    expect(await vaultContract.maxTotalSupply()).to.eq(
      vault.maxTotalSupply.raw
    );
    expect(await vaultContract.annualInterestBips()).to.eq(
      vault.annualInterestBips
    );
    expect(await vaultContract.penaltyFeeBips()).to.eq(vault.penaltyFeeBips);
    expect(await vaultContract.gracePeriod()).to.eq(vault.gracePeriod);
    expect(await vaultContract.liquidityCoverageRatio()).to.eq(
      vault.liquidityCoverageBips
    );
    expect(await vaultContract.interestFeeBips()).to.eq(vault.interestFeeBips);
    expect(await vaultContract.feeRecipient()).to.eq(vault.feeRecipient);
    expect(await vaultContract.scaleFactor()).to.eq(vault.scaleFactor);
    expect(await vaultContract.totalAssets()).to.eq(vault.totalAssets.raw);
    expect(await vaultContract.totalSupply()).to.eq(vault.totalSupply.raw);
    expect(await vaultContract.borrowableAssets()).to.eq(vault.borrowableAssets.raw);
  });
});
