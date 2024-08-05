import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <>
      <div
        className="bg-cover bg-center bg-fixed py-10 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url('../../images/AgriBg-1.jpeg')",
        }}
      >
        <div className="max-w-7xl mx-auto bg-white bg-opacity-75 p-8 rounded-lg shadow-lg">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">
              About Us
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Revolutionizing Agriculture with Decentralized Technology
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-700 lg:mx-auto">
              AgriChain is a web application designed to assist farmers by
              providing a wide range of agricultural information and services.
              This platform offers farmers an extensive online marketplace to
              sell their produce, while customers can send purchase requests and
              buy products directly through the website.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
                <dt>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Our Mission
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-700">
                  Despite technological advancements, many farmers still
                  struggle to access relevant agricultural information and
                  markets. AgriChain aims to bridge this gap by offering a
                  comprehensive platform that connects farmers, buyers, and
                  laborers, thus facilitating efficient agricultural practices
                  and expanding market reach.
                </dd>
              </div>

              <div className="relative bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
                <dt>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Our Vision
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-700">
                  AgriChain is crucial for farmers looking to modernize their
                  practices, sell produce, hire laborers, and gain insights into
                  agricultural trends. It caters to various stakeholders in the
                  agricultural sector, including farmers, customers, sellers,
                  and laborers. Its primary applications are in enhancing market
                  access, streamlining hiring processes, and disseminating
                  valuable agricultural knowledge.
                </dd>
              </div>

              <div className="relative bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
                <dt>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Our Team
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-700">
                  <ul>
                    <li>Akshaya Kumar S 4SO21CS014</li>
                    <li>Gurukiran Y 4SO21CS056</li>
                    <li>H K Karunprasad 4SO21CS057</li>
                    <li>Hanamaraddi Bhandi 4SO21CS059</li>
                  </ul>
                </dd>
              </div>

              <div className="relative bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
                <dt>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Contact Us
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-700">
                  If you have any questions or would like to learn more about
                  AgriChain, please contact us at:
                  <br />
                  <a
                    href="mailto:support@agrichain.com"
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    support@agrichain.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-lime-100 via-green-950 to-gray-900">
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
              <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                <h2 className="title-font font-medium text-yellow-300 tracking-widest text-sm mb-3">
                  ADMIN SERVICES
                </h2>
                <nav className="list-none mb-10">
                  <li>
                    <Link
                      to="/articles"
                      className="text-gray-500 hover:text-green-500"
                    >
                      Post News
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/users-info"
                      className="text-gray-500 hover:text-green-500"
                    >
                      Registered Users Info
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin-support"
                      className="text-gray-500 hover:text-green-500"
                    >
                      Admin Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin-resources"
                      className="text-gray-500 hover:text-green-500"
                    >
                      Admin Resources
                    </Link>
                  </li>
                </nav>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-900 via-green-950 to-lime-100">
            <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
              <p className="text-gray-400 text-sm text-center sm:text-left">
                © 2024 AgriChain — All Rights Reserved.
              </p>
              <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
                <Link className="text-gray-500">
                  <svg
                    fill="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-5 h-5 hover:text-gray-900"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                  </svg>
                </Link>
                <Link className="ml-3 text-gray-500">
                  <svg
                    fill="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-5 h-5 hover:text-gray-900"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                  </svg>
                </Link>
                <Link className="ml-3 text-gray-500">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-5 h-5 hover:text-gray-900"
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
                <Link className="ml-3 text-gray-500">
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="0"
                    className="w-5 h-5 hover:text-gray-900"
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

export default AboutUs;
