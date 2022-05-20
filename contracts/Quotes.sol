// SPDX-License-Identifier: UNLICENCED

pragma solidity ^0.8.4;

contract Quotes {
    string[] public quotes;

    function getQuotes() public view returns (string[] memory) {
        return quotes;
    }

    function addQuote(string calldata _quote) external {
        quotes.push(_quote);
    }
}
