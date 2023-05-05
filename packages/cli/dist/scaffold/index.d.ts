import Protocol from '../protocols';
import ABI from '../protocols/ethereum/abi';
import immutable from "immutable";
export interface Contract {
    contractAddress: string;
    contractAbi: string;
    contractName: string;
    templateContracts: any[];
}
export interface ScaffoldOptions {
    protocol: Protocol;
    abi?: ABI;
    indexEvents?: boolean;
    contract?: string;
    network: string;
    contractName: string;
    startBlock?: string;
    subgraphName?: string;
    node?: string;
    fromContracts: any[] | undefined;
    etherscanApikey: string | undefined;
}
export default class Scaffold {
    protocol: Protocol;
    abi?: ABI;
    indexEvents?: boolean;
    contract?: string;
    network: string;
    contractName: string;
    subgraphName?: string;
    node?: string;
    startBlock?: string;
    fromContracts: any[] | undefined;
    etherscanApikey: string | undefined;
    constructor(options: ScaffoldOptions);
    shouldIndexCallHandler: (network: string) => boolean;
    generatePackageJson(): string;
    generateDataSource(): Promise<string>;
    generateManifest(): Promise<string>;
    generateSchema({ abi, contractName }: {
        abi: {
            data: immutable.Collection<any, any>;
        };
        contractName: string;
    }): string;
    generateSchemas(): string;
    generateTsConfig(): string;
    generateMapping({ indexCallHandler, contract, isTemplateContract }: {
        indexCallHandler: boolean;
        contract: any;
        isTemplateContract: boolean;
    }): string;
    generateABIs(): {
        [x: string]: string;
    } | undefined;
    generateTests(): {
        [x: string]: string;
    } | undefined;
    generate(): Promise<{
        'package.json': string;
        'subgraph.yaml': string;
        'schema.graphql': string;
        'tsconfig.json': string;
        src: {};
        abis: {};
    }>;
}
