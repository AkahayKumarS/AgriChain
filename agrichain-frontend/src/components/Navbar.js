import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import AgriChain from "../contracts/AgriChain.json"; // Adjust the path to your contract JSON
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [userCategory, setUserCategory] = useState("");
  const [currentAccount, setCurrentAccount] = useState(""); // Track current MetaMask account
  const [userProfile, setUserProfile] = useState(null); // User profile state
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Popup state
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Logout modal state
  const [logoutMessage, setLogoutMessage] = useState(""); // Logout message state
  const navigate = useNavigate(); // For React Router v6

  const [navigationLinks, setNavigationLinks] = useState({
    farmer: [
      { name: "Home", href: "/", current: false },
      { name: "Marketplace", href: "/marketplace", current: false },
      { name: "Sell Products", href: "/sell-products", current: false },
      { name: "Post Jobs", href: "/agrijobs-component", current: false },
      { name: "View Articles", href: "/view-articles", current: false },
      { name: "Job Market", href: "#", current: false, dropdown: true }, // Add dropdown flag
    ],
    labor: [
      { name: "Home", href: "/", current: false },
      { name: "Marketplace", href: "/marketplace", current: false },
      {
        name: "Registration",
        href: "/labour-register",
        current: false,
      },
      { name: "View Articles", href: "/view-articles", current: false },
      { name: "Job Market", href: "#", current: false, dropdown: true }, // Add dropdown flag
    ],
    customer: [
      { name: "Home", href: "/", current: false },
      { name: "Marketplace", href: "/marketplace", current: false },
      { name: "View Articles", href: "/view-articles", current: false },
    ],
    admin: [
      { name: "Home", href: "/", current: false },
      { name: "Post News", href: "/articles", current: false },
      { name: "Job Market", href: "#", current: false, dropdown: true },
    ],
  });

  // Function to load blockchain data
  const loadBlockchainData = useCallback(async () => {
    if (web3) {
      const fetchedAccounts = await web3.eth.getAccounts();
      setAccounts(fetchedAccounts);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AgriChain.networks[networkId];
      const contractInstance = new web3.eth.Contract(
        AgriChain.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(contractInstance);

      const user = await contractInstance.methods
        .users(fetchedAccounts[0])
        .call();
      setUserCategory(user.category);
    }
  }, [web3]);

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    if (contract && currentAccount) {
      const userProfile = await contract.methods.users(currentAccount).call();
      setUserProfile(userProfile);
    }
  };

  // Effect to load web3 and blockchain data on component mount
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

  // Effect to handle changes in MetaMask account
  useEffect(() => {
    if (web3) {
      const fetchAccounts = async () => {
        const fetchedAccounts = await web3.eth.getAccounts();
        if (fetchedAccounts[0] !== currentAccount) {
          setCurrentAccount(fetchedAccounts[0]);
          loadBlockchainData(); // Reload blockchain data when account changes
          navigate("/"); // Navigate to home page on account change
        }
      };

      fetchAccounts();
    }
  }, [web3, currentAccount, loadBlockchainData, navigate]);

  // Function to handle navigation clicks
  const handleNavigation = (href) => {
    navigate(href); // Navigate to the selected link
  };

  // Function to toggle profile popup
  const toggleProfilePopup = async () => {
    if (!isProfileOpen) {
      await fetchUserProfile();
    }
    setIsProfileOpen(!isProfileOpen);
  };

  // Function to sign out
  const handleSignout = () => {
    // Show logout modal with a message
    setLogoutMessage("You have been signed out.");
    setShowLogoutModal(true);

    setTimeout(() => {
      // Clear local state or storage if needed
      setAccounts([]);
      setContract(null);
      setCurrentAccount("");
      setUserProfile(null);
      setIsProfileOpen(false);

      setNavigationLinks({
        admin: [
          { name: "Home", href: "/", current: false },
          { name: "Signup", href: "/signup", current: false },
          { name: "Login", href: "/login", current: false },
        ],
        farmer: [
          { name: "Home", href: "/", current: false },
          { name: "Signup", href: "/signup", current: false },
          { name: "Login", href: "/login", current: false },
        ],
        labor: [
          { name: "Home", href: "/", current: false },
          { name: "Signup", href: "/signup", current: false },
          { name: "Login", href: "/login", current: false },
        ],
        customer: [
          { name: "Home", href: "/", current: false },
          { name: "Signup", href: "/signup", current: false },
          { name: "Login", href: "/login", current: false },
        ],
      });

      navigate("/");

      // Hide the modal after a short delay
      setTimeout(() => {
        setShowLogoutModal(false);
      }, 2000);
    }, 2000);
  };

  window.ethereum.on("accountsChanged", async () => {
    // Do something
    window.location.reload();
  });

  return (
    <div className="bg-gradient-to-r from-lime-100 via-gray-800 to-black sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 shadow-md shadow-gray-500">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              {/* Insert your menu button icon here */}
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-20 w-auto"
                src="./images/logo-transparent-png.png"
                alt="AgriChain"
              />
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4 py-5">
                {navigationLinks[userCategory]?.map((item) =>
                  item.dropdown ? (
                    <Menu as="div" key={item.name} className="relative">
                      {({ open }) => (
                        <>
                          <MenuButton
                            as="button"
                            className={classNames(
                              open
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-md font-medium focus:outline-none"
                            )}
                          >
                            {item.name}
                          </MenuButton>
                          <MenuItems className="absolute z-10 mt-3 w-36 origin-top-right rounded-md bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <MenuItem>
                                {({ active }) => (
                                  <a
                                    onClick={() =>
                                      handleNavigation("/job-market")
                                    }
                                    className={classNames(
                                      active ? "bg-gray-600" : "",
                                      "block px-4 py-2 text-sm text-gray-100"
                                    )}
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  >
                                    Available Labours
                                  </a>
                                )}
                              </MenuItem>
                              <MenuItem>
                                {({ active }) => (
                                  <a
                                    onClick={() =>
                                      handleNavigation("/available-jobs")
                                    }
                                    className={classNames(
                                      active ? "bg-gray-600" : "",
                                      "block px-4 py-2 text-sm text-gray-100"
                                    )}
                                    style={{
                                      cursor: "pointer",
                                    }}
                                  >
                                    Available Jobs
                                  </a>
                                )}
                              </MenuItem>
                            </div>
                          </MenuItems>
                        </>
                      )}
                    </Menu>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-md font-medium focus:outline-none"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <MenuButton
                    as="button"
                    className={classNames(
                      open
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-md font-medium focus:outline-none"
                    )}
                  >
                    <img
                      className="h-8 w-8"
                      src="./images/boy.png"
                      alt="User Profile"
                    />
                  </MenuButton>
                  <MenuItems className="fixed top-16 right-0 z-10 mr-4 w-36 origin-top-right rounded-md bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-2 focus:outline-none">
                    <MenuItem>
                      {({ active }) => (
                        <a
                          onClick={toggleProfilePopup} // Toggle profile popup on click
                          className={classNames(
                            active ? "bg-gray-600" : "",
                            "block px-4 py-2 text-sm text-gray-100"
                          )}
                          style={{ cursor: "pointer" }}
                        >
                          Your Profile
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <a
                          onClick={handleSignout} // Sign out on click
                          className={classNames(
                            active ? "bg-gray-600" : "",
                            "block px-4 py-2 text-sm text-gray-100"
                          )}
                          style={{ cursor: "pointer" }}
                        >
                          Sign out
                        </a>
                      )}
                    </MenuItem>
                  </MenuItems>
                </>
              )}
            </Menu>
          </div>
        </div>
      </div>
      {isProfileOpen && userProfile && (
        <div className="fixed top-16 right-0 flex z-20 ">
          <div className=" bg-gradient-to-b from-gray-600  to-black sm:px-6 lg:px-8 hover:shadow-md shadow-white text-slate-300 rounded-lg p-6 w-96 max-w-sm">
            <h2 className="text-lg font-bold mb-4">User Profile</h2>
            <p className="mb-2">
              <strong>Username:</strong> {userProfile.username}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {userProfile.email}
            </p>
            <p className="mb-4">
              <strong>Category:</strong> {userProfile.category}
            </p>
            <button
              onClick={toggleProfilePopup}
              className="w-full px-4 py-2 bg-lime-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <p className="text-center text-gray-800">{logoutMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
