import React, { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import Web3 from "web3";
import ArticlesContract from "../contracts/Articles.json";
import { Buffer } from "buffer"; // Import Buffer from the buffer package

// Initialize IPFS
const ipfs = create({ host: "localhost", port: 5002, protocol: "http" });

const fetchContentFromIPFS = async (contentIpfsHash) => {
  try {
    const chunks = [];
    for await (const chunk of ipfs.cat(contentIpfsHash)) {
      chunks.push(chunk);
    }
    const content = Buffer.concat(chunks).toString("utf8");
    return content.trim(); // Trim any leading or trailing whitespace
  } catch (error) {
    console.error("Error fetching content from IPFS:", error);
    return "Error fetching content";
  }
};

const Articles = ({ accounts }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageIpfsHash, setImageIpfsHash] = useState("");
  const [buffer, setBuffer] = useState(null);
  const [articlesContract, setArticlesContract] = useState(null);
  const [articles, setArticles] = useState([]);
  const [expandedCardId, setExpandedCardId] = useState(null); // Track the expanded card ID

  // Load contract
  const loadContract = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545"); // Fallback to localhost if no provider found
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = ArticlesContract.networks[networkId];

    if (deployedNetwork) {
      const contract = new web3.eth.Contract(
        ArticlesContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      setArticlesContract(contract);
    } else {
      console.error("Smart contract not deployed to detected network.");
    }
  };

  // Load articles from contract
  const loadArticles = async () => {
    if (articlesContract) {
      const count = await articlesContract.methods.articleCount().call();
      const articleList = [];
      for (let i = 1; i <= count; i++) {
        const article = await articlesContract.methods.getArticle(i).call();
        article.timestamp = Number(article.timestamp);
        articleList.push({ ...article, id: i }); // Add an ID to each article
      }
      setArticles(articleList);
    }
  };

  // Load contract and articles when component mounts
  useEffect(() => {
    loadContract();
  }, []);

  useEffect(() => {
    loadArticles();
  }, [articlesContract]);

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const arrayBuffer = reader.result; // This will be ArrayBuffer
      setBuffer(Buffer.from(arrayBuffer)); // Convert ArrayBuffer to Buffer
    };

    reader.readAsArrayBuffer(file);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!buffer || !buffer.byteLength) {
        throw new Error("File buffer is empty or undefined.");
      }
      if (!title.trim()) {
        throw new Error("Title cannot be empty.");
      }
      if (!content.trim()) {
        throw new Error("Content cannot be empty.");
      }
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts available.");
      }

      const contentResult = await ipfs.add(Buffer.from(content));
      if (!contentResult || !contentResult.path) {
        throw new Error(
          "IPFS upload for content failed or returned invalid result."
        );
      }
      console.log("Uploaded content to IPFS: ", contentResult.path); // Debugging info

      const imageResult = await ipfs.add(buffer);
      if (!imageResult || !imageResult.path) {
        throw new Error(
          "IPFS upload for image failed or returned invalid result."
        );
      }
      console.log("Uploaded image to IPFS: ", imageResult.path); // Debugging info
      setImageIpfsHash(imageResult.path);

      await articlesContract.methods
        .addArticle(title, contentResult.path, imageResult.path)
        .send({ from: accounts[0], gas: 3000000 }); // Increase gas limit
      loadArticles();
      setTitle(""); // Clear input after successful submission
      setContent(""); // Clear content input after successful submission
      setBuffer(null); // Clear buffer after successful submission

      // Optionally, you can alert the user that the article is successfully uploaded
      alert("Article successfully uploaded to IPFS and Blockchain.");
    } catch (error) {
      console.error("IPFS upload error: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-4xl font-bold text-lime-400 mb-6 text-center">
          Articles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isExpanded={expandedCardId === article.id}
              onToggle={() =>
                setExpandedCardId(
                  expandedCardId === article.id ? null : article.id
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ArticleCard = ({ article, isExpanded, onToggle }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      const fetchedContent = await fetchContentFromIPFS(
        article.contentIpfsHash
      );
      setContent(fetchedContent);
    };

    fetchContent();
  }, [article.contentIpfsHash]);

  return (
    <div
      className={`max-w-sm  border border-gray-100 rounded-lg hover:shadow-white shadow-lg bg-gradient-to-b from-black  to-gray-600 ${
        isExpanded ? "max-h-full" : "max-h-[28rem]"
      } overflow-hidden transition-all duration-300`}
    >
      <img
        className={`rounded-t-lg w-full object-cover ${
          isExpanded ? "h-44" : "h-48"
        } transition-all duration-300`}
        src={`http://127.0.0.1:8081/ipfs/${article.imageIpfsHash}`}
        alt={`Image for ${article.title}`}
      />
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {article.title}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
          {isExpanded ? content : content.slice(0, 100) + "..."}
        </p>
        <button
          onClick={onToggle}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 dark:bg-lime-500 dark:hover:bg-green-500 dark:focus:ring-white"
        >
          {isExpanded ? "Show less" : "Read more"}
          <svg
            className={`rtl:rotate-180 w-3.5 h-3.5 ms-2 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Articles;
