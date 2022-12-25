const { ethers } = require("hardhat");

async function aloowenceMax() {
    const token = await ethers.getContract("Token");
    await token.increaseAllowance();
    console.log("Approved!");
}

aloowenceMax()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
