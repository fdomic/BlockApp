const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarma')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('TokenFarma', ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm

  before(async () => {
    // Load Contracts
    daiToken = await DaiToken.new()
    dappToken = await DappToken.new()
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'))

    // Send tokens to investor
    await daiToken.transfer(investor, tokens('100'), { from: owner })
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

      it('rewards investors for staking mDai tokens', async () => {
        let result
  
        // Check investor balance before staking
        result = await daiToken.balanceOf(investor)
        assert.equal(result.toString(), tokens('100'), ' (Mock DAI)ispravi stanje racuna prije ulaganja')
  

      

      })
    })
  
})
