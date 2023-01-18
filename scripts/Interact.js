const { ethers } = require("hardhat");

async function alowenceMax() {
    const staking = await ethers.getContract("StakingMech");
    const token = await ethers.getContract("Token");
    await token.approve(staking.address, 100);
    console.log("Approved!");
}

alowenceMax()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
