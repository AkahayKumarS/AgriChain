// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LaborManagement {
    struct Skill {
        string skillName;
        uint8 rating; // Rating out of 5
    }

    struct Labor {
        uint id;
        string name;
        string laborAddress;
        string phone;
        address laborOwner; // Owner of the labor entry
        bool isAvailable;  // Availability status
        Skill[] skills;
    }

    uint public laborCount = 0;
    mapping(uint => Labor) public labors;

    event LaborAdded(uint laborId, string name, string laborAddress, string phone);
    event LaborMarkedAsUnavailable(uint laborId);

    function addLabor(
        string memory _name,
        string memory _laborAddress,
        string memory _phone,
        string[] memory _skillNames,
        uint8[] memory _ratings
    ) public {
        require(_skillNames.length == _ratings.length, "Skills and ratings count mismatch");

        laborCount++;
        Labor storage labor = labors[laborCount];
        labor.id = laborCount;
        labor.name = _name;
        labor.laborAddress = _laborAddress;
        labor.phone = _phone;
        labor.laborOwner = msg.sender; // Set the owner of the labor entry
        labor.isAvailable = true; // Set labor as available by default

        for (uint256 i = 0; i < _skillNames.length; i++) {
            labor.skills.push(Skill(_skillNames[i], _ratings[i]));
        }

        emit LaborAdded(laborCount, _name, _laborAddress, _phone);
    }

    function getLabor(uint256 _laborId)
        public
        view
        returns (
            uint id,
            string memory name,
            string memory laborAddress,
            string memory phone,
            address laborOwner,
            bool isAvailable,
            string[] memory skillNames,
            uint8[] memory ratings
        )
    {
        Labor storage labor = labors[_laborId];
        uint256 skillsCount = labor.skills.length;

        skillNames = new string[](skillsCount);
        ratings = new uint8[](skillsCount);

        for (uint256 i = 0; i < skillsCount; i++) {
            skillNames[i] = labor.skills[i].skillName;
            ratings[i] = labor.skills[i].rating;
        }

        return (labor.id, labor.name, labor.laborAddress, labor.phone, labor.laborOwner, labor.isAvailable, skillNames, ratings);
    }

    function fetchLabors() public view returns (Labor[] memory) {
        Labor[] memory laborArray = new Labor[](laborCount);
        for (uint i = 1; i <= laborCount; i++) {
            laborArray[i - 1] = labors[i];
        }
        return laborArray;
    }

    function markLaborAsUnavailable(uint256 _laborId) public {
        require(labors[_laborId].laborOwner == msg.sender, "Only the owner can mark labor as unavailable");
        labors[_laborId].isAvailable = false;
        emit LaborMarkedAsUnavailable(_laborId);
    }
}
