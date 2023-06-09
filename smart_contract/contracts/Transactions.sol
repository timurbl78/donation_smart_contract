// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract Transactions {
    address public owner;
    uint totalDonations;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
        totalDonations = 0;
    }

    function donate() public payable {
        totalDonations += msg.value;
    }

    function withdrawAll() public onlyOwner {
        address payable to = payable(owner);
        address thisContract = address(this);
        to.transfer(thisContract.balance);
        totalDonations = 0;
    }

    function getTotalDonations() view public returns(uint) {
        return totalDonations;
    }
}
