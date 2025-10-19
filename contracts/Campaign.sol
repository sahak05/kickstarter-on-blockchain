// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint8 minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {

    struct Request {
        string description; // Describes why the request is being created
        uint128 value; // Amount of money in Wei that the manager wants to send to the vendor
        address recipient; // Address that the money will be sent to. See this a the vendor
        bool complete; // True if the request has already been complete
        uint64 approvalCount; // Track numbers of approvals
        mapping(address => bool) approvals; // Returns true if the approval already voted
    }

    address public manager;
    mapping(address => bool) public approvers; // We use mapping to avoid for loop search
    uint8 public minimumContribution;
    Request[] public requests;
    uint64 public approversCount;


    modifier restricted() {
        require(msg.sender  == manager);
        _;
    }

    constructor(uint8 minimum, address creator_address) {
        manager = creator_address;
        minimumContribution = minimum;
    } 

    function contribute() payable public {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory _description, uint128 _value, address _recipient) public restricted{
        Request storage request = requests.push();
        request.description = _description;
        request.value = _value;
        request.recipient = _recipient;
        request.complete = false;
        request.approvalCount=  0;
    }

    function approveRequest(uint64 request_index)  public {
        require(approvers[msg.sender]);
        Request storage request = requests[request_index];
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint64 request_index) public restricted{
        Request storage request = requests[request_index];

        require(request.approvalCount > approversCount / 2);
        require(!request.complete);
        address payable vendor = payable(request.recipient);
        vendor.transfer(request.value);
        request.complete = true;
    }
}

