import React, { useState } from "react";

const Admin = ({ adminContract, web3, accounts }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const addMachinery = async () => {
    await adminContract.methods
      .addMachinery(name, web3.utils.toWei(price, "ether"))
      .send({ from: accounts[0] });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900">
          Admin Panel
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Machinery Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Machinery Name"
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Price (ETH)
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price (ETH)"
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={addMachinery}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          Add Machinery
        </button>
      </div>
    </div>
  );
};

export default Admin;
