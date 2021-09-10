const mon = artifacts.require("Monsters");
const { eventEmitted } = require('truffle-assertions');
const truffleAssert = require('truffle-assertions');

contract("Monsters", accounts => {

    it("Should generate monster in constructor", async () => {
        const instance = await mon.new();
        let result = await truffleAssert.createTransactionResult(instance, instance.transactionHash);
        truffleAssert.eventEmitted(result, 'birthedMonster', (ev) => 
        {
            return ev.id == 1
        }, "birthedMonster event filter didnt return any results");
    })

    it("Should attack monster", async () => {
        let account = accounts[0];
        const instance = await mon.new();
        let monsterID = await instance.currentMonster.call();

        let startingMonster = await instance.monsters.call(monsterID);

        result = await instance.attackMonster(monsterID, {from: account});
        truffleAssert.eventEmitted(result, 'attackedMonster', (ev) => {
            return ev.id == monsterID, ev.attacker == account;
        });
        let monsterAfterAttack = await instance.monsters.call(monsterID);
        assert.equal(startingMonster.hp - 1, monsterAfterAttack.hp, "Monster didn't loose 1 hp after attack");
    })

    it("Monster should die at 0 hp after amounts of attacks corresponding to original hp", async () => {

        const instance = await mon.new();
        let monsterID = await instance.currentMonster.call();
        let monster = await instance.monsters.call(monsterID);

        // Attack monster until it should be dead
        let result;
        let attacks = 0;
        for(let i = 0; i < monster.hp; i++) {
            result = await instance.attackMonster(monsterID, {from:accounts[0]});
            attacks++;
        }
        truffleAssert.eventEmitted(result, 'killedMonster', (ev) => {
            return ev.killer == accounts[0];
        }, "killedMonster event with killer filter didn't match");

        assert.equal(monster.hp, attacks, "health didn't match amount of attacks required")
    });

    it("Shouldn't attack monster that is dead", async () => {
        const instance = await mon.new();
        let monsterID = await instance.currentMonster.call();
        let monster = await instance.monsters.call(monsterID);
        for(let i = 0; i < monster.hp; i++) {
            await instance.attackMonster(monsterID)
        }
        monster = await instance.monsters.call(monsterID) 

        truffleAssert.reverts(instance.attackMonster(monsterID), "Monster is dead or doesn't exist");
    });


    it("Shouldn't attack monster that doesnt exist", async () => {
        const instance = await mon.new();
        let monsterID = await instance.currentMonster.call();
        truffleAssert.reverts(instance.attackMonster(++monsterID), "Monster is dead or doesn't exist");
    });

    it("Should create new monster and change current monster when monster is dead", async () => {
        const instance = await mon.deployed();
        let monsterID = await instance.currentMonster.call();
        let monster = await instance.monsters.call(monsterID);
        let result;
        for(let i = 0; i < monster.hp; i++) {
            result = await instance.attackMonster(monsterID, {from: accounts[0]})
        }
        let monsterIDAfterKill = await instance.currentMonster.call();
        assert.notEqual(monsterID, monsterIDAfterKill, "current Monster not changed after killing");
        
        truffleAssert.eventEmitted(result, 'birthedMonster', (ev) => 
        {
            return ev.id == ++monsterID 
        }, "birthedMonster event filter didn't match on monster killed");

    });

    it("Should give loot to killer when monster died", async () => {
    });

    it("Should be able to crit monster by paying extra", async () => {

    })
});