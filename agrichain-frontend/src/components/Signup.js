import React, { useState, useEffect } from "react";
import Web3 from "web3";
import AgriChain from "../contracts/AgriChain.json"; // Adjust the path as necessary
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [category, setCategory] = useState("select category");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

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

  const validateForm = () => {
    // Check if all fields are filled out
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      category === "select category" ||
      !termsAccepted
    ) {
      return "Please fill out all fields and accept the terms of service.";
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    // Email validation
    if (!email.includes("@")) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const handleSignUp = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      await contract.methods
        .signUp(username, email, password, category)
        .send({ from: accounts[0] });

      // Reset form and state after successful signup
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setCategory("select category");
      setTermsAccepted(false);
      setError("");
      setSuccess("You have successfully signed up!");

      // Redirect to login page after a short delay
      setTimeout(() => {
        setSuccess("");
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError("An error occurred during sign up.");
      setSuccess("");
      setTimeout(() => {
        setError("");
      }, 3000);
      console.error("Sign up error:", error);
    }
  };

  return (
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('../../images/signup-bg1.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md mx-auto p-8 bg-gray-200 bg-opacity-80 border rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-lime-700 mb-6 text-center">
          Sign Up
        </h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
        <select
          name="category"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-400"
        >
          <option value="select category">Select Category</option>
          <option value="farmer">Farmer</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="labor">Labor</option>
        </select>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
        />
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mr-2 focus:ring-2 focus:ring-lime-500"
          />
          <span className="text-gray-700">
            I accept the{" "}
            <a href="#" className="text-lime-700 underline">
              terms of service
            </a>
            .
          </span>
        </label>
        {error && (
          <p className="text-red-600 mb-4 bg-red-300 p-2 ring-2 ring-red-600 rounded-sm text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-800 mb-4 bg-green-300 p-2 ring-2 ring-lime-700 rounded-sm text-center">
            {success}
          </p>
        )}
        <button
          onClick={handleSignUp}
          className="w-full bg-gradient-to-r from-lime-500 via-gray-700 to-black text-white py-3 px-4 rounded hover:bg-gradient-to-l hover:from-black hover:via-gray-700 hover:to-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500 mb-2"
        >
          Sign Up
        </button>
        <p className="text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-lime-700 underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
