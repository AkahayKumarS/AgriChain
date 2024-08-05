import React, { useState, useEffect } from "react";
import Web3 from "web3";
import JobManagement from "../contracts/AgriJobs.json";

const AgriJobsComponent = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    jobLocation: "",
    contactNumber: "",
    wage: 0,
  });
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = JobManagement.networks[networkId];
          const contract = new web3.eth.Contract(
            JobManagement.abi,
            deployedNetwork && deployedNetwork.address
          );

          setAccounts(accounts);
          setContract(contract);
        } catch (error) {
          console.error("Failed to connect with MetaMask", error);
          alert("Please install MetaMask or ensure it is connected.");
        }
      } else {
        alert("MetaMask is not installed.");
      }
    };

    initWeb3();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { jobTitle, jobDescription, jobLocation, contactNumber, wage } =
      formData;

    try {
      await contract.methods
        .postJob(
          jobTitle,
          jobDescription,
          jobLocation,
          contactNumber,
          Web3.utils.toWei(wage.toString(), "ether")
        )
        .send({ from: accounts[0], gas: 3000000 });
      alert("Job posted successfully!");
      setFormData({
        jobTitle: "",
        jobDescription: "",
        jobLocation: "",
        contactNumber: "",
        wage: 0,
      });
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Error posting job");
    }
  };

  return (
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('../../images/login-bg1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md mx-auto p-8 bg-gray-200 bg-opacity-80 border rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-lime-700 mb-6 text-center">
          Post a Job
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="jobTitle"
            id="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Job Title"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
          <textarea
            name="jobDescription"
            id="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Job Description"
            rows={4}
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
          <input
            type="text"
            name="jobLocation"
            id="jobLocation"
            value={formData.jobLocation}
            onChange={handleChange}
            placeholder="Job Location"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
          <input
            type="text"
            name="contactNumber"
            id="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
          <input
            type="number"
            name="wage"
            id="wage"
            value={formData.wage}
            onChange={handleChange}
            placeholder="Wage"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-lime-500 via-gray-700 to-black text-white py-3 px-4 rounded hover:bg-gradient-to-l hover:from-black hover:via-gray-700 hover:to-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500 mb-2"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgriJobsComponent;
