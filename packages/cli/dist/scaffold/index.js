"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prettier_1 = __importDefault(require("prettier"));
const subgraph_1 = require("../command-helpers/subgraph");
const version_1 = require("../version");
const mapping_1 = require("./mapping");
const schema_1 = require("./schema");
const tests_1 = require("./tests");
const constant_1 = __importDefault(require("../lib/constant"));
const GRAPH_CLI_VERSION = process.env.GRAPH_CLI_TESTS
    ? // JSON.stringify should remove this key, we will install the local
        // graph-cli for the tests using `npm link` instead of fetching from npm.
        undefined
    : // For scaffolding real subgraphs
        version_1.version;
class Scaffold {
    constructor(options) {
        this.shouldIndexCallHandler = (network) => {
            // eslint-disable-next-line no-console
            console.log(`shouldIndexCallHandler network: ${network}`);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return constant_1.default.callHandlerSupportedNetworks.includes(network);
        };
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
    generatePackageJson() {
        return prettier_1.default.format(JSON.stringify({
            name: (0, subgraph_1.getSubgraphBasename)(String(this.subgraphName)),
            license: 'UNLICENSED',
            scripts: {
                codegen: 'graph codegen',
                build: 'graph build',
                deploy: `graph deploy ` + `--node ${this.node} ` + this.subgraphName,
                'create-local': `graph create --node http://localhost:8020/ ${this.subgraphName}`,
                'remove-local': `graph remove --node http://localhost:8020/ ${this.subgraphName}`,
                'deploy-local': `graph deploy ` +
                    `--node http://localhost:8020/ ` +
                    `--ipfs http://localhost:5001 ` +
                    this.subgraphName,
                test: 'graph test',
            },
            dependencies: {
                '@graphprotocol/graph-cli': GRAPH_CLI_VERSION,
                '@graphprotocol/graph-ts': `0.29.1`,
            },
            devDependencies: this.protocol.hasEvents() ? { 'matchstick-as': `0.5.0` } : undefined,
        }), { parser: 'json' });
    }
    async generateDataSource() {
        const result = [];
        const protocolManifest = this.protocol.getManifestScaffold();
        const fromContracts = this.fromContracts ?? [];
        for (let i = 0; i < fromContracts.length; i++) {
            const abi = fromContracts[i].contractAbi;
            const contractName = fromContracts[i].contractName;
            const contract = fromContracts[i].contractAddress;
            const r = `
    - kind: ${this.protocol.name}
      name: ${contractName}
      network: ${this.network}
      source: ${await protocolManifest.source({ contract, contractName, network: this.network, etherscanApikey: this.etherscanApikey })}
      mapping: ${protocolManifest.mapping({ abi, contractName }) /*{ abi, contractName }*/}`;
            result.push(r);
        }
        return result.join('');
    }
    async generateManifest() {
        // const protocolManifest = this.protocol.getManifestScaffold()
        const yamlContent = prettier_1.default.format(`
specVersion: 0.0.5
schema:
    file: ./schema.graphql
dataSources:
    ${await this.generateDataSource()}
`, { parser: 'yaml' });
        return yamlContent;
    }
    generateSchema({ abi, contractName }) {
        const hasEvents = this.protocol.hasEvents();
        const events = hasEvents ? (0, schema_1.abiEvents)(abi).toJS() : [];
        return prettier_1.default.format(hasEvents ? events.map(event => (0, schema_1.generateEventType)(event, this.protocol.name, contractName)).join('\n\n') :
            (0, schema_1.generateExampleEntityType)(this.protocol, contractName, events), {
            parser: 'graphql',
        });
    }
    generateSchemas() {
        const schema = [];
        const fromContracts = this.fromContracts ?? [];
        for (let i = 0; i < fromContracts.length; i++) {
            const fromContract = fromContracts[i];
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            schema.push(this.generateSchema({ abi: fromContract.contractAbi, contractName: fromContract.contractName }));
        }
        return schema.join('\n');
    }
    generateTsConfig() {
        return prettier_1.default.format(JSON.stringify({
            extends: '@graphprotocol/graph-ts/types/tsconfig.base.json',
            include: ['src', 'tests'],
        }), { parser: 'json' });
    }
    generateMapping({ indexCallHandler, contract, isTemplateContract }) {
        const hasEvents = this.protocol.hasEvents();
        const events = hasEvents ? (0, schema_1.abiEvents)(contract.contractAbi).toJS() : [];
        const methods = hasEvents && indexCallHandler ? (0, schema_1.abiMethods)(contract.contractAbi).toJS() : [];
        const protocolMapping = this.protocol.getMappingScaffold();
        return prettier_1.default.format(hasEvents
            ? (0, mapping_1.generateEventIndexingHandlers)({
                events,
                contractName: contract.contractName,
                contract,
                isTemplateContract,
                methods
            })
            : protocolMapping.generatePlaceholderHandlers({
                abi: contract.contractAbi,
                contractName: contract.contractName,
                events,
            }), { parser: 'typescript', semi: false });
    }
    generateABIs() {
        return this.protocol.hasABIs()
            ? {
                [`${this.contractName}.json`]: prettier_1.default.format(JSON.stringify(this.abi?.data), {
                    parser: 'json',
                }),
            }
            : undefined;
    }
    generateTests() {
        const hasEvents = this.protocol.hasEvents();
        const events = hasEvents ? (0, schema_1.abiEvents)(this.abi).toJS() : [];
        return events.length > 0
            ? (0, tests_1.generateTestsFiles)(this.contractName, events, this.indexEvents)
            : undefined;
    }
    async generate() {
        const mappingMap = {};
        const abiMap = {};
        const fromContracts = this.fromContracts ?? [];
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
            abiMap[`${fromContracts[i].contractName}.json`] = this.protocol.hasEvents() ? prettier_1.default.format(JSON.stringify(fromContracts[i].contractAbi.data), {
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
                abiMap[`${templateContracts[j].contractName}.json`] = prettier_1.default.format(JSON.stringify(templateContracts[j].contractAbi.data), {
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
exports.default = Scaffold;
