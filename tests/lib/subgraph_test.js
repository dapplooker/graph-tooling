const { runInit } = require('../../packages/cli/dist/lib/init.js')

// proxy contract

runInit({
  protocol: 'ethereum',
  product:'hosted-service',
  subgraphName: 'dapplooker/dev-swap1',
  directory: './generate_subgraph/TDAO',
  node:'https://api.thegraph.com/deploy/ ',
  network: 'mainnet',
  studio:"",
  fromContracts: [
    {
      contractAddress: '0x2fcCd0f67d0722f5EB7c1A404DFF0224544155E3',
      contractAbi: '/Users/choubey/Documents/DLCodeBase/subgraphs/production/Savvy-Finance/dapplooker/apex/abis/SavvySage.json',
      contractName: 'SVYSAGEBTC',
      templateContracts: [],
    }
  ],
  etherscanApikey: '7TWA2JA7BJ7RI3CCNNZUYBB8SRMXD9G1NB',
}).then(console.log)
