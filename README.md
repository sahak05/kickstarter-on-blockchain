# kickstarter-on-blockchain
Here was an idea to fix issues and frauds which appear on kickstarter, but now using Smart Contracts. 


## Variables
- manager --> address --> address of the person who is managing the campaign
- minimunContribution --> uint --> Minimum donation required to be considered a contributor
- approvers --> mapping --> List of address for every person who donated
- request --> Request[] --> List of requests that manager has created

## Functions
- contribute --> called when someone wants to donate money (they become automatically an approver)
- createRequest --> called by the manager to create a new spending request
- approveRequest --> called by each approvers to approve a spending request
- finalizeRequest --> After a request has gotten enough approvals, the manager  can call this to get money sent to the vendor

## Struct
```
Request {
    description: string,
    amount: uint,
    recipient: address,
    complete: bool,
    approvals: mapping,
    approvalCount: uint
}
```