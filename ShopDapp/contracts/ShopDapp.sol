// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//features: list ,buy product and withdraw funds.

contract ShopDapp {
    address public owner;

    struct Item {
        uint id;
        string name;
        string category;
        string image;
        uint cost;
        uint rating;
        uint stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;
    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;

    event List(string name, uint256 cost, uint quantity);
    event Buy(address buyer, uint256 orderId, uint256 itemId);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // List Products
    function list(
        uint _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint _cost,
        uint _rating,
        uint _stock
    ) public onlyOwner {
        //Create Item Struct
        Item memory item = Item(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );

        //save Item to struct in Blockchain
        items[_id] = item;

        //Emit an event
        emit List(_name, _cost, _stock);
    }

    //Buy Products
    function buy(uint256 _id) public payable {
        //Recieve Crypto using payable
        //Fetch Item
        Item memory item = items[_id];
        //Check ethers are enough to buy items.
        require(msg.value >= item.cost);
        //require item is in stock
        require(item.stock > 0);
        //Create an Order
        Order memory order = Order(block.timestamp, item); //blockstamp time is current time in sec
        //Save Order to chain.
        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = order;

        //Substrack stock
        items[_id].stock = items[_id].stock - 1;
        //Emit Event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }

    //Withdraw funds
    function withdraw() public onlyOwner {
        (bool succcess, ) = owner.call{value: address(this).balance}("");
        require(succcess);
    }
}
