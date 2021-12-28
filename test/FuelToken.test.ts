import { ADDRESS_ZERO, advanceBlock, advanceBlockTo, deploy, getBigNumber, prepare } from "./utilities"
import { assert, expect } from "chai"
import { ethers, waffle } from "hardhat"

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

      it("should correct add minter", async function () {
        await this.fuel.addMinter(alice.address);
        expect(await this.fuel.isMinter(alice.address)).to.be.true;
      });

      it("should correct mint by minter", async function () {
        const amountToMint = ethers.utils.parseEther('100');
        await this.fuel.addMinter(alice.address);
        const totalSupplyBefore = await this.fuel.totalSupply();
        const balanceBefore = await this.fuel.balanceOf(bob.address);
        await this.fuel.connect(alice).mint(bob.address, amountToMint);
        const totalSupplyAfter = await this.fuel.totalSupply();
        const balanceAfter = await this.fuel.balanceOf(bob.address);

        expect(totalSupplyAfter.sub(totalSupplyBefore)).to.be.equal(amountToMint);
        expect(balanceAfter.sub(balanceBefore)).to.be.equal(amountToMint);
      });

      it("should correct remove minter", async function () {
        await this.fuel.addMinter(alice.address);
        await this.fuel.removeMinter(alice.address);
        expect(await this.fuel.isMinter(alice.address)).to.be.false;
        await expect(this.fuel.connect(alice).mint(bob.address, ethers.utils.parseEther('100'))).to.be.revertedWith("caller is not minter");

      });

      it("shouldnt mint if not minter", async function () {
        await expect(this.fuel.connect(bob).mint(alice.address, ethers.utils.parseEther('100'))).to.be.revertedWith("caller is not minter");
      });

    });

    describe("Burn tests", function () {
      const amountToMint = ethers.utils.parseEther('100');

      beforeEach("mint tokens", async function () {
        await this.fuel.addMinter(alice.address);
        await this.fuel.connect(alice).mint(bob.address, amountToMint);
      });

      it("should correct add burner", async function () {
        await this.fuel.addBurner(alice.address);
        expect(await this.fuel.isBurner(alice.address)).to.be.true;
      });

      it("should correct burn by burner", async function () {
        const amountToBurn = ethers.utils.parseEther('20');
        await this.fuel.addBurner(alice.address);
        const totalSupplyBefore = await this.fuel.totalSupply();
        const balanceBefore = await this.fuel.balanceOf(bob.address);
        await this.fuel.connect(bob).approve(alice.address, amountToBurn);
        await this.fuel.connect(alice).burn(bob.address, amountToBurn);
        const totalSupplyAfter = await this.fuel.totalSupply();
        const balanceAfter = await this.fuel.balanceOf(bob.address);

        expect(totalSupplyBefore.sub(totalSupplyAfter)).to.be.equal(amountToBurn);
        expect(balanceBefore.sub(balanceAfter)).to.be.equal(amountToBurn);
      });

      it("should correct remove burner", async function () {
        await this.fuel.addBurner(alice.address);
        await this.fuel.removeBurner(alice.address);
        expect(await this.fuel.isBurner(alice.address)).to.be.false;
        await expect(this.fuel.connect(alice).burn(bob.address, ethers.utils.parseEther('20'))).to.be.revertedWith("caller is not burner");
      });

      it("shouldnt burn if not burner", async function () {
        await expect(this.fuel.connect(bob).burn(alice.address, ethers.utils.parseEther('20'))).to.be.revertedWith("caller is not burner");
      });

      it("shouldnt burn if not approved", async function () {
        await this.fuel.addBurner(alice.address);
        await expect(this.fuel.connect(alice).burn(alice.address, ethers.utils.parseEther('20'))).to.be.revertedWith("not enough allowance");
      });
      

    });
  })

  
  
})
