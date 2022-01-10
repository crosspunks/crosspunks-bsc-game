const {
    fuelAddress,
    rewardPerBlock,
    startBlock,
    bonusEndBlock,
} = require("./scripts/deploy.js");

module.exports = [
    "0x97C839d9EB4624368B39cAb153b2038e2c3a6A1F",
    rewardPerBlock,
    startBlock,
    bonusEndBlock
]