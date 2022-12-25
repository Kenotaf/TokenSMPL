require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("solidity-coverage");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const PRIVATE_KEY =
    process.env.PRIVATE_KEY ||
    "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a";
const GORELI_RPC_URL =
    process.env.GORELI_RPC_URL ||
    "https://eth-goerli.g.alchemy.com/v2/deZj4xOyf6bhMfFP6WcCMYqn-13L14Dw";

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfiramtions: 1,
            //gasPrice: 130000000000,
        },
        goreli: {
            chainId: 5,
            url: GORELI_RPC_URL,
            blockConfiramtions: 3,
            acounts: [PRIVATE_KEY],
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.9",
            },
        ],
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
            },
        },
    },
    etherscan: {
        // apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        staker: {
            default: 1,
        },
    },
};
