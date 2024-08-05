import React, { useState, useEffect } from "react";
import Web3 from "web3"; // Import Web3 library
import FarmerContractABI from "../contracts/Farmer.json"; // Replace with your ABI file path

const Farmer = ({ accounts }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [products, setProducts] = useState("");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [farmerContract, setFarmerContract] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationFailure, setRegistrationFailure] = useState(false);

  useEffect(() => {
    // Function to initialize Web3 and the smart contract instance
    const initializeWeb3 = async () => {
      try {
        // Modern dapp browsers...
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({
            method: "eth_requestAccounts",
            params: [],
          }); // Request account access

          const networkId = await web3.eth.net.getId();
          const deployedNetwork = FarmerContractABI.networks[networkId];
          const instance = new web3.eth.Contract(
            FarmerContractABI.abi,
            deployedNetwork && deployedNetwork.address
          );

          setFarmerContract(instance);

          const accounts = await web3.eth.getAccounts();
          setCurrentAccount(accounts[0]);
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          const web3 = new Web3(window.web3.currentProvider);
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = FarmerContractABI.networks[networkId];
          const instance = new web3.eth.Contract(
            FarmerContractABI.abi,
            deployedNetwork && deployedNetwork.address
          );

          setFarmerContract(instance);

          const accounts = await web3.eth.getAccounts();
          setCurrentAccount(accounts[0]);
        }
        // Non-dapp browsers...
        else {
          console.log(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
        }
      } catch (error) {
        console.error("Error connecting to Ethereum network:", error);
      }
    };

    initializeWeb3();
  }, []);

  const registerFarmer = async () => {
    try {
      const productsArray = products.split(",").map((item) => item.trim());

      await farmerContract.methods
        .registerFarmer(name, location, productsArray)
        .send({ from: currentAccount });

      console.log("Farmer registered successfully!");
      setRegistrationSuccess(true);

      // Clear success message after 5 seconds (5000 milliseconds)
      setTimeout(() => {
        setRegistrationSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error registering farmer:", error);
      // Handle error as needed
      setRegistrationFailure(true);
      setTimeout(() => {
        setRegistrationFailure(false);
      }, 3000);
    }
  };

  if (!farmerContract) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-center text-green-700">
          Register Farmer
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            value={location}
            required
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Products (comma separated)
          </label>
          <input
            type="text"
            value={products}
            requ
            onChange={(e) => setProducts(e.target.value)}
            placeholder="Products (comma separated)"
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={registerFarmer}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
        >
          Register
        </button>

        {/* Success message */}
        {registrationSuccess && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            Farmer registered successfully!
          </div>
        )}
        {registrationFailure && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            Error registering farmer!
          </div>
        )}
      </div>
    </div>
  );
};

export default Farmer;
