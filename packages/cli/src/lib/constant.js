module.exports = {

    // e.g. blockscout
    get nonEtherscanSupportedNetworks() {
        return ['poa-core', 'poa-sokol', 'xdai', 'mumbai', 'celo', 'celo-alfajores', 'chapel', 'clover', 'avalanche', 'fuse', 'mbase', 'near-mainnet'];
    },


    get etherscanSupportedNetworks() {
        return ['kovan', 'rinkeby', 'ropsten', 'goerli', 'moonriver', 'moonbeam', 'matic', 'fantom', 'bsc', ''];
    },

    get callHandlerSupportedNetworks() {
        return []; //['fantom', 'mbase', 'mainnet','']
    },

    get etherscanNetworkApiBaseUrlMap() {
        return new Map()
            .set('mainnet', 'https://api.etherscan.io/api')
            .set('moonriver', 'https://api-moonriver.moonscan.io/api')
            .set('moonbeam', 'https://api-moonbeam.moonscan.io/api')
            .set('matic', 'https://api.polygonscan.com/api')
            .set('bsc', 'https://api.bscscan.com/api')
            .set('fantom', 'https://api.ftmscan.com/api');
    },
}
