const { ethers } = require("hardhat");


const tokens = (n) => {
  //to convert wei into ethers.
  return ethers.parseUnits(n.toString(), "ether");
};
async function main() {
  //SetUp Account
  const [deployer] = await ethers.getSigners();
  //Deploy shopdapp
  const ShopDapp = await ethers.getContractFactory("ShopDapp");

  const shopdapp = await ShopDapp.deploy();

  await shopdapp.waitForDeployment();

  console.log(`Deployed Shopdapp Contract at: ${shopdapp.target}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
