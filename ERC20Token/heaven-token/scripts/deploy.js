const { ethers } = require("hardhat");

async function main() {
  const Contract = await ethers.getContractFactory("HeavenToken");
  const contract = await Contract.deploy(100000000, 50);

  await contract.waitForDeployment();

  console.log(` deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
