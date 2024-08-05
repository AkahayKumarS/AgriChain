import Web3 from "web3";
import Farmer from "./contracts/Farmer.json";
import Marketplace from "./contracts/Marketplace.json";
import Labor from "./contracts/LaborManagement.json";
import Admin from "./contracts/Admin.json";
import Articles from "./contracts/Articles.json";
import JobMarket from "./contracts/JobMarket.json";

const getWeb3 = async () => {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  await window.ethereum.enable(); // Enable MetaMask
  return web3;
};

const getContract = async (web3, contractJson) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = contractJson.networks[networkId];
  const contract = new web3.eth.Contract(
    contractJson.abi,
    deployedNetwork && deployedNetwork.address
  );
  return contract;
};

export {
  getWeb3,
  getContract,
  Farmer,
  Marketplace,
  Labor,
  Admin,
  Articles,
  JobMarket,
};
