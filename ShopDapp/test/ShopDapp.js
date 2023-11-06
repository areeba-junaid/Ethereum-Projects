const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  //to convert wei into ethers.
  let result = ethers.parseUnits(n.toString(), "ether");
  console.log(result);
  return result;
};

//Global constant for listing an Item
const ID = 1;
const NAME = "Dress";
const CATEGORY = "Clothing";
const IMAGE =
  "https://ipfs.io/ipfs/QmQjexAykqtxQpXnesdEVNfRQDjbYFNqyYibBaRb6RxQMM?filename=black%20dress.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

describe("ShopDapp", function () {
  let shopdapp;
  let deployer, buyer;

  beforeEach(async () => {
    //SetUp Accounts
    [deployer, buyer] = await ethers.getSigners();
    //Deploy Contract
    const ShopDapp = await ethers.getContractFactory("ShopDapp");
    shopdapp = await ShopDapp.deploy();
    console.log("Contract Address", shopdapp.target);
  });

  describe("Deployment", function () {
    it("Sets the Owner", async () => {
      expect(deployer.address).to.equal(await shopdapp.owner());
    });
  });

  describe("Listing", function () {
    let transaction;
    beforeEach(async () => {
      //List an Item
      transaction = await shopdapp
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();
    });

    it("return item attributes", async () => {
      const item = await shopdapp.items(ID);

      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    });

    it("it emits list events", async () => {
      expect(transaction).to.emit(shopdapp, "List");
    });
  });

  describe("Buying", () => {
    let transaction;
    beforeEach(async () => {
      //List an Item
      transaction = await shopdapp
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      //Buy an Item
      transaction = await shopdapp.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();
    });

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(shopdapp.target);
      console.log(result);
      expect(result).to.equal(COST);
    });
    it("updates buyer Order Count", async () => {
      const count = await shopdapp.orderCount(buyer.address);
      expect(count).to.equal(1);
    });

    it("adds the order", async () => {
      order = await shopdapp.orders(buyer.address, ID);
      expect(order.time).to.be.greaterThan(0);
      expect(order.item.name).to.equal(NAME);
    });
    it("Emits Buy event", async () => {
      expect(transaction).to.emit(shopdapp, "Buy");
    });
  });
  describe("Withdram Earning", function () {
    let balanceBefore;

    beforeEach(async () => {
      // List a item
      let transaction = await shopdapp
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      // Buy a item
      transaction = await shopdapp.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();

      // Get Deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      // Withdraw
      transaction = await shopdapp.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });
    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(shopdapp.target);
      expect(result).to.equal(0);
    });
  });
});
