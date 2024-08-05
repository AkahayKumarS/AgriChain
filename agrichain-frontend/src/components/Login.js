import React, { useState, useEffect } from "react";
import Web3 from "web3";
import AgriChain from "../contracts/AgriChain.json"; // Adjust the path as necessary
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadWeb3() {
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
    }

    async function loadBlockchainData() {
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = AgriChain.networks[networkId];
        const contractInstance = new web3.eth.Contract(
          AgriChain.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contractInstance);
      }
    }

    loadWeb3();
    loadBlockchainData();
  }, [web3]);

  const handleLogin = async () => {
    try {
      const isAuthenticated = await contract.methods
        .login(email, password)
        .call({ from: accounts[0] });

      if (isAuthenticated) {
        setError("");
        setModalMessage("Login successful!");
        setShowModal(true);

        // Redirect to the user's dashboard or home page after a short delay
        setTimeout(() => {
          setShowModal(false);
          navigate("/");
          window.location.reload();
          // Adjust the path as necessary
        }, 2000);
      } else {
        setError("Invalid email or password.");
        setModalMessage("Invalid email or password.");
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      }
    } catch (error) {
      setError("An error occurred during login.");
      setModalMessage("An error occurred during login.");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      console.error("Login error:", error);
    }
  };

  return (
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('../../images/login-bg3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md mx-auto p-8 bg-gray-200 bg-opacity-80 border rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-lime-800 mb-6 text-center">
          Sign In
        </h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-lime-500 via-gray-700 to-black text-white py-3 px-4 rounded hover:bg-gradient-to-l hover:from-black hover:via-gray-700 hover:to-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500 mb-2"
        >
          Sign In
        </button>
        <p className="text-center text-gray-700 mt-4">
          Don’t have an account yet?{" "}
          <Link to="/signup" className="text-lime-700 underline">
            Sign up
          </Link>
        </p>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-center">{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
