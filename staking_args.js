const {
    fuelAddress,
    rewardPerBlock,
    startBlock,
    bonusEndBlock,
} = require("./scripts/deploy.js");

module.exports = [
    "0xF4d61DEa94EddA4A2b3b469AF4313f0D499C86C9",
    rewardPerBlock,
    startBlock,
    bonusEndBlock
]