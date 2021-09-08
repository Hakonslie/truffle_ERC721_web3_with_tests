const WaccoTobaccoToken = artifacts.require("WaccoTobaccoToken")

module.exports = function(deployer) {
  deployer.deploy(WaccoTobaccoToken, 10000);
};
