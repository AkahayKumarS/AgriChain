import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomeComponent from "./components/Home";
import AboutComponent from "./components/AboutUs";
import Signup from "./components/Signup";
import Login from "./components/Login";
import FarmerComponent from "./components/Farmer";
import MarketplaceComponent from "./components/MarketPlace";
import ApplyForJob from "./components/ApplyForJob";
import AdminComponent from "./components/Admin";
import ArticlesComponent from "./components/Articles";
import JobMarketComponent from "./components/JobMarket";
import SignUp from "./components/Signup";
import Web3 from "web3";
import ViewArticles from "./components/ViewArticles";
import SellProduct from "./components/SellProduct";
import LaborRegister from "./components/LaborRegister";
import AgriJobsComponent from "./components/AgriJobsComponent";
import AvailableJobsComponent from "./components/AvailableJobsComponent";

const App = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const loadAccounts = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
    };

    loadAccounts();
  }, []);

  const signupFunction = async (username, password) => {
    // Implement signup logic here
  };

  const loginFunction = async (username, password) => {
    // Implement login logic here
  };

  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="aboutus" element={<AboutComponent />} />
          <Route path="/farmer" element={<FarmerComponent />} />
          <Route path="/marketplace" element={<MarketplaceComponent />} />
          <Route path="/applyforjob" element={<ApplyForJob />} />
          <Route path="/admin" element={<AdminComponent />} />
          <Route
            path="/articles"
            element={<ArticlesComponent accounts={accounts} />}
          />
          <Route path="/job-market" element={<JobMarketComponent />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/signup"
            element={
              <Signup userType="Farmer" signupFunction={signupFunction} />
            }
          />
          <Route
            path="/login"
            element={<Login userType="Farmer" loginFunction={loginFunction} />}
          />
          <Route path="/view-articles" element={<ViewArticles />} />
          <Route path="/sell-products" element={<SellProduct />} />
          <Route path="/labour-register" element={<LaborRegister />} />
          <Route path="/agrijobs-component" element={<AgriJobsComponent />} />
          <Route path="/available-jobs" element={<AvailableJobsComponent />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
