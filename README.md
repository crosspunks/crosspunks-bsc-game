# crosspunks-bsc-game
CrossPunks game smart contracts


# FuelToken
FuelToken is an ERC20 token. The contract inherits the OpenZeppelin AccessControl mechanism. MINTER_ROLE and BURNER_ROLE addresses can mint and burn a token, respectively. The same address can be both a burner and a miner at the same time. The DEFAULT_ADMIN_ROLE address (by default it is the deployer) can assign roles. Initial totalSupply is 0.

MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"

BURNER_ROLE = "0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848"


# Staking
This is a fork of MasterChef V1 with some code changes from V2 (e.g., economical storage of structure fields), rewritten for the new version of solidity (0.8.11). Bonus functionality is preserved (x10 increase in reward token emission to specified block). 

The migrate() function is replaced by the changeStakeToken() function, which allows owner to change the contract address of the staking token in the specified pool. This function is useful if there is a bug in the initial staking token contract and you want to change it. In order to successfully replace the address, the ovner needs to approve a new token in a sufficient amount (the amount equal to the balance of the old token on the contract) to the Staking contract, and call changeStakeToken(). After that, the contract in that pool will accept and transfer back the new token instead of the old one at a ratio of 1 to 1. An event added to notify when the token changes:
TokenChanged(uint256 pid, address oldTokenAddress, address newTokenAddress)

Some new events also added from V2, which are emitted when changing the configuration (allocation points) of existing pools or adding new ones:
   LogPoolAddition(uint256 indexed pid, uint256 allocPoint, IERC20 indexed stakeToken);
   LogSetPool(uint256 indexed pid, uint256 allocPoint);
   LogUpdatePool(uint256 indexed pid, uint64 lastRewardBlock, uint256 stakedSupply, uint256 accSushiPerShare);

The original tests for the first version of MasterChef have been adapted and added with some new tests for the old and new functionality

Constructor args:
    FuelToken rewardToken - address of the FuelToken contract
    uint256 rewardPerBlock - amount of FuelToken minted per block
    uint256 startBlock - the block number when reward mining starts
    uint256 bonusEndBlock - block number when bonus reward period ends

# Deploy
Deploy is done with the command:
npx hardhat run --network "bsc-testnet" scripts/deploy.js

Verification of contracts is done with the commands: 
npx hardhat verify --network "bsc-testnet" FUEL_ADDRESS --constructor-args fuel_args.js 

npx hardhat verify --network "bsc-testnet" STAKIN_ADDRESS --constructor-args staking_args.js

(you need to change the contract address of the token in staking_args.js when you make a new deploy)


