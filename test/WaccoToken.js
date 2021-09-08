const wacto = artifacts.require("WaccoToken");
const truffleAssertions = require('truffle-assertions');

contract("WaccoToken", accounts => {
    it("Should not be able to spend burnt token", async () => {
        const instance = await wacto.deployed();

        await instance.mintToken({from: accounts[0]});

        const token1 = await instance.ownership.call(accounts[0], 0);

        await instance.burnToken(token1.ID, {from: accounts[0]});

        balance = await instance.balanceOf.call(accounts[0]);

        await truffleAssertions.reverts(
            instance.safeTransferFrom(accounts[0], accounts[1], token1.ID, {from: accounts[0]}), "ERC721: operator query for nonexistent token"
        )
    })

    it("Should be able to mint, send and burn tokens", async () => {
        const instance = await wacto.deployed();

        await instance.mintToken({from: accounts[0]});
        let balance = await instance.balanceOf.call(accounts[0]);

        assert.equal(balance.toNumber(), 1, "Balance is not 1 after 1 mint");

        await instance.mintToken({from: accounts[0]});
        balance = await instance.balanceOf.call(accounts[0]);

        assert.equal(balance.toNumber(), 2, "Balance is not 2 after 2 mint");

        const token1 = await instance.ownership.call(accounts[0], 1); // starting at index 1 instead of 0 because of earlier test occupying 0
        const token2 = await instance.ownership.call(accounts[0], 2); 

        await instance.burnToken(token1.ID, {from: accounts[0]});

        balance = await instance.balanceOf.call(accounts[0]);
        assert.equal(balance.toNumber(), 1, "Balance is not 1 after 2 mints and 1 burn");

        await instance.safeTransferFrom(accounts[0], accounts[1], token2.ID, {from: accounts[0]})
        balance = await instance.balanceOf.call(accounts[0]);
        assert.equal(balance.toNumber(), 0, "Balance is not 0 after 2 mints, 1 burn and 1 transfer")

        balance = await instance.balanceOf.call(accounts[1])
        assert.equal(balance.toNumber(), 1, "Balance is not 1 after receiving 1 token")

    })
});