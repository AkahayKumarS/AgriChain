// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriChain {
    struct User {
        string username;
        string email;
        string password;
        string category;
        bool exists;
    }

    mapping(address => User) public users;

    event UserSignedUp(address userAddress, string username, string email, string category);

    function signUp(string memory _username, string memory _email, string memory _password, string memory _category) public {
        require(!users[msg.sender].exists, "User already exists.");
        users[msg.sender] = User(_username, _email, _password, _category, true);
        emit UserSignedUp(msg.sender, _username, _email, _category);
    }

    function login(string memory _email, string memory _password) public view returns (bool) {
        User memory user = users[msg.sender];
        require(user.exists, "User does not exist.");
        return (keccak256(abi.encodePacked(user.email)) == keccak256(abi.encodePacked(_email)) && 
                keccak256(abi.encodePacked(user.password)) == keccak256(abi.encodePacked(_password)));
    }
}
