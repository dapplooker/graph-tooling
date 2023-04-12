const { runInit } = require('../../dist/lib/init.js')

// proxy contract

runInit({
  protocol: 'ethereum',
  product:'hosted-service',
  subgraphName: 'dapplooker/dev-swap1',
  directory: './tests/lib/generate_subgraph/TDAO',
  node:'https://api.thegraph.com/deploy/ ',
  network: 'mainnet',
  studio:"",
  fromContracts: [
    {
      contractAddress: '0x76EA2186182E3Ec27C2D9C7394b83E5C8F2cf6C4',
      contractAbi: 'tests/lib/TDAO/0x76EA2186182E3Ec27C2D9C7394b83E5C8F2cf6C4.json',
      contractName: 'NFTRewardsVault',
      templateContracts: [],
    },
    {
      contractAddress: '0x1C03d8d79706cd548B643810799e2B7288365c7e',
      contractAbi: 'tests/lib/TDAO/0x1C03d8d79706cd548B643810799e2B7288365c7e.json',
      contractName: 'RewardsVault',
      templateContracts: [],
    },
     {
      contractAddress: '0x0069Ca41fd66a0ac174Db98c8fEDc128c985b5f5',
      contractAbi: 'tests/lib/TDAO/0x0069Ca41fd66a0ac174Db98c8fEDc128c985b5f5.json',
      contractName: 'TrigRewardsVault',
      templateContracts: [],
    },
    {
      contractAddress: '0x76D8C0853aAC606dDDF29d3cf1e4251279e66858',
      contractAbi: 'tests/lib/TDAO/0x76D8C0853aAC606dDDF29d3cf1e4251279e66858.json',
      contractName: 'LockedLiquidityEvent',
      templateContracts: [],
    },
    {
      contractAddress: '0x8e84Ee8B28dDbe2B1d5e204E674460835D298815',
      contractAbi: 'tests/lib/TDAO/0x8e84Ee8B28dDbe2B1d5e204E674460835D298815.json',
      contractName: 'TDAO',
      templateContracts: [],
    },
    {
      contractAddress: '0xEAC5B9F0993f1Eb0c2C32B81335F3f00bF08B168',
      contractAbi: 'tests/lib/TDAO/0xEAC5B9F0993f1Eb0c2C32B81335F3f00bF08B168.json',
      contractName: 'FeeSplitter',
      templateContracts: [],
    },
    // {
    //   contractAddress: '0x6be6e8fba7E5C2c56d32a7C994811806dC564859',
    //   contractAbi: 'tests/lib/TDAO/0x6be6e8fba7E5C2c56d32a7C994811806dC564859.json',
    //   contractName: 'Proxy',
    //   templateContracts: [],
    // },
    {
      contractAddress: '0x6690C139564144b27ebABA71F9126611a23A31C9',
      contractAbi: 'tests/lib/abi/daohaus-matic.json',
      contractName: 'V21Factory',
      templateContracts: [],
     },
  ],
  etherscanApikey: '7TWA2JA7BJ7RI3CCNNZUYBB8SRMXD9G1NB',
}).then(console.log)
