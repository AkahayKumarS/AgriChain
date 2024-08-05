import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import LaborManagement from "../contracts/LaborManagement.json";
import AgriChain from "../contracts/AgriChain.json";

const JobMarket = () => {
  const [labors, setLabors] = useState([]);
  const [laborCount, setLaborCount] = useState(0);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [userCategory, setUserCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
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
      fetchLabors();
    }
  }, [contract]);

  const fetchLabors = async () => {
    try {
      const laborManagementNetwork =
        LaborManagement.networks[await web3.eth.net.getId()];
      const laborManagementContract = new web3.eth.Contract(
        LaborManagement.abi,
        laborManagementNetwork && laborManagementNetwork.address
      );

      const laborCount = await laborManagementContract.methods
        .laborCount()
        .call();
      setLaborCount(laborCount);

      const loadedLabors = [];
      for (let i = 1; i <= laborCount; i++) {
        const labor = await laborManagementContract.methods.getLabor(i).call();
        if (labor.isAvailable) {
          loadedLabors.push({
            id: i,
            name: labor.name,
            laborAddress: labor.laborAddress,
            phone: labor.phone,
            skillNames: labor.skillNames,
            ratings: labor.ratings,
            laborOwner: labor.laborOwner,
          });
        }
      }

      setLabors(loadedLabors);
    } catch (error) {
      console.error("Error fetching labors:", error);
      alert("Error fetching labors");
    }
  };

  const hireLabor = async (phone) => {
    if (userCategory === "farmer") {
      try {
        const response = await fetch("http://localhost:3001/send-sms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: phone,
            message:
              "A farmer is interested in hiring you. Please contact them for more details.",
          }),
        });

        const data = await response.json();
        if (data.success) {
          alert("SMS sent successfully!");
        } else {
          alert("Error sending SMS");
          console.error("Error sending SMS:", data.error);
        }
      } catch (error) {
        alert("Error sending SMS");
        console.error("Error sending SMS:", error);
      }
    } else {
      setModalMessage("Please register as a farmer to hire labor.");
      setShowModal(true);
    }
  };

  const removeLabor = async (laborId) => {
    try {
      if (userCategory === "labor") {
        const laborManagementNetwork =
          LaborManagement.networks[await web3.eth.net.getId()];
        const laborManagementContract = new web3.eth.Contract(
          LaborManagement.abi,
          laborManagementNetwork && laborManagementNetwork.address
        );

        await laborManagementContract.methods
          .markLaborAsUnavailable(laborId)
          .send({ from: currentAccount });

        fetchLabors();
      } else {
        setModalMessage("You are not authorized to remove this labor.");
        setShowModal(true);
      }
    } catch (error) {
      alert("Error removing labor");
      console.error("Error removing labor:", error);
    }
  };

  const renderStars = (rating) => {
    const fullStar = "★";
    const emptyStar = "☆";
    const starCount = 5;
    let stars = "";

    for (let i = 0; i < starCount; i++) {
      stars += i < rating ? fullStar : emptyStar;
    }

    return stars;
  };

  return (
    <div className="flex flex-col items-center justify-center sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-6xl w-full p-8">
        <h2 className="mb-6 text-3xl font-bold text-center text-lime-200">
          Labour Lists
        </h2>

        <div className="mb-4 text-lg text-lime-200">
          <span>Total Available Labors: </span>
          <span className="font-bold">{labors.length}</span>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 shadow-2xl">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-5">
                  Name
                </th>
                <th scope="col" className="px-6 py-5">
                  Address
                </th>
                <th scope="col" className="px-6 py-5">
                  Phone
                </th>
                <th scope="col" className="px-6 py-5">
                  Skills
                </th>
                <th scope="col" className="px-6 py-5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {labors.length > 0 ? (
                labors.map((labor) => (
                  <tr
                    key={labor.id}
                    className={`odd:bg-gray-200 even:bg-gray-100 hover:bg-gray-300 transition-colors duration-200 border-b dark:border-gray-700 ${
                      labor.id % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-800">
                      {labor.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {labor.laborAddress}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{labor.phone}</td>
                    <td className="px-6 py-4">
                      <ul className="list-disc list-inside text-gray-700">
                        {labor.skillNames &&
                          labor.skillNames.map((skill, idx) => (
                            <li key={idx}>
                              {skill}{" "}
                              <span className="text-yellow-500 text-lg">
                                {renderStars(labor.ratings[idx])}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4">
                      {labor.laborOwner.toLowerCase() ===
                      currentAccount.toLowerCase() ? (
                        <button
                          onClick={() => removeLabor(labor.id)}
                          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => hireLabor(labor.phone)}
                          className="bg-lime-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
                        >
                          Hire Labor
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No labor available at the moment.
                  </td>
                </tr>
              )}
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

export default JobMarket;
