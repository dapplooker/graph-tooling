import prettier from 'prettier';
import { getSubgraphBasename } from '../command-helpers/subgraph';
import Protocol from '../protocols';
import ABI from '../protocols/ethereum/abi';
import { generateEventIndexingHandlers } from './mapping';
import { abiEvents, abiMethods, generateEventType, generateExampleEntityType } from './schema';
import { generateTestsFiles } from './tests';
import constant from "../lib/constant";
import immutable from "immutable";

export interface Contract {
    contractAddress: string,
    contractAbi: string,
    contractName: string,
    templateContracts: any[],
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

    constructor(options: ScaffoldOptions) {
        this.protocol = options.protocol;
        this.abi = options.abi;
        this.indexEvents = options.indexEvents;
        this.contract = options.contract;
        this.network = options.network;
        this.contractName = options.contractName;
        this.subgraphName = options.subgraphName;
        this.startBlock = options.startBlock;
        this.node = options.node;
        this.fromContracts = options.fromContracts;
        this.etherscanApikey = options.etherscanApikey;
    }


    shouldIndexCallHandler = (network: string) => {
        // eslint-disable-next-line no-console
        console.log(`shouldIndexCallHandler network: ${network}`);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return constant.callHandlerSupportedNetworks.includes(network);
    }

    generatePackageJson() {
        return prettier.format(
            JSON.stringify({
                name: getSubgraphBasename(String(this.subgraphName)),
                license: 'UNLICENSED',
                scripts: {
                    codegen: 'graph codegen',
                    build: 'graph build',
                    deploy: `graph deploy ` + `--node ${this.node} ` + this.subgraphName,
                    'create-local': `graph create --node http://localhost:8020/ ${this.subgraphName}`,
                    'remove-local': `graph remove --node http://localhost:8020/ ${this.subgraphName}`,
                    'deploy-local':
                        `graph deploy ` +
                        `--node http://localhost:8020/ ` +
                        `--ipfs http://localhost:5001 ` +
                        this.subgraphName,
                    test: 'graph test',
                },
                dependencies: {
                    '@graphprotocol/graph-cli': "https://gitpkg.now.sh/dapplooker/graph-tooling/packages/cli?dl-main",
                    '@graphprotocol/graph-ts': `0.29.1`,
                },
                devDependencies: this.protocol.hasEvents() ? { 'matchstick-as': `0.5.0` } : undefined,
            }),
            { parser: 'json' },
        );
    }

    async generateDataSource() {
        const result = [];
        const protocolManifest = this.protocol.getManifestScaffold();
        const fromContracts: Contract[] = this.fromContracts ?? [];
        for (let i = 0; i < fromContracts.length; i++) {
            const abi = fromContracts[i].contractAbi;
            const contractName = fromContracts[i].contractName;
            const contract = fromContracts[i].contractAddress;
            const r = `
    - kind: ${this.protocol.name}
      name: ${contractName}
      network: ${this.network}
      source: ${await protocolManifest.source({ contract, contractName, network: this.network, etherscanApikey: this.etherscanApikey })}
      mapping: ${protocolManifest.mapping({ abi, contractName })/*{ abi, contractName }*/}`

            result.push(r);
        }
        return result.join('');
    }


    async generateManifest() {
        // const protocolManifest = this.protocol.getManifestScaffold()

        const yamlContent = prettier.format(`
specVersion: 0.0.5
schema:
    file: ./schema.graphql
dataSources:
    ${await this.generateDataSource()}
`,
            { parser: 'yaml' },
        );
        return yamlContent;
    }

    generateSchema({ abi, contractName }: { abi: { data: immutable.Collection<any, any> }, contractName: string }) {
        const hasEvents = this.protocol.hasEvents()
        const events = hasEvents ? abiEvents(abi).toJS() : []

        return prettier.format(hasEvents ? events.map(
            event => generateEventType(event, this.protocol.name, contractName)).join('\n\n') :
            generateExampleEntityType(this.protocol, contractName, events),
            {
                parser: 'graphql',
            },
        )
    }

    generateSchemas() {
        const schema: string[] = []
        const fromContracts: Contract[] = this.fromContracts ?? [];
        for (let i = 0; i < fromContracts.length; i++) {
            const fromContract: Contract = fromContracts[i]
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            schema.push(this.generateSchema({ abi: fromContract.contractAbi, contractName: fromContract.contractName }))
        }
        return schema.join('\n')
    }

    generateTsConfig() {
        return prettier.format(
            JSON.stringify({
                extends: '@graphprotocol/graph-ts/types/tsconfig.base.json',
                include: ['src', 'tests'],
            }),
            { parser: 'json' },
        );
    }

    generateMapping({ indexCallHandler, contract, isTemplateContract }: {
        indexCallHandler: boolean,
        contract: any,
        isTemplateContract: boolean
    }) {
        const hasEvents = this.protocol.hasEvents()
        const events = hasEvents ? abiEvents(contract.contractAbi).toJS() : []
        const methods = hasEvents && indexCallHandler ? abiMethods(contract.contractAbi).toJS() : []
        const protocolMapping = this.protocol.getMappingScaffold()

        return prettier.format(
            hasEvents
                ? generateEventIndexingHandlers(
                    {
                        events,
                        contractName: contract.contractName,
                        contract,
                        isTemplateContract,
                        methods
                    }
                )
                : protocolMapping.generatePlaceholderHandlers({
                    abi: contract.contractAbi,
                    contractName: contract.contractName,
                    events,
                }),
            { parser: 'typescript', semi: false },
        )
    }

    generateABIs() {
        return this.protocol.hasABIs()
            ? {
                [`${this.contractName}.json`]: prettier.format(JSON.stringify(this.abi?.data), {
                    parser: 'json',
                }),
            }
            : undefined;
    }

    generateTests() {
        const hasEvents = this.protocol.hasEvents();
        const events = hasEvents ? abiEvents(this.abi!).toJS() : [];

        return events.length > 0
            ? generateTestsFiles(this.contractName, events, this.indexEvents)
            : undefined;
    }

    async generate() {

        const mappingMap = {};
        const abiMap = {};
        const fromContracts: any[] = this.fromContracts ?? [];
        for (let i = 0; i < fromContracts.length; i++) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mappingMap[`${fromContracts[i].contractName}Mapping.ts`] = this.generateMapping({
                contract: fromContracts[i],
                isTemplateContract: false,
                indexCallHandler: this.shouldIndexCallHandler(this.network),
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            abiMap[`${fromContracts[i].contractName}.json`] = this.protocol.hasEvents() ? prettier.format(JSON.stringify(fromContracts[i].contractAbi.data), {
                parser: 'json',
            }) : '';

            const templateContracts = fromContracts[i].templateContracts;
            for (let j = 0; j < templateContracts.length; j++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                mappingMap[`${templateContracts[j].contractName}Mapping.ts`] = this.generateMapping({
                    contract: templateContracts[j],
                    isTemplateContract: true,
                    indexCallHandler: this.shouldIndexCallHandler(this.network),
                });
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                abiMap[`${templateContracts[j].contractName}.json`] = prettier.format(JSON.stringify(templateContracts[j].contractAbi.data), {
                    parser: 'json',
                });
            }
        }

        return {
            'package.json': this.generatePackageJson(),
            'subgraph.yaml': await this.generateManifest(),
            'schema.graphql': this.generateSchemas(),
            'tsconfig.json': this.generateTsConfig(),
            src: mappingMap,
            abis: abiMap
        };
    }

}
