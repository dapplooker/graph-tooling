import { Map } from 'immutable';
import Protocol from '../protocols';
import ABI from '../protocols/ethereum/abi';
import { Spinner } from './spinner';
export declare const generateDataSource: (protocol: Protocol, contractName: string, network: string, contractAddress: string, abi: ABI, startBlock?: string) => Promise<Map<unknown, unknown>>;
export declare const generateScaffold: ({ protocolInstance, abi, contract, network, subgraphName, fromContracts, etherscanApikey, indexEvents, contractName, startBlock, node, }: {
    protocolInstance: Protocol;
    abi: ABI;
    contract: string;
    network: string;
    subgraphName: string;
    fromContracts: any[] | undefined;
    etherscanApikey: string | undefined;
    indexEvents: boolean;
    contractName?: string | undefined;
    startBlock?: string | undefined;
    node?: string | undefined;
}, spinner: Spinner) => Promise<{
    'package.json': string;
    'subgraph.yaml': string;
    'schema.graphql': string;
    'tsconfig.json': string;
    src: {};
    abis: {};
}>;
export declare const writeScaffold: (scaffold: any, directory: string, spinner: Spinner) => Promise<void>;
export declare const writeABI: (abi: ABI, contractName: string) => Promise<void>;
export declare const writeSchema: (abi: ABI, protocol: Protocol, schemaPath: string, entities: any, contractName: string) => Promise<void>;
export declare const writeTestsFiles: (abi: ABI, protocol: Protocol, contractName: string) => Promise<void>;
