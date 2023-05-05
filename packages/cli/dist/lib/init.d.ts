/**
 * subgraphName: Subgraph name
 * directory: Directory to create the subgraph in
 * network: Ethereum network <mainnet|kovan|rinkeby|ropsten|goerli|poa-core>
 * fromContracts: {
      contractName: contract name
      contractAbi: contract abi,
      contractAddress: contract address,
      templateContracts: {
        contractAbi: template contract abi,
        contractName: template contract name,
        factoryContractEvent: factory contract event which creates instance of template contract,
        factoryContractEventParam: factory contract event param which contains address for instance of of template contract,
      }[],
    }[]
 * etherscanApikey: Api key to fetch ABI from EtherScan
 * indexEvents: Boolean (optional) [default: true]
 * allowSimpleName: Boolean (optional) [default: false]
 * fromExample: Boolean (optional) [default: false], Creates a scaffold based on an example subgraph
 */
export function runInit({ subgraphName, directory, network, fromContracts, etherscanApikey, indexEvents, allowSimpleName, fromExample, product, protocol, node, studio }: {
    subgraphName: any;
    directory: any;
    network: any;
    fromContracts: any;
    etherscanApikey: any;
    indexEvents?: boolean | undefined;
    allowSimpleName?: boolean | undefined;
    fromExample?: boolean | undefined;
    product?: string | undefined;
    protocol?: string | undefined;
    node?: string | undefined;
    studio: any;
}): Promise<true | "Process Init Form" | undefined>;
export function loadAbiFromBlockScout(network: any, address: any): Promise<any>;
export function loadAbiFromEtherscan(network: any, address: any, etherscanApikey: any): Promise<any>;
export function loadAbiFromFile(filename: any): Promise<ABI>;
export function initSubgraphFromContract(toolbox: any, { protocolInstance, allowSimpleName, subgraphName, directory, network, fromContracts, indexEvents, etherscanApikey, node, studio, product }: {
    protocolInstance: any;
    allowSimpleName: any;
    subgraphName: any;
    directory: any;
    network: any;
    fromContracts: any;
    indexEvents: any;
    etherscanApikey: any;
    node: any;
    studio: any;
    product: any;
}, { commands }: {
    commands: any;
}): Promise<true | undefined>;
export function initSubgraphFromExample(toolbox: any, { allowSimpleName, subgraphName, directory }: {
    allowSimpleName: any;
    subgraphName: any;
    directory: any;
}, { commands }: {
    commands: any;
}): Promise<true | undefined>;
import ABI = require("../abi");
