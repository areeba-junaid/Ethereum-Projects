// SPDX-License-Identifier: GPL-3.0
// Two main entities Organizer and Attendee

pragma solidity ^0.8.2;


contract EventContract {
     // All Event related information of event will be stored in struct .
     struct Event{
         address Organizer;
         string name;
         uint date;
         uint price;
         uint ticketCount;
         uint ticketRemain;
     }

     //We used mapping because an organizer can organize multiple events.
     mapping (uint => Event) public events;
     mapping (address=>mapping(uint=>uint))public tickets;
     uint public nextId;

     function createEvent( string memory name, uint date ,uint price ,uint ticketCount) external {
         require ( date> block.timestamp ,"you can organize event for future date");
         require( ticketCount >0 ,"You can Organize account only if ticketcount is more than 0");
         events [nextId]= Event (msg.sender,name ,date,price,ticketCount,ticketCount);
         nextId++;
     }

     function buyTicket (uint id ,uint quantity) external payable 
     {
         require(events[id].date !=0 ,"Event does not Exist");
         require(events[id].date>block.timestamp,"Event has already occured");  
         Event storage _event=events[id];
         require(msg.value==(_event.price*quantity),"Not Enough tickets");
         _event.ticketRemain-=quantity;
         tickets[msg.sender][id]+=quantity;   

     }

     function transferTicket (uint id, uint quantity , address to) external{

      require(events[id].date !=0 ,"Event does not Exist");
      require(events[id].date>block.timestamp,"Event has already occured"); 
      require(tickets[msg.sender][id]>quantity ,"you donot have enough tickets");
      tickets [msg.sender][id]-=quantity;
      tickets[to][id]+=quantity;

     }

 } 
