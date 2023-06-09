// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

contract Donate {

    address public owner;
    uint totalDonations;

    constructor() {
        owner = msg.sender;
        totalDonations = 0;
    }

    function donate() public payable {
        totalDonations = totalDonations + msg.value;
    }

    function withdrawAll() public {
        address payable to = payable(owner);
        address thisContract = address(this);
        to.transfer(thisContract.balance);
    }

    function getTotalDonations() view public returns(uint) {
        return totalDonations;
    }
}
