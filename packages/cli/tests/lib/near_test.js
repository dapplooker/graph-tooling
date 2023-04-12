const { runInit } = require('../../src/lib/init.js')

// proxy contract

runInit({
    protocol: 'near',
    product: 'hosted-service',
    subgraphName: 'dapplooker/dev-swap1',
    directory: './tests/lib/generate_subgraph/Near',
    node: 'https://api.thegraph.com/deploy/ ',
    network: 'near-mainnet',
    studio: "",
    fromContracts: [
        {
            contractAddress: 'relay.aurora',
            contractName: 'star',
            templateContracts: [],
        },
        {
            contractAddress: 'v1.nearapps.near',
            contractName: 'nearapps.near',
            templateContracts: [],
        },
        {
            contractAddress: 'news.sputnik-dao.near',
            contractName: 'news',
            templateContracts: [],
        },
        {
            contractAddress: 'sputnik-dao.near',
            contractName: 'sputnik',
            templateContracts: [],
        },
    ],
    etherscanApikey: '',
}).then(console.log)

/*
 steps after this script 
 npm run build inside directory folder 
 add --access-token in package.json deploy command
 run npm run deploy command
*/