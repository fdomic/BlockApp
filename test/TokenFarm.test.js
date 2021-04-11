const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarma')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('TokenFarma', ([vlasnik, ulagac]) => {
  let daiToken, dappToken, tokenFarm

  before(async () => {
    // Load Contracts
    daiToken = await DaiToken.new()
    dappToken = await DappToken.new()
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'))

    // Send tokens to ulagac
    await daiToken.transfer(ulagac, tokens('100'), { from: vlasnik })
  })

  describe('Mock DAI razvrstavanje', async () => {
    it('ime ', async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
  })

  describe('Dapp Tokens razvrstavanje', async () => {
    it('ime ', async () => {
      const name = await dappToken.name()
      assert.equal(name, 'DApp Token')
    })
  })

  describe('Token Farma razvrstavanje', async () => {
        it('ime ', async () => {
        const name = await tokenFarm.name()
        assert.equal(name, 'Dapp Token Farma')
        })
    })

    it('ugovor ima tokene', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })

    describe('Farmanje tokena', async () => {

      it('nagrada ulagacu za ulaganje u mDai token', async () => {
        let result
  
        // Check ulagac balance before staking
        result = await daiToken.balanceOf(ulagac)
        assert.equal(result.toString(), tokens('100'), ' Mock DAI  ispravi stanje racuna prije ulaganja')
        
        //  Mock DAI ulog tokena
        await daiToken.approve(tokenFarm.address, tokens('100'), { from: ulagac })
        await tokenFarm.ulogTokena(tokens('100'), { from: ulagac })

        // Provjerite rezultat ulaganja
        result = await daiToken.balanceOf(ulagac)
        assert.equal(result.toString(), tokens('0'), 'ulagac Mock DAI-a , stanje racuna tocno poslje uloga ')

        result = await daiToken.balanceOf(tokenFarm.address)
        assert.equal(result.toString(), tokens('100'), 'Token Farma Mock DAI, stanje tocno poslje uloga ')

        result = await tokenFarm.stakingBalance(ulagac)
        assert.equal(result.toString(), tokens('100'), 'ulagac, stanje tocno poslje uloga')

        result = await tokenFarm.isStaking(ulagac)
        assert.equal(result.toString(), 'true', 'ulagac stanje tocno poslje uloga')

        // Izdavanje Tokena
        await tokenFarm.izdaniTokeni({ from: vlasnik })

        // Prvojeri balans poslje izdavanje tokena
        result = await dappToken.balanceOf(ulagac)
        assert.equal(result.toString(), tokens('100'), 'ulagac DApp Token stanje novcanika je tocan poslje izdavanja tokena')

      // Ensure that only onwer can issue tokens
      await tokenFarm.izdaniTokeni({ from: ulagac }).should.be.rejected;

      // Unstake tokens
      await tokenFarm.povratTokena({ from: ulagac })

      // Check results after unstaking
      result = await daiToken.balanceOf(ulagac)
      assert.equal(result.toString(), tokens('100'), 'ulagac Mock DAI stanje racuna tocno poslje uloga')

      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), tokens('0'), 'Token Farma Mock DAI stanje tocno poslje uloga')

      result = await tokenFarm.stakingBalance(ulagac)
      assert.equal(result.toString(), tokens('0'), 'ulagac, stanje tocno poslje uloga')

      result = await tokenFarm.isStaking(ulagac)
      assert.equal(result.toString(), 'false', 'ulagac stanje uloga tocno poslje uloga')

      

      })
    })
  
})
