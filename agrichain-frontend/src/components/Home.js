import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getWeb3,
  getContract,
  Farmer,
  Marketplace,
  Labor,
  Admin,
  Articles,
  JobMarket,
} from "../contracts.js";

const Home = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contracts, setContracts] = useState({});

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const farmerContract = await getContract(web3, Farmer);
      const marketplaceContract = await getContract(web3, Marketplace);
      const laborContract = await getContract(web3, Labor);
      const adminContract = await getContract(web3, Admin);
      const articlesContract = await getContract(web3, Articles);
      const jobMarketContract = await getContract(web3, JobMarket);

      setWeb3(web3);
      setAccounts(accounts);
      setContracts({
        farmerContract,
        marketplaceContract,
        laborContract,
        adminContract,
        articlesContract,
        jobMarketContract,
      });
    };
    init();
  }, []);

  return (
    <>
      <div
        className="bg-cover bg-center h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('../../images/AgriBg-4.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4 text-lime-200">
            Welcome to AgriChain
          </h1>
          <p className="text-lg mb-8 text-gray-200">
            Your one-stop solution for modernizing agriculture practices.
          </p>
          <div className="flex justify-center">
            <Link
              to="/signup"
              className="m-4 rounded-full bg-gradient-to-r from-lime-400 via-green-500 to-emerald-500  hover:shadow-slate-200 hover:shadow-md"
            >
              <span className="block text-black px-4 py-2 font-semibold rounded-full hover:text-black">
                Register Now
              </span>
            </Link>
            <Link
              to="/aboutus"
              className="m-4 p-1 rounded-full bg-gradient-to-r from-lime-400 via-green-500 to-emerald-500 hover:shadow-slate-200 hover:shadow-md"
            >
              <span className="block text-black px-4 py-2 font-semibold rounded-full bg-white hover:bg-gradient-to-r from-lime-400 hover:via-green-500 hover:to-emerald-500 hover:text-white">
                Learn More
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-lime-100 via-gray-800 to-black">
        <footer className="text-gray-500 body-font">
          <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
            <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
              <img
                src="./images/logo-transparent-png2.png"
                alt=""
                className="w-40 h-40 mx-8"
              />
            </div>
            <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
              <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                <h2 className="title-font font-medium text-yellow-300 tracking-widest text-sm mb-3">
                  FARMER SERVICES
                </h2>
                <nav className="list-none mb-10">
                  <li>
                    <Link
                      to="/sell-products"
                      className="text-gray-900 hover:text-green-500"
                    >
                      Sell Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/view-articles"
                      className="text-gray-900 hover:text-green-500"
                    >
                      View Articles
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/job-market"
                      className="text-gray-900 hover:text-green-500"
                    >
                      Job Market
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/farmer-resources"
                      className="text-gray-900 hover:text-green-500"
                    >
                      Farmer Resources
                    </Link>
                  </li>
                </nav>
              </div>
              <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                <h2 className="title-font font-medium text-yellow-300 tracking-widest text-sm mb-3">
                  CUSTOMER SERVICES
                </h2>
                <nav className="list-none mb-10">
                  <li>
                    <Link
                      to="/marketplace"
                      className="text-gray-500 hover:text-green-500"
                    >
                      Marketplace
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/view-articles"
                      className="text-gray-500 hover:text-green-500"
                    >
                      View Articles
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/customer-support"
                      className="text-gray-500 hover:text-green-500"
                    >
                      Customer Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/customer-resources"
                      className="text-gray-500 hover:text-green-500"
                    >
                      Customer Resources
                    </Link>
                  </li>
                </nav>
              </div>

              <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                <h2 className="title-font font-medium text-yellow-300 tracking-widest text-sm mb-3">
                  LABOR SERVICES
                </h2>
                <nav className="list-none mb-10">
                  <li>
                    <Link
                      to="/labour-register"
                      className="text-gray-500 hover:text-green-500"
                    >
                      Register as Labor
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/job-market"
                      className="text-gray-500 hover:text-green-500"
                    >
                      Job Market
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/labor-support"
                      className="text-gray-500 hover:text-green-500"
                    >
                      Labor Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/labor-resources"
                      className="text-gray-500 hover:text-green-500"
                    >
                      Labor Resources
                    </Link>
                  </li>
                </nav>
              </div>
            </div>
          </div>
          <div className="bg-gray-700">
            <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
              <p className="text-gray-400 text-sm text-center sm:text-left">
                © 2024 AgriChain — All Rights Reserved.
              </p>
              <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
                <Link className="text-gray-400">
                  <svg
                    fill="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-5 h-5 hover:text-black"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                  </svg>
                </Link>
                <Link className="ml-3 text-gray-400">
                  <svg
                    fill="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-5 h-5 hover:text-black"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                  </svg>
                </Link>
                <Link className="ml-3 text-gray-400">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-5 h-5 hover:text-black"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      width="20"
                      height="20"
                      x="2"
                      y="2"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                  </svg>
                </Link>
                <Link className="ml-3 text-gray-400">
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="0"
                    className="w-5 h-5 hover:text-black"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="none"
                      d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                    ></path>
                    <circle cx="4" cy="4" r="2" stroke="none"></circle>
                  </svg>
                </Link>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
