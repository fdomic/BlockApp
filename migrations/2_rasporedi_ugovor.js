
const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarma = artifacts.require("TokenFarma");

module.exports = async function(deployer, network, accounts) { // Za migraciju pametnog ugovora u blockchain
  
  // Dai token
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()
  
  // Dapp token
  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()
  
  // Token farma
  await deployer.deploy(TokenFarma, dappToken.address, daiToken.address)
  const tokenFarma = await TokenFarma.deployed()
  
  // premjesti sve tokene
  await dappToken.transfer(tokenFarma.address, '1000000000000000000000000')

  // premjesti 100 Dai tokena u investor
  await daiToken.transfer(accounts[1], '100000000000000000000')


};
