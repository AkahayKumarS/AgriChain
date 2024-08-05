// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Articles {
    address public admin;

    struct Article {
        uint id;
        string title;
        string contentIpfsHash; // Store IPFS hash of content
        string imageIpfsHash;   // Store IPFS hash of image
        uint timestamp;
    }

    uint public articleCount;
    mapping(uint => Article) public articles;

    event ArticleAdded(uint id, string title, string contentIpfsHash, string imageIpfsHash, uint timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addArticle(string memory _title, string memory _contentIpfsHash, string memory _imageIpfsHash) public onlyAdmin {
        articleCount++;
        articles[articleCount] = Article(articleCount, _title, _contentIpfsHash, _imageIpfsHash, block.timestamp);
        emit ArticleAdded(articleCount, _title, _contentIpfsHash, _imageIpfsHash, block.timestamp);
    }

    function getArticle(uint _id) public view returns (Article memory) {
        return articles[_id];
    }
}
