import { ethers } from "hardhat";
// import { WildcatVaultController } from "../src/typechain";
import { ERC20, IERC20, WildcatVaultToken } from "../typechain-types";
// import { ControllerAddress } from "../src/constants";
import { Token, Vault, VaultAccount, VaultFactory, getAllVaultsData, Signer } from "../src";
import { expect } from "chai";
import { TokenFactory } from "../src/mockerc20factory";
import { ControllerAddress } from "../src/constants";
import { constants } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Test", () => {
  let vaultContract: WildcatVaultToken;
  // let controller: WildcatVaultController;
  let vault: Vault;
  let underlying: ERC20;
  let vaultInfo: Awaited<ReturnType<typeof getVaultInfo>>;
  let signer: SignerWithAddress;

  before(async () => {
    [signer] = await ethers.getSigners();
    // controller = await ethers.getContractAt("WildcatVaultController", ControllerAddress);
    const token = await TokenFactory.deployToken(signer, "DAI Stablecoin", "DAI");
    await token.faucet();
    vault = await VaultFactory.deployVault(
      {
        namePrefix: "Wildcat ",
        symbolPrefix: "wct",
        controller: ControllerAddress,
        maxTotalSupply: token.parseAmount("1000000000"),
        gracePeriod: 86400,
        penaltyFeeBips: 1000,
        annualInterestBips: 1000,
        asset: token,
        borrower: signer.address,
        feeRecipient: constants.AddressZero,
        liquidityCoverageRatio: 1000,
        interestFeeBips: 1000
      },
      signer
    );
    // vault = (await getAllVaultsData(ethers.provider))[0];
    vaultContract = await ethers.getContractAt("WildcatVaultToken", vault.address);
    underlying = await ethers.getContractAt("ERC20", token.address);
    await token.contract.approve(vault.address, token.parseAmount("50").raw);
    await vault.contract.depositUpTo(token.parseAmount("50").raw, signer.address);
    vaultInfo = await getVaultInfo(vaultContract, underlying);
  });

  async function getVaultInfo(vaultContract: WildcatVaultToken, underlyingContract: ERC20) {
    const vaultInfo = await getTokenInfo(vaultContract);

    const underlyingInfo = await getTokenInfo(underlyingContract);

    const data = {
      borrower: await vaultContract.borrower(),
      controller: await vaultContract.controller(),
      maxTotalSupply: await vaultContract.maxTotalSupply(),
      annualInterestBips: await vaultContract.annualInterestBips(),
      penaltyFeeBips: await vaultContract.penaltyFeeBips(),
      gracePeriod: await vaultContract.gracePeriod(),
      liquidityCoverageRatio: await vaultContract.liquidityCoverageRatio(),
      interestFeeBips: await vaultContract.interestFeeBips(),
      feeRecipient: await vaultContract.feeRecipient(),
      scaleFactor: await vaultContract.scaleFactor(),
      totalAssets: await vaultContract.totalAssets(),
      totalSupply: await vaultContract.totalSupply(),
      borrowableAssets: await vaultContract.borrowableAssets()
    };

    return {
      vaultToken: vaultInfo,
      underlyingToken: underlyingInfo,
      data
    };
  }

  function checkVault(vault: Vault) {
    checkToken(vault.vaultToken, vaultInfo.vaultToken);
    checkToken(vault.underlyingToken, vaultInfo.underlyingToken);

    expect(vaultInfo.data.borrower).to.eq(vault.borrower);
    expect(vaultInfo.data.controller).to.eq(vault.controller);
    expect(vaultInfo.data.maxTotalSupply).to.eq(vault.maxTotalSupply.raw);
    expect(vaultInfo.data.annualInterestBips).to.eq(vault.annualInterestBips);
    expect(vaultInfo.data.penaltyFeeBips).to.eq(vault.penaltyFeeBips);
    expect(vaultInfo.data.gracePeriod).to.eq(vault.gracePeriod);
    expect(vaultInfo.data.liquidityCoverageRatio).to.eq(vault.liquidityCoverageBips);
    expect(vaultInfo.data.interestFeeBips).to.eq(vault.interestFeeBips);
    expect(vaultInfo.data.feeRecipient).to.eq(vault.feeRecipient);
    expect(vaultInfo.data.scaleFactor).to.eq(vault.scaleFactor);
    expect(vaultInfo.data.totalAssets).to.eq(vault.totalAssets.raw);
    expect(vaultInfo.data.totalSupply).to.eq(vault.totalSupply.raw);
    expect(vaultInfo.data.borrowableAssets).to.eq(vault.borrowableAssets.raw);
  }

  const getTokenInfo = async (token: ERC20 | WildcatVaultToken) => {
    return {
      address: token.address,
      name: await token.name(),
      symbol: await token.symbol(),
      decimals: await token.decimals()
    };
  };

  function checkToken(token: Token, info: Awaited<ReturnType<typeof getTokenInfo>>) {
    expect(token.address).to.eq(info.address);
    expect(token.name).to.eq(info.name);
    expect(token.symbol).to.eq(info.symbol);
    expect(token.decimals).to.eq(info.decimals);
  }

  const getVaultAccountInfo = async (
    vaultContract: WildcatVaultToken,
    tokenContract: ERC20,
    account: string
  ) => {
    return {
      // scaledBalance: await vaultContract.scaledBalanceOf(account),
      normalizedBalance: await vaultContract.balanceOf(account),
      underlyingBalance: await tokenContract.balanceOf(account),
      underlyingAllowance: await underlying.allowance(account, vaultContract.address)
    };
  };

  function checkVaultAccount(
    vaultAccount: VaultAccount,
    accountInfo: Awaited<ReturnType<typeof getVaultAccountInfo>>
  ) {
    expect(accountInfo.normalizedBalance).to.eq(vaultAccount.vaultBalance.raw);
    expect(accountInfo.underlyingAllowance).to.eq(vaultAccount.underlyingApproval);
    expect(accountInfo.underlyingBalance).to.eq(vaultAccount.underlyingBalance.raw);
    checkVault(vaultAccount.vault);
  }

  describe("Vault", () => {
    it("getVaultData", async () => {
      const vault = await Vault.getVaultData(vaultContract.address, ethers.provider);
      checkVault(vault);
    });

    it("getVaultsData", async () => {
      const vaults = await Vault.getVaultsData([vaultContract.address], ethers.provider);
      expect(vaults.length).to.eq(1);
      const vault = vaults[0];
      checkVault(vault);
    });

    it("getAllVaultsData", async () => {
      const vaults = await getAllVaultsData(ethers.provider);
      expect(vaults.length).to.eq(1);
      const vault = vaults[0];
      checkVault(vault);
    });

    it("getPaginatedVaultsData", async () => {
      const vaults = await Vault.getPaginatedVaultsData(ethers.provider, 0, 1);
      expect(vaults.length).to.eq(1);
      const vault = vaults[0];
      checkVault(vault);
    });
  });

  describe("VaultAccount", () => {
    let accountInfo: Awaited<ReturnType<typeof getVaultAccountInfo>>;

    before(async () => {
      accountInfo = await getVaultAccountInfo(vaultContract, underlying, signer.address);
    });

    it("getVaultAccountData", async () => {
      const vaultAccount = await VaultAccount.getVaultAccount(
        signer,
        signer.address,
        vaultContract.address
      );
      checkVaultAccount(vaultAccount, accountInfo);
    });

    it("getVaultAccounts", async () => {
      const vaultAccounts = await VaultAccount.getVaultAccounts(signer, signer.address, [
        vaultContract.address
      ]);
      expect(vaultAccounts.length).to.eq(1);
      checkVaultAccount(vaultAccounts[0], accountInfo);
    });

    it("getAllVaultAccounts", async () => {
      const vaultAccounts = await VaultAccount.getAllVaultAccounts(signer, signer.address);
      expect(vaultAccounts.length).to.eq(1);
      checkVaultAccount(vaultAccounts[0], accountInfo);
    });

    it("getPaginatedVaultAccounts", async () => {
      const vaultAccounts = await VaultAccount.getPaginatedVaultAccounts(
        signer,
        signer.address,
        0,
        1
      );
      expect(vaultAccounts.length).to.eq(1);
      checkVaultAccount(vaultAccounts[0], accountInfo);
    });
  });

  describe("Token", () => {
    it("getTokenData", async () => {
      const token = await Token.getTokenData(underlying.address, ethers.provider);
      checkToken(token, vaultInfo.underlyingToken);
    });

    it("getTokensData", async () => {
      const tokens = await Token.getTokensData(
        [vault.address, underlying.address],
        ethers.provider
      );
      expect(tokens.length).to.eq(2);

      checkToken(tokens[0], vaultInfo.vaultToken);
      checkToken(tokens[1], vaultInfo.underlyingToken);
    });
  });
});
