import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import JobManagement from "../contracts/AgriJobs.json";
import AgriChain from "../contracts/AgriChain.json";
import { useNavigate } from "react-router-dom";

const AvailableJobsComponent = () => {
  const [jobs, setJobs] = useState([]);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [userCategory, setUserCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const [web3, setWeb3] = useState(null);
  const [currentAccount, setCurrentAccount] = useState("");

  const loadBlockchainData = useCallback(async () => {
    if (web3) {
      const fetchedAccounts = await web3.eth.getAccounts();
      setAccounts(fetchedAccounts);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AgriChain.networks[networkId];
      const agriChainContract = new web3.eth.Contract(
        AgriChain.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(agriChainContract);

      const user = await agriChainContract.methods
        .users(fetchedAccounts[0])
        .call();
      setUserCategory(user.category);
    }
  }, [web3]);

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

    loadWeb3();
  }, []);

  useEffect(() => {
    if (web3) {
      const fetchAccounts = async () => {
        const fetchedAccounts = await web3.eth.getAccounts();
        if (fetchedAccounts[0] !== currentAccount) {
          setCurrentAccount(fetchedAccounts[0]);
          loadBlockchainData(); // Reload blockchain data when account changes
        }
      };

      fetchAccounts();
    }
  }, [web3, currentAccount, loadBlockchainData]);

  useEffect(() => {
    if (contract) {
      fetchJobs();
    }
  }, [contract]);

  const fetchJobs = async () => {
    try {
      const jobManagementNetwork =
        JobManagement.networks[await web3.eth.net.getId()];
      const jobManagementContract = new web3.eth.Contract(
        JobManagement.abi,
        jobManagementNetwork && jobManagementNetwork.address
      );

      const jobCount = await jobManagementContract.methods.jobCount().call();
      const loadedJobs = [];
      for (let i = 1; i <= jobCount; i++) {
        const job = await jobManagementContract.methods.fetchJob(i).call();
        // Only include jobs that are available
        if (job[7]) {
          loadedJobs.push({
            id: job[0] || "N/A",
            title: job[2] || "No Title",
            description: job[3] || "No Description",
            location: job[4] || "No Location",
            contactNumber: job[5] || "No Contact",
            wage: job[6] || "0",
            isAvailable: job[7],
            farmer: job[1],
          });
        }
      }
      setJobs(loadedJobs);
    } catch (error) {
      alert("Error fetching jobs");
      console.error("Error fetching jobs:", error);
    }
  };

  const handleApply = async () => {
    if (userCategory === "labor") {
      navigate("/labour-register");
    } else {
      setModalMessage("Please register as Labour to apply for the job.");
      setShowModal(true);
    }
  };

  const handleRemoveJob = async (jobId) => {
    try {
      // Check if user is admin or the farmer who posted the job
      if (userCategory === "admin" || userCategory === "farmer") {
        // Ensure the correct job management contract is used
        const jobManagementNetwork =
          JobManagement.networks[await web3.eth.net.getId()];
        const jobManagementContract = new web3.eth.Contract(
          JobManagement.abi,
          jobManagementNetwork && jobManagementNetwork.address
        );

        // Call the contract method to mark the job as unavailable
        await jobManagementContract.methods
          .markJobAsUnavailable(jobId)
          .send({ from: currentAccount });

        // Refresh job list after removal
        fetchJobs();
      } else {
        setModalMessage("You are not authorized to remove this job.");
        setShowModal(true);
      }
    } catch (error) {
      alert("Error removing job");
      console.error("Error removing job:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center sm:px-6 lg:px-8 bg-gray-900 m-0">
      <div className="max-w-6xl w-full p-8">
        <h2 className="mb-6 text-3xl font-bold text-center text-lime-200">
          Available Jobs
        </h2>
        <div className="mb-4 text-lime-300">
          <p className="text-lg font-semibold">
            Total Available Jobs: {jobs.length}
          </p>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 shadow-2xl">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-5">
                  Title
                </th>
                <th scope="col" className="px-6 py-5">
                  Description
                </th>
                <th scope="col" className="px-6 py-5">
                  Location
                </th>
                <th scope="col" className="px-6 py-5">
                  Contact
                </th>
                <th scope="col" className="px-6 py-5">
                  Wage
                </th>
                <th scope="col" className="px-6 py-5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr
                  key={index}
                  className={`odd:bg-gray-200 even:bg-gray-100 hover:bg-gray-300 transition-colors duration-200 border-b dark:border-gray-700 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-800">
                    {job.title || "No Title"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {job.description || "No Description"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {job.location || "No Location"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {job.contactNumber || "No Contact"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    ₹ {Web3.utils.fromWei(job.wage, "ether")}
                  </td>
                  <td className="px-6 py-4">
                    {job.farmer.toLowerCase() ===
                    currentAccount.toLowerCase() ? (
                      <button
                        onClick={() => handleRemoveJob(job.id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={handleApply}
                        className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
                      >
                        Apply
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold text-center mb-4">Attention</h2>
            <p className="text-center mb-6">{modalMessage}</p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableJobsComponent;
