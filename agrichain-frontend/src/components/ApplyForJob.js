import React, { useState, useEffect } from "react";
import Web3 from "web3";
import LaborManagement from "../contracts/LaborManagement.json";

const ApplyForJob = () => {
  const [formData, setFormData] = useState({
    name: "",
    laborAddress: "",
    phone: "",
    skills: [{ skillName: "", rating: "" }],
  });
  const [labors, setLabors] = useState([]);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LaborManagement.networks[networkId];
      const contract = new web3.eth.Contract(
        LaborManagement.abi,
        deployedNetwork && deployedNetwork.address
      );

      setAccounts(accounts);
      setContract(contract);
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
        .send({ from: accounts[0], gas: 3000000 }); // Set a higher gas limit
      alert("Labor added successfully!");
      fetchLabors();
    } catch (error) {
      console.error("Error adding labor:", error);
    }
  };

  const fetchLabors = async () => {
    try {
      const laborCount = await contract.methods.laborCount().call();
      const loadedLabors = [];
      for (let i = 1; i <= laborCount; i++) {
        const labor = await contract.methods.getLabor(i).call();
        loadedLabors.push(labor);
      }
      setLabors(loadedLabors);
    } catch (error) {
      console.error("Error fetching labors:", error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchLabors();
    }
  }, [contract]);

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-center text-green-700">
          Apply for Job
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-green-700 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-md"
              required
            />
          </div>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-green-700 font-semibold">
                  Skill
                </label>
                <input
                  type="text"
                  name="skillName"
                  value={skill.skillName}
                  onChange={(e) => handleSkillChange(index, e)}
                  className="w-full p-2 border border-green-300 rounded-md"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-green-700 font-semibold">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={skill.rating}
                  onChange={(e) => handleSkillChange(index, e)}
                  className="w-full p-2 border border-green-300 rounded-md"
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
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
          >
            Add Skill
          </button>
          <div>
            <label className="block text-green-700 font-semibold">
              Address
            </label>
            <input
              type="text"
              name="laborAddress"
              value={formData.laborAddress}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-green-700 font-semibold">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-green-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
          >
            Submit
          </button>
        </form>
        {/* <div className="mt-8">
          <h3 className="mb-4 text-2xl font-bold text-center text-green-700">
            Labor List
          </h3>
          {labors.map((labor, index) => (
            <div
              key={index}
              className="mb-4 p-4 bg-green-50 rounded-lg shadow-lg"
            >
              <h4 className="text-xl font-bold text-green-700">{labor.name}</h4>
              <p className="text-green-700">
                <strong>Address:</strong> {labor.laborAddress}
              </p>
              <p className="text-green-700">
                <strong>Phone:</strong> {labor.phone}
              </p>
              <ul className="list-disc list-inside text-green-700">
                {labor.skillNames.map((skill, idx) => (
                  <li key={idx}>
                    {skill} - {labor.ratings[idx]} / 5
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default ApplyForJob;
