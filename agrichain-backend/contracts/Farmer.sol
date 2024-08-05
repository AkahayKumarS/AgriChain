// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Farmer {
    struct FarmerDetails {
        string name;
        string location;
        string[] products;
        bool isRegistered;
    }

    mapping(address => FarmerDetails) public farmers;
    mapping(address => uint256) public balances;

    event FarmerRegistered(address farmerAddress, string name, string location);
    event BalanceAdded(address farmerAddress, uint256 amount);
    event BalanceWithdrawn(address farmerAddress, uint256 amount);

    modifier onlyRegisteredFarmer() {
        require(farmers[msg.sender].isRegistered, "Only registered farmers can perform this action");
        _;
    }

    function registerFarmer(string memory _name, string memory _location, string[] memory _products) public {
        require(!farmers[msg.sender].isRegistered, "Farmer already registered");
        
        farmers[msg.sender] = FarmerDetails({
            name: _name,
            location: _location,
            products: _products,
            isRegistered: true
        });
        
        emit FarmerRegistered(msg.sender, _name, _location);
    }

    function getFarmer(address _farmerAddress) public view returns (FarmerDetails memory) {
        require(farmers[_farmerAddress].isRegistered, "Farmer not registered");
        return farmers[_farmerAddress];
    }

    function addBalance(address _farmer, uint256 _amount) external {
        require(farmers[_farmer].isRegistered, "Can only add balance for registered farmers");
        balances[_farmer] += _amount;
        emit BalanceAdded(_farmer, _amount);
    }

    function withdrawBalance() public onlyRegisteredFarmer {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit BalanceWithdrawn(msg.sender, amount);
    }
}




