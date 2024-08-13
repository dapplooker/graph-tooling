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
    spkgPath?: string;
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
    spkgPath?: string;
    fromContracts: any[] | undefined;
    etherscanApikey: string | undefined;
    constructor(options: ScaffoldOptions);
    shouldIndexCallHandler: (network: string) => boolean;
    generatePackageJson(): Promise<string>;
    generatePackageJsonForSubstreams(): Promise<string>;
    generateDataSource(): Promise<string>;
    generateManifest(): Promise<string>;
    generateSchema({ abi, contractName }: {
        abi: {
            data: immutable.Collection<any, any>;
        };
        contractName: string;
    }): Promise<string>;
    generateSchemas(): Promise<string>;
    generateTsConfig(): Promise<string>;
    generateDockerFileConfig(): Promise<string>;
    generateGitIgnoreFile(): string;
    generateMapping({ indexCallHandler, contract, isTemplateContract }: {
        indexCallHandler: boolean;
        contract: any;
        isTemplateContract: boolean;
    }): Promise<string>;
    generateABIs(): Promise<{
        [x: string]: string;
    } | undefined>;
    generateTests(): Promise<{
        [x: string]: string;
    } | undefined>;
    generate(): Promise<{
        'subgraph.yaml': string;
        'schema.graphql': string;
        'package.json': string;
        '.gitignore': string;
        'tsconfig.json'?: undefined;
        src?: undefined;
        abis?: undefined;
    } | {
        'package.json': string;
        'subgraph.yaml': string;
        'schema.graphql': string;
        'tsconfig.json': string;
        src: {};
        abis: {};
        '.gitignore'?: undefined;
    }>;
}
