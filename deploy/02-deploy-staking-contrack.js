const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");
const { getNamedAccounts, deployments, network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const tokenContract = await deployments.get("Token");
    const address = tokenContract.address;

    log("----------------------------------------------------");
    log("Deploying stakingMech");
    const stakking = await deploy("StakingMech", {
        from: deployer,
        args: [address],
        log: true,
    });
    log(`Token deployed at ${stakking.address}`);

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(stakking.address, [ethUsdPriceFeedAddress]);
    }
    log("Interact with token using command:");
    const networkName = network.name == "hardhat" ? "localhost" : network.name;
    log(`yarn hardhat run scripts/interact.js --network ${networkName}`);
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "staking"];
module.exports.runAtTheEnd = true;
