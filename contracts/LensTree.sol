// SPDX-License-Identifier: MIT

pragma solidity ^0.8;

import "@openzeppelin/contracts/utils/Counters.sol";

contract LensTree {
    using Counters for Counters.Counter;
    struct Link {
        uint256 id;
        string name;
        string url;
    }

    mapping(address => Link[]) private lensMap;
    mapping(address => Counters.Counter) private counterMap;

    event LinkAdded(address user, string name);
    event LinkModified(address user, string name, string url);
    event LinkDeleted(address user, uint256 id);

    function addLink(string memory _name, string memory _url) public {
        if (lensMap[msg.sender].length == 0) {
            counterMap[msg.sender]._value = 0;
        }
        uint256 _id = Counters.current(counterMap[msg.sender]);
        lensMap[msg.sender].push(Link({id: _id, name: _name, url: _url}));
        Counters.increment(counterMap[msg.sender]);
        emit LinkAdded(msg.sender, _name);
    }

    // 0xdD870fA1b7C4700F2BD7f44238821C26f7392148
    // 0x12190647C38e2D35BAa6F4d6da44475285fee5d1

    function getLinks(address _addr) public view returns (Link[] memory) {
        return lensMap[_addr];
    }

    function modifyLink(
        uint256 _id,
        string memory _name,
        string memory _url
    ) public {
        lensMap[msg.sender][_id] = Link({id: _id, name: _name, url: _url});
        emit LinkModified(msg.sender, _name, _url);
    }

    function removeLink(address _addr, uint256 _id)
        public
        returns (bool success)
    {
        require(msg.sender == _addr, "You can only delete your own Links :)");
        require(
            _id <= Counters.current(counterMap[msg.sender]),
            "no Link with such id exists"
        );
        Link[] storage records = lensMap[msg.sender];
        delete records[_id];
        emit LinkDeleted(msg.sender, _id);
        return true;
    }

    function getLinkAtID(address _addr, uint256 _id)
        public
        view
        returns (Link memory)
    {
        require(
            _id < Counters.current(counterMap[_addr]),
            "No Link with such ID exists!"
        );
        return lensMap[_addr][_id];
    }
}
