const Farmer = artifacts.require("Farmer");
const Marketplace = artifacts.require("Marketplace");
const LaborManagement = artifacts.require("LaborManagement");
const AgriJobs = artifacts.require("AgriJobs");
const Admin = artifacts.require("Admin");
const Articles = artifacts.require("Articles");
const JobMarket = artifacts.require("JobMarket");
const AgriChain = artifacts.require("AgriChain");
const ProductMarketplace = artifacts.require("ProductMarketplace");

module.exports = function (deployer) {
  deployer.deploy(Farmer);
  deployer.deploy(Marketplace);
  deployer.deploy(LaborManagement);
  deployer.deploy(AgriJobs);
  deployer.deploy(Admin);
  deployer.deploy(Articles);
  deployer.deploy(JobMarket);
  deployer.deploy(AgriChain);
  deployer.deploy(ProductMarketplace);
};
