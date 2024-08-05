import React, { useState, useEffect } from "react";
import Web3 from "web3";
import LaborManagement from "../contracts/LaborManagement.json";

const LaborRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    laborAddress: "",
    phone: "",
    skills: [{ skillName: "", rating: "" }],
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
          const deployedNetwork = LaborManagement.networks[networkId];
          const contract = new web3.eth.Contract(
            LaborManagement.abi,
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

  const handleSkillChange = (index, e) => {
    const { name, value } = e.target;
    const newSkills = [...formData.skills];
    newSkills[index][name] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  const handleAddSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { skillName: "", rating: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, laborAddress, phone, skills } = formData;
    const skillNames = skills.map((skill) => skill.skillName);
    const ratings = skills.map((skill) => parseInt(skill.rating, 10));

    try {
      await contract.methods
        .addLabor(name, laborAddress, phone, skillNames, ratings)
        .send({ from: accounts[0], gas: 3000000 });
      alert("Labor added successfully!");
      setFormData({
        name: "",
        laborAddress: "",
        phone: "",
        skills: [{ skillName: "", rating: "" }],
      });
    } catch (error) {
      console.error("Error adding labor:", error);
      alert("Error adding Labour");
    }
  };

  return (
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('../../images/labour.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md mx-auto p-8 bg-gray-200 bg-opacity-80 border rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-lime-700 mb-6 text-center">
          Labor Registration
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="text"
                  name="skillName"
                  value={skill.skillName}
                  onChange={(e) => handleSkillChange(index, e)}
                  placeholder="Skill"
                  className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  name="rating"
                  value={skill.rating}
                  onChange={(e) => handleSkillChange(index, e)}
                  placeholder="Rating"
                  className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
                  min="1"
                  max="5"
                  required
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSkill}
            className="w-full bg-gradient-to-r from-lime-500 via-gray-700 to-black text-white py-3 px-4 rounded hover:bg-gradient-to-l hover:from-black hover:via-gray-700 hover:to-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500 mb-2"
          >
            Add Skill
          </button>
          <input
            type="text"
            name="laborAddress"
            value={formData.laborAddress}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
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

export default LaborRegister;
