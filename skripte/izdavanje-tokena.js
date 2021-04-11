
const tokenFarma = artifacts.require("tokenFarma");

module.exports = async function(callback) {
  let tokenFarma = await tokenFarma.deployed()
  await tokenFarma.issueTokens()
  
  console.log("Tokeni su izdani!")
  callback()
}