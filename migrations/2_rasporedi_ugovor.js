const TokenFarma = artifacts.require("TokenFarma");

module.exports = function(deployer) { // Za migraciju pametnog ugovora u blockchain
  deployer.deploy(TokenFarma);
};
