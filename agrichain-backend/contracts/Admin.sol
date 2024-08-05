// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Admin {
    address public admin;
    struct Machinery {
        uint id;
        string name;
        uint price;
        bool sold;
    }

    uint public machineryCount;
    mapping(uint => Machinery) public machineries;

    event MachineryAdded(uint id, string name, uint price);
    event MachinerySold(uint id, address buyer);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addMachinery(string memory _name, uint _price) public onlyAdmin {
        require(_price > 0, "Price must be greater than zero");
        machineryCount++;
        machineries[machineryCount] = Machinery(machineryCount, _name, _price, false);
        emit MachineryAdded(machineryCount, _name, _price);
    }

    function sellMachinery(uint _id) public payable {
        Machinery memory machinery = machineries[_id];
        require(machinery.id > 0 && machinery.id <= machineryCount, "Machinery does not exist");
        require(msg.value == machinery.price, "Incorrect value sent");
        require(!machinery.sold, "Machinery already sold");

        payable(admin).transfer(msg.value);
        machinery.sold = true;
        machineries[_id] = machinery;
        emit MachinerySold(_id, msg.sender);
    }
}
