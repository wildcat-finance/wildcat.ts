import type { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import 'dotenv/config'

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 11155111,      
      forking: {
        url: 'https://eth-sepolia.g.alchemy.com/v2/Dwn5l0Y-DcxyShxHVAqreAUkULi4eznO',
        blockNumber: 3654504
      }
    }
  }
};

export default config;
