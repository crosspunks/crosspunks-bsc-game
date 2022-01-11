const { ethers } = require("hardhat");

const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";

const name = "Fuel Token";
const symbol = "FUEL";

const rewardPerBlock = ethers.utils.parseEther("1000");
const startBlock = 14264000;
const bonusEndBlock = 14964000;

async function main() {

    const Staking = await ethers.getContractFactory("Staking");
    const FuelToken = await ethers.getContractFactory("FuelToken");

    const fuel = await FuelToken.deploy(name, symbol);
    const staking = await Staking.deploy(
        fuel.address,
        rewardPerBlock,
        startBlock,
        bonusEndBlock
    );
        
    await fuel.grantRole(MINTER_ROLE, staking.address)

    console.log("Fuel Token deployed to:", fuel.address);
    console.log("Staking deployed to:", staking.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });


module.exports = {
    rewardPerBlock,
    startBlock,
    bonusEndBlock,
    name,
    symbol

}
  