import { ADDRESS_ZERO, advanceBlock, advanceBlockTo, deploy, getBigNumber, prepare } from "./utilities"
import { assert, expect } from "chai"
import { ethers, waffle } from "hardhat"

const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const BURNER_ROLE = "0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848";

describe("Fuel token tests", function () {

  const name = "Fuel Token";
  const symbol = "FT";

  const accounts = waffle.provider.getWallets();
  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];
  const charlie = accounts[3];

  beforeEach(async function () {
    const FuelFactory = await ethers.getContractFactory("FuelToken");
    this.fuel = await FuelFactory.deploy(name, symbol); 

  })

  describe("Token tests", function () {

    it("should correct set name and symbol", async function () {
      expect(await this.fuel.name()).to.be.equal(name);
      expect(await this.fuel.symbol()).to.be.equal(symbol);
    });

    describe("Mint tests", function () {

      it("should correct mint by minter", async function () {
        const amountToMint = ethers.utils.parseEther('100');
        await this.fuel.grantRole(MINTER_ROLE, alice.address);
        const totalSupplyBefore = await this.fuel.totalSupply();
        const balanceBefore = await this.fuel.balanceOf(bob.address);
        await this.fuel.connect(alice).mint(bob.address, amountToMint);
        const totalSupplyAfter = await this.fuel.totalSupply();
        const balanceAfter = await this.fuel.balanceOf(bob.address);

        expect(totalSupplyAfter.sub(totalSupplyBefore)).to.be.equal(amountToMint);
        expect(balanceAfter.sub(balanceBefore)).to.be.equal(amountToMint);
      });

      it("shouldnt mint if not minter", async function () {
        await expect(this.fuel.connect(bob).mint(alice.address, ethers.utils.parseEther('100'))).to.be.revertedWith("caller is not minter");
      });

    });

    describe("Burn tests", function () {
      const amountToMint = ethers.utils.parseEther('100');

      beforeEach("mint tokens", async function () {
        await this.fuel.grantRole(MINTER_ROLE, alice.address);
        await this.fuel.connect(alice).mint(bob.address, amountToMint);
      });

      it("should correct burn by burner", async function () {
        const amountToBurn = ethers.utils.parseEther('20');
        await this.fuel.grantRole(BURNER_ROLE, alice.address);
        const totalSupplyBefore = await this.fuel.totalSupply();
        const balanceBefore = await this.fuel.balanceOf(bob.address);
        await this.fuel.connect(bob).approve(alice.address, amountToBurn);
        await this.fuel.connect(alice).burn(bob.address, amountToBurn);
        const totalSupplyAfter = await this.fuel.totalSupply();
        const balanceAfter = await this.fuel.balanceOf(bob.address);

        expect(totalSupplyBefore.sub(totalSupplyAfter)).to.be.equal(amountToBurn);
        expect(balanceBefore.sub(balanceAfter)).to.be.equal(amountToBurn);
      });

      it("shouldnt burn if not burner", async function () {
        await expect(this.fuel.connect(bob).burn(alice.address, ethers.utils.parseEther('20'))).to.be.revertedWith("caller is not burner");
      });

      it("shouldnt burn if not approved", async function () {
        await this.fuel.grantRole(BURNER_ROLE, alice.address);
        await expect(this.fuel.connect(alice).burn(alice.address, ethers.utils.parseEther('20'))).to.be.revertedWith("not enough allowance");
      });
      

    });
  })

  
  
})
