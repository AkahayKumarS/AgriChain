import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ProductMarketplace from "../contracts/ProductMarketplace.json";
import { create } from "ipfs-http-client";
import { FaSpinner } from "react-icons/fa";

// Initialize IPFS
const ipfs = create({ host: "localhost", port: 5002, protocol: "http" });

const MarketPlace = () => {
  const [products, setProducts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [modal, setModal] = useState({ visible: false, type: "", message: "" });
  const [loadingProductId, setLoadingProductId] = useState(null); // Track loading state per product

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          if (accounts.length === 0) {
            console.error("No accounts found. Please check your wallet.");
            alert("No accounts found. Please check your wallet.");
            return;
          }

          setAccounts(accounts);
          setSelectedAccount(accounts[0]);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = ProductMarketplace.networks[networkId];
          if (!deployedNetwork) {
            console.error("Smart contract not deployed to detected network.");
            alert("Smart contract not deployed to detected network.");
            return;
          }

          const contract = new web3Instance.eth.Contract(
            ProductMarketplace.abi,
            deployedNetwork.address
          );
          setContract(contract);

          const productCount = await contract.methods.productCount().call();
          const loadedProducts = [];
          for (let i = 1; i <= productCount; i++) {
            const product = await contract.methods.products(i).call();
            if (!product.sold) {
              // Only add products that are not sold
              loadedProducts.push({ id: i, ...product });
            }
          }
          setProducts(loadedProducts);
        } else {
          console.error("MetaMask is not installed.");
          alert("MetaMask is not installed. Please install MetaMask.");
        }
      } catch (error) {
        console.error("Error initializing web3 or contract:", error);
        alert("Error initializing web3 or contract: " + error.message);
      }
    };

    init();
  }, []);

  const handleBuyNow = async (productId, price) => {
    try {
      if (!contract || !selectedAccount || !web3) {
        console.error("Contract, selected account, or web3 not initialized.");
        return;
      }

      setLoadingProductId(productId); // Set loading state for the product

      const priceInWei = price;

      const balance = await web3.eth.getBalance(selectedAccount);
      console.log("Account balance (in Wei):", balance);
      console.log("Price (in Wei):", priceInWei);

      if (
        parseFloat(Web3.utils.fromWei(balance, "ether")) <
        parseFloat(Web3.utils.fromWei(priceInWei, "ether"))
      ) {
        console.error("Insufficient funds for this transaction.");
        setModal({
          visible: true,
          type: "failure",
          message: "Insufficient funds for this transaction.",
        });
        setTimeout(
          () => setModal({ visible: false, type: "", message: "" }),
          10000
        );
        setLoadingProductId(null); // Reset loading state
        return;
      }

      await contract.methods
        .purchaseProduct(productId)
        .send({
          from: selectedAccount,
          value: priceInWei,
        })
        .on("transactionHash", function (hash) {
          console.log("Transaction sent:", hash);
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log("Transaction confirmed:", confirmationNumber, receipt);
          setTimeout(() => {
            setModal({
              visible: true,
              type: "success",
              message: "Product purchased successfully!",
            });
          }, 2000);

          // Refresh products after purchase
          const refreshProducts = async () => {
            const productCount = await contract.methods.productCount().call();
            const updatedProducts = [];
            for (let i = 1; i <= productCount; i++) {
              const product = await contract.methods.products(i).call();
              if (!product.sold) {
                // Only add products that are not sold
                updatedProducts.push({ id: i, ...product });
              }
            }
            setProducts(updatedProducts);
          };

          refreshProducts();

          setTimeout(
            () => setModal({ visible: false, type: "", message: "" }),
            10000
          );
        })
        .on("error", function (error) {
          console.error("Error purchasing product:", error);
          setModal({
            visible: true,
            type: "failure",
            message: "Error purchasing product.",
          });
          setTimeout(
            () => setModal({ visible: false, type: "", message: "" }),
            10000
          );
        })
        .finally(() => {
          setLoadingProductId(null); // Reset loading state
        });
    } catch (error) {
      console.error("Error purchasing product:", error);
      setModal({
        visible: true,
        type: "failure",
        message: "Error purchasing product.",
      });
      setTimeout(
        () => setModal({ visible: false, type: "", message: "" }),
        10000
      );
      setLoadingProductId(null); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-gray-900">
      <h2 className="mb-6 text-3xl font-bold text-center text-lime-200">
        Product Marketplace
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-80 ml-3 bg-white border border-gray-100 rounded-lg shadow-lg dark:bg-gradient-to-b from-black  to-gray-500 dark:border-gray-500 hover:shadow-lg hover:shadow-white"
          >
            <img
              className="rounded-t-lg  w-full h-48 object-cover"
              src={
                product.ipfsHash
                  ? `http://127.0.0.1:8081/ipfs/${product.ipfsHash}`
                  : "/default-product-image.jpg"
              }
              alt={product.name}
            />

            <div className="p-5 hover:rounded-2xl ">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-green-700 dark:text-yellow-400">
                {product.name}
              </h5>
              <p className="mb-3 text-gray-300">
                <strong>Description:</strong> {product.description}
              </p>
              <p className="mb-3 text-gray-300">
                <strong>Price:</strong> ₹{" "}
                {Web3.utils.fromWei(product.price, "ether")} .00 /-
              </p>
              <p className="mb-3 text-gray-300">
                <strong>Quantity Left:</strong>{" "}
                {Web3.utils.fromWei(product.quantity, "ether") *
                  1000000000000000000}
              </p>
              <button
                onClick={() => handleBuyNow(product.id, product.price)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-lime-400 rounded-lg hover:bg-green-800 focus:ring-2 focus:outline-none focus:ring-green-300 dark:bg-lime-500 dark:hover:bg-green-500 dark:focus:ring-white"
                disabled={
                  product.sold ||
                  product.quantity === 0 ||
                  loadingProductId === product.id
                }
              >
                {loadingProductId === product.id ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <>
                    {product.sold
                      ? "Sold"
                      : product.quantity === 0
                      ? "Out of Stock"
                      : "Buy Now"}
                    <svg
                      className="w-3.5 h-3.5 ml-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Success Modal */}
      {modal.visible && modal.type === "success" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center transform transition-all duration-300 ease-in-out hover:scale-105">
            <h3 className="text-2xl font-bold text-green-600 mb-4">
              {modal.message}
            </h3>
            <button
              onClick={() =>
                setModal({ visible: false, type: "", message: "" })
              }
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* Failure Modal */}
      {modal.visible && modal.type === "failure" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center transform transition-all duration-300 ease-in-out hover:scale-105">
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              {modal.message}
            </h3>
            <button
              onClick={() =>
                setModal({ visible: false, type: "", message: "" })
              }
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPlace;
