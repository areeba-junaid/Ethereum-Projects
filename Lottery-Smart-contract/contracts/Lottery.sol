// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Lottery {
    address public manager; //To address of manager
    address payable[] public participants; //To pay winner in end it si payable

    constructor() {
        manager = msg.sender; //msg.sender is global variable.
    }

    receive() external payable {
        require(msg.value == 1 ether);
        participants.push(payable(msg.sender));
    }

    function getBalance() public view returns (uint) {
        require(msg.sender == manager);
        return address(this).balance;
    }

    function random() public view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        participants.length
                    )
                )
            );
    }

    function Selectwinner() public {
        require(msg.sender == manager);
        require(participants.length > 3);
        uint r = random();
        uint Index = r % participants.length;

        address payable Winner = participants[Index];
        Winner.transfer(getBalance());
        participants = new address payable[](0); //reset after winner selections
    }
}
