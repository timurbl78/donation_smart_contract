// https://eth-goerli.g.alchemy.com/v2/9ht1CMAymfnW5DFGG2TpRR_za9zOEmou

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerly: {
      url: 'https://eth-goerli.g.alchemy.com/v2/9ht1CMAymfnW5DFGG2TpRR_za9zOEmou',
      accounts: ['3dd60dec133f731275e66a80235601cc38cdde061b5c0970d5fc060417456e29']
    }
  }
}
