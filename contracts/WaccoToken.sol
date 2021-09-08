
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";

contract WaccoToken is ERC721("WaccoToken", "WTO"), Ownable {
    uint256 tokenID = 0;

    struct TokenData {
        uint256 ID;
        uint256 timestamp;
        string TokenURI;
    }

    mapping(address => TokenData[]) public ownership;

    function mintToken() public {
        tokenID++;
        TokenData memory NewWacco = TokenData(tokenID, block.timestamp, "fuck off");
        ownership[msg.sender].push(NewWacco);
        _safeMint(msg.sender, NewWacco.ID);
    }

    function burnToken(uint256 _tokenID) public {
        require(ownerOf(_tokenID) == _msgSender());
        _burn(_tokenID);
        removeBurnedTokenFromOwnership(msg.sender, _tokenID);
    }

    function removeBurnedTokenFromOwnership(address owner, uint256 _tokenID) public {
        TokenData[] storage tokens = ownership[owner];
        for(uint i = 0; i < tokens.length; i++) {
            if (tokens[i].ID == _tokenID) {
                delete tokens[i];
            }
        }
    }
}
