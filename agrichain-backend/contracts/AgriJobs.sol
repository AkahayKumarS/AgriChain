// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriJobs {
    struct Job {
        uint id;
        address farmer;
        string title;
        string description;
        string location;
        string contactNumber;
        uint256 wage;
        bool isAvailable;
    }

    uint public jobCount = 0;
    mapping(uint => Job) public jobs;

    event JobPosted(
        uint id,
        address farmer,
        string title,
        string description,
        string location,
        string contactNumber,
        uint256 wage,
        bool isAvailable
    );

    function postJob(
        string memory _title,
        string memory _description,
        string memory _location,
        string memory _contactNumber,
        uint256 _wage
    ) public {
        jobCount++;
        jobs[jobCount] = Job(jobCount, msg.sender, _title, _description, _location, _contactNumber, _wage, true);
        emit JobPosted(jobCount, msg.sender, _title, _description, _location, _contactNumber, _wage, true);
    }

    function fetchJob(uint _jobId) public view returns (
        uint, address, string memory, string memory, string memory, string memory, uint256, bool
    ) {
        Job memory job = jobs[_jobId];
        return (job.id, job.farmer, job.title, job.description, job.location, job.contactNumber, job.wage, job.isAvailable);
    }

    function fetchJobs() public view returns (Job[] memory) {
        Job[] memory jobArray = new Job[](jobCount);
        for (uint i = 1; i <= jobCount; i++) {
            jobArray[i - 1] = jobs[i];
        }
        return jobArray;
    }

    function markJobAsUnavailable(uint _jobId) public {
        require(jobs[_jobId].farmer == msg.sender, "Only the farmer who posted the job can mark it as unavailable.");
        jobs[_jobId].isAvailable = false;
    }
}
