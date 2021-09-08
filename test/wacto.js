const wacto = artifacts.require("WaccoTobaccoToken");

contract("WaccoTobaccoToken", accounts => {
    it("should put 10000 Tokens in the first account", async () => {
        const instance = await wacto.deployed();
        const balance = await instance.balanceOf.call(accounts[0]);
        assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
    });

    it("should have 0 balance on empty wallet", async () => {
        const instance = await wacto.deployed();
        const balance = await instance.balanceOf.call("0xcB7C09fEF1a308143D9bf328F2C33f33FaA46bC2");
        assert.equal(balance.valueOf(), 0, "empty wallet didnt have 0 balance");
    })

    it("should send coin correctly", async () => {
        const instance = await wacto.deployed();

        const account1 = accounts[0];
        const account2 = accounts[1];

        // get initial balances
        const initBalance1 = await instance.balanceOf.call(account1);
        const initBalance2 = await instance.balanceOf.call(account2);

        // send coins from account 1 to 2
        const amount = 10;
        await instance.transfer(account2, amount, { from: account1 });

        // get final balances
        const finalBalance1 = await instance.balanceOf.call(account1);
        const finalBalance2 = await instance.balanceOf.call(account2);

        assert.equal(
            finalBalance1.toNumber(),
            initBalance1.toNumber() - amount,
            "Amount wasn't correctly taken from the sender",
        );
        assert.equal(
            finalBalance2.toNumber(),
            initBalance2.toNumber() + amount,
            "Amount wasn't correctly sent to the receiver",
        );
    });

});
