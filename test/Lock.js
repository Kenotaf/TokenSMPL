const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const {
    developmentChains,
    networkConfig,
} = require("../../helper-hardhat-config");

beforeeacah;

describe("Token", function () {
    let token;
    let deployer;
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;

        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["token"]);
        token = await ethers.getContract("token", deployer);

        TokenContract = await ethers.getContract("BlackRed"); // Returns a new connection to the Raffle contract
        blackRedD = BlackRedContract.connect(deployer);
    });
    describe("mint");
});
