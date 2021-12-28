import { ADDRESS_ZERO, advanceBlock, advanceBlockTo, deploy, getBigNumber, prepare } from "./utilities"
import { assert, expect } from "chai"
import { ethers } from "hardhat"

describe("Fuel tests", function () {

  const name = "Fuel Token";
  const symbol = "FT";

  beforeEach(async function () {
    const FuelFactory = await ethers.getContractFactory("FuelToken");
    this.fuel = await FuelFactory.deploy(name, symbol); 

  })

  describe("Fuel tests", function () {
    it("should correct set name and symbol", async function () {
      expect(await this.fuel.name()).to.be.equal(name);
      expect(await this.fuel.symbol()).to.be.equal(symbol);
    })
  })

  
  
})
