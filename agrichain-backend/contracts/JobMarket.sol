// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract JobMarket {
    struct Job {
        uint id;
        string description;
        uint wage;
        address employer;
        address worker;
        bool completed;
    }

    uint public jobCount;
    mapping(uint => Job) public jobs;

    event JobPosted(uint id, string description, uint wage, address employer);
    event JobTaken(uint id, address worker);
    event JobCompleted(uint id);

    function postJob(string memory _description, uint _wage) public {
        require(_wage > 0, "Wage must be greater than zero");
        jobCount++;
        jobs[jobCount] = Job(jobCount, _description, _wage, msg.sender, address(0), false);
        emit JobPosted(jobCount, _description, _wage, msg.sender);
    }

    function takeJob(uint _id) public {
        Job storage job = jobs[_id];
        require(job.id > 0 && job.id <= jobCount, "Job does not exist");
        require(job.worker == address(0), "Job already taken");

        job.worker = msg.sender;
        emit JobTaken(_id, msg.sender);
    }

    function completeJob(uint _id) public {
        Job storage job = jobs[_id];
        require(job.id > 0 && job.id <= jobCount, "Job does not exist");
        require(job.worker == msg.sender, "Only assigned worker can complete the job");
        require(!job.completed, "Job already completed");

        job.completed = true;
        payable(job.worker).transfer(job.wage);
        emit JobCompleted(_id);
    }
}
