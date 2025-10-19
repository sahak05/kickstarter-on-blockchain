// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Campaign {

    struct Request {
        string description; // Describes why the request is being created
        uint64 value; // Amount of money in Wei that the manager wants to send to the vendor
        address recipient; // Address that the money will be sent to. See this a the vendor
        bool complete; // True if the request has already been complete
    }

    address public manager;
    address payable[] public approvers;
    uint8 public minimumContribution;
    Request[] public requests;


    modifier restricted() {
        require(msg.sender  == manager);
        _;
    }

    constructor(uint8 minimum) {
        manager = msg.sender;
        minimumContribution = minimum;
    } 

    function contribute() payable public {
        require(msg.value > minimumContribution);
        approvers.push(payable(msg.sender));
    }

    function createRequest(string memory _description, uint64 _value, address _recipient) public restricted{
        Request memory request = Request({
            description: _description,
            value: _value,
            recipient: _recipient,
            complete: false
        });
        requests.push(request);
    }

    // function approveRequest






}