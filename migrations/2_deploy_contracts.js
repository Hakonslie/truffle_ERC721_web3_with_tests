const WaccoToken = artifacts.require("WaccoToken")

module.exports = function(deployer) {
  deployer.deploy(WaccoToken);
};
