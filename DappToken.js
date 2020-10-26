var DappToken = artifacts.require("./DappToken.sol");

contract('DappToken', function(accounts) {
    var tokenInstance;

    it('The right values are assigned', function() {
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name) {
            assert.equal(name, 'Token', 'Correct Name');
            return tokenInstance.symbol();
        }).then(function(symbol) {
            assert.equal(symbol, 'TOKEN', 'Correct Symbol');
            return tokenInstance.standard();
        }).then(function(standard) {
            assert.equal(standard, 'Token Version 1', 'Correct Standard');
    });
        });

    it('Tokens is set upon Deployment', function() {
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.tokens();
        }).then(function(tokens) {
            assert.equal(tokens.toNumber(), 1000000, 'Tokens is set to 1,000,000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(MyBalance) {
            assert.equal(MyBalance.toNumber(), 1000000, 'Starting Supply to MyBalance');
        });
    });

    it('Tokens Transferred', function() {
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
        
        return tokenInstance.transfer.call(accounts[1], 9999999999);
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'Error message must contain revert');
      return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
    }).then(function(success) {
      assert.equal(success, true, 'Returns True');
      return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
    }).then(function(reciept) {
      assert.equal(reciept.logs.length, 1, 'Triggers one event');
      assert.equal(reciept.logs[0].event, 'Transfer', 'Should be the "Transfer" event');
      assert.equal(reciept.logs[0].args.from, accounts[0], 'Logs the account the Tokens are transferred from');
      assert.equal(reciept.logs[0].args.to, accounts[1], 'Logs the account the Tokens are transferred to');
      assert.equal(reciept.logs[0].args.value, 250000, 'Logs the transfer amount');
      return tokenInstance.balanceOf(accounts[1]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 250000, 'Adding Token amount to Recieving account');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 750000, 'Removes Tokens from Sending account');
    })
});

    it('Approves Transfer', function() {
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success) {
          assert.equal(success, true, 'Returns True');
          return tokenInstance.approve(accounts[1], 100);
        }).then(function(reciept) {
          assert.equal(reciept.logs.length, 1, 'Triggers one event');
          assert.equal(reciept.logs[0].event, 'Approval', 'Should be the "Approval" event');
          assert.equal(reciept.logs[0].args.owner, accounts[0], 'Logs the account the Tokens are approved from');
          assert.equal(reciept.logs[0].args.buyer, accounts[1], 'Logs the account the Tokens are approved to');
          assert.equal(reciept.logs[0].args.value, 100, 'Logs the transfer amount');
          return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance) {
          assert.equal(allowance, 100, 'Stores allowance for transfer');
        })
    })

    it('handles delegated token transfers', function() {
      return DappToken.deployed().then(function(instance) {
        tokenInstance = instance;
        fromAccount = accounts[2];
        toAccount = accounts[3];
        buyingAccount = accounts[4];
        return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
      }).then(function(reciept) {
        return tokenInstance.approve(buyingAccount, 100, { from: fromAccount });
      }).then(function(reciept) {
        return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: buyingAccount });
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') <= 0, 'cannot transfer value larger than balance');
        return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: buyingAccount });
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert') <= 0, 'cannot transfer value larger than the Approved amount');
        return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: buyingAccount });
      }).then(function(success) {
        assert.equal(success, true);
      })
    })
  });


  