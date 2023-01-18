const { inputToConfig } = require("@ethereum-waffle/compiler");
const { assert, expect } = require("chai");
const { Wallet } = require("ethers");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const {
    developmentChains,
    networkConfig,
} = require("../../helper-hardhat-config");

describe("Token + staking", function () {
    let token;
    let deployer;
    const wallet = new ethers.Wallet(
        "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU86d9GNkvq"
    );
    beforeEach(async () => {
        accounts = await ethers.getSigners(); // could also do with getNamedAccounts
        deployer = accounts[0];

        await deployments.fixture(["all"]);
        token = await ethers.getContract("Token", deployer);

        TokenContract = await ethers.getContract("Token"); // Returns a new connection to the "" contract
        TokenContract._mint(wallet.address, 10000000000);
    });

    describe("_mint", function () {
        it("It mints correct ammount of coins", async () => {});
    });
});
