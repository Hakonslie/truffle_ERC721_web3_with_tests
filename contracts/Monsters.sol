
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract Monsters is ERC721("Monsters", "mon"), Ownable{

    using SafeMath for uint256;
    using SafeMath for uint8;

    uint256 monsterID = 1;
    uint256 public currentMonster;

    event birthedMonster(uint256 id, uint8 hp);
    event attackedMonster(uint256 id, address attacker);
    event killedMonster(uint256 id, address killer);

    struct Monster {
        uint8 hp;
        address killedBy;
    }

    mapping(uint256 => Monster) public monsters;
    
    constructor() {
        _generateMonster();
    }

    function _generateMonster() private {
        Monster memory m = Monster({killedBy: address(0), hp: 8});
        monsters[monsterID] = m;
        currentMonster = monsterID;
        emit birthedMonster(monsterID, m.hp);
        // Need to increment monsterID later
        monsterID = monsterID.add(1);
    }
    function attackMonster(uint256 id) public {
        _doDamageToMonster(id, _msgSender()); 
    }

    function _doDamageToMonster(uint256 id, address attacker) private {
        require(monsters[id].hp > 0, "Monster is dead or doesn't exist");
        monsters[id].hp = uint8(monsters[id].hp.sub(1));
        emit attackedMonster(id, attacker);
        if (monsters[id].hp == 0) {
            _monsterGotKilled(id, attacker);
        }
    }

    function _monsterGotKilled(uint256 id, address killer) private {
        Monster storage m = monsters[id];
        m.killedBy = killer;
        emit killedMonster(id, killer);
        _generateMonster();
    }


}
