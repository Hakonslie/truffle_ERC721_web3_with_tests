const Monsters = artifacts.require("Monsters")

module.exports = function(deployer) {
  deployer.deploy(Monsters);
};
