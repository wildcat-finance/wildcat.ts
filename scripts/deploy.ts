import { ethers } from "hardhat";

async function deployFactory() {
  const MockERC20Factory = await ethers.getContractFactory("MockERC20Factory");
  const factory = await MockERC20Factory.deploy();
  console.log(`MockERC20Factory deployed to: ${factory.address}`);

  const VaultLensFactory = await ethers.getContractFactory("VaultLens");
  const lens = await VaultLensFactory.deploy();
  console.log(`VaultLens deployed to: ${lens.address}`);
}

deployFactory();
