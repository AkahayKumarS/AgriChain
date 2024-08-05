import React, { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import Web3 from "web3";
import ProductMarketplace from "../contracts/ProductMarketplace.json"; // Adjust the path to your contract JSON

const SellProduct = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");

  // Initialize IPFS with localhost settings
  const ipfs = create({ host: "localhost", port: 5002, protocol: "http" });

  const captureFile = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const fileBuffer = await ipfs.add(reader.result); // Add file directly to IPFS
        setIpfsHash(fileBuffer.path);
        console.log("IPFS Hash:", fileBuffer.path);
      } catch (error) {
        console.error("Error adding file to IPFS:", error);
      }
    };

    reader.readAsArrayBuffer(file); // Read the file as array buffer
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (web3 && contract) {
        await contract.methods
          .addProduct(
            productName,
            productDescription,
            web3.utils.toWei(productPrice, "ether"),
            productQuantity,
            ipfsHash
          )
          .send({ from: accounts[0] });
        alert("Product added successfully!");
        // Clear form fields after successful submission
        setProductName("");
        setProductDescription("");
        setProductPrice("");
        setProductQuantity("");
        setIpfsHash("");
        document.getElementById("productImage").value = null; // Reset file input
      } else {
        alert("Web3 or contract not loaded!");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Check console for details.");
    }
  };

  // Load web3 and contract data
  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({
          method: "eth_requestAccounts",
          params: [],
        });
        setWeb3(web3);
      } else {
        alert("Please install MetaMask to use this dApp!");
      }
    };

    const loadBlockchainData = async () => {
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ProductMarketplace.networks[networkId];
        const contractInstance = new web3.eth.Contract(
          ProductMarketplace.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contractInstance);
      }
    };

    loadWeb3();
    loadBlockchainData();
  }, [web3]);

  return (
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('../../images/sell.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md mx-auto p-8 bg-gray-200 bg-opacity-80 border rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-lime-700 mb-6 text-center">
          Sell Your Product
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product Name"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
          <input
            type="text"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Price (in ETH)"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
          <input
            type="text"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            placeholder="Quantity"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
          <input
            type="file"
            id="productImage"
            name="productImage"
            onChange={captureFile}
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-lime-500 via-gray-700 to-black text-white py-3 px-4 rounded hover:bg-gradient-to-l hover:from-black hover:via-gray-700 hover:to-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500 mb-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellProduct;
