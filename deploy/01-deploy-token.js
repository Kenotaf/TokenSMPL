//const { network, ethers } = require("hardhat");
const {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;
    log("----------------------------------------------------");
    console.log("deploer === ", deployer);
    const arguments = [];

    const token = await deploy("Token", {
        from: deployer,
        log: true,
        waitConfirmations: 1,
    });
    log(`Token deployed at ${token.address}`);
    const tokenAddress = token.address;
    console.log(tokenAddress);

    //Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...");
        await verify(token.address, arguments);
    }

    log("Interact with token using command:");
    const networkName = network.name == "hardhat" ? "localhost" : network.name;
    log(`yarn hardhat run scripts/interact.js --network ${networkName}`);
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "token"];
