"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExampleEntityType = exports.generateEventType = exports.generateEventFields = exports.generateField = exports.protocolTypeToGraphQL = exports.abiMethods = exports.abiEvents = void 0;
const types_1 = require("../codegen/types");
const util = __importStar(require("../codegen/util"));
const mapping_1 = require("./mapping");
function abiEvents(abi) {
    return util.disambiguateNames({
        // @ts-expect-error improve typings of disambiguateNames to handle iterables
        values: abi.data.filter(item => item.get('type') === 'event'),
        // @ts-expect-error improve typings of disambiguateNames to handle iterables
        getName: event => event.get('name'),
        // @ts-expect-error improve typings of disambiguateNames to handle iterables
        setName: (event, name) => event.set('_alias', name),
    });
}
exports.abiEvents = abiEvents;
function abiMethods(abi) {
    return util.disambiguateNames({
        // @ts-expect-error improve typings of disambiguateNames to handle iterables
        values: abi.data.filter(item => item.get('type') === 'function' && item.get('stateMutability') !== 'view' && item.get('stateMutability') !== 'pure'),
        // @ts-expect-error improve typings of disambiguateNames to handle iterables
        getName: method => method.get('name'),
        // @ts-expect-error improve typings of disambiguateNames to handle iterables
        setName: (method, name) => method.set('_alias', name.replace(/[^a-zA-Z0-9]/g, '')),
    });
}
exports.abiMethods = abiMethods;
const protocolTypeToGraphQL = (protocol, name) => {
    const ascType = (0, types_1.ascTypeForProtocol)(protocol, name);
    // TODO: we need to figure out how to improve types
    // but for now this always is returning a string
    const convertedType = (0, types_1.valueTypeForAsc)(ascType);
    // TODO: this is a hack to make array type non-nullable
    // We should refactor the way we convert the Values from ASC to GraphQL
    // For arrays we always want non-nullable children
    return convertedType.endsWith(']') ? convertedType.replace(']', '!]') : convertedType;
};
exports.protocolTypeToGraphQL = protocolTypeToGraphQL;
const generateField = ({ name, type, protocolName, }) => `${name}: ${(0, exports.protocolTypeToGraphQL)(protocolName, type)}! # ${type}`;
exports.generateField = generateField;
const generateEventFields = ({ index, input, protocolName, }) => input.type == 'tuple'
    ? util
        .unrollTuple({ value: input, path: [input.name || `param${index}`], index })
        .map(({ path, type }) => (0, exports.generateField)({ name: path.join('_'), type, protocolName }))
    : [
        (0, exports.generateField)({
            name: input.name || `param${index}`,
            type: input.type,
            protocolName,
        }),
    ];
exports.generateEventFields = generateEventFields;
/*
      id: ID!
      txHash: Bytes
      fromAddress: Bytes # address
      toAddress: Bytes # address
      valueTransferred: BigInt
      gasLimit: BigInt
      gasPrice: BigInt
      ${event.inputs
        .reduce(
            (acc, input, index) => {
                if (input.name == 'id') {
                    return acc
                }
                if (input.name == 'blockTimestamp') {
                    acc.shift()
                }
                return acc.concat(generateEventFields({ input, index, protocolName }))
            },
            [`blockTimestamp: BigInt! # uint256`],
        )
        .join('\n')}
    }`
 */
const generateEventType = (event, protocolName, contractName) => {
    return `type ${contractName}${event._alias}Event @entity(immutable: true) {
      id: ID!
      txHash: Bytes
      fromAddress: Bytes # address
      toAddress: Bytes # address
      valueTransferred: BigInt
      gasLimit: BigInt
      gasPrice: BigInt
        ${event.inputs
        .reduce((acc, input, index) => {
        if (Object.values(mapping_1.INPUT_NAMES_BLACKLIST).includes(input.name)) {
            input.name = (0, mapping_1.renameInput)(input.name, contractName ?? 'contract');
        }
        return acc.concat((0, exports.generateEventFields)({ input, index, protocolName }));
    }, [])
        .join('\n')}
        blockNumber: BigInt!
        blockTimestamp: BigInt!
        transactionHash: Bytes!
      }`;
};
exports.generateEventType = generateEventType;
const generateExampleEntityType = (protocol, contractName, events) => {
    if (protocol.hasABIs() && events.length > 0) {
        return `type ExampleEntity @entity {
  id: ID!
  count: BigInt!
  ${events[0].inputs
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .reduce((acc, input, index) => acc.concat((0, exports.generateEventFields)({ input, index, protocolName: protocol.name })), [])
            .slice(0, 2)
            .join('\n')}
}`;
    }
    return `type ${contractName.slice(0, 3)}Transaction @entity {
  id: ID!
  signerId: String!
  receiverId: String!
  blockTimestamp: BigInt!
  blockNumber: BigInt!
  kind: String!
  gasPrice: BigInt!
  methodName: String!
  gasBurnt: String!
  deposit: BigInt!
  output: String
}`;
};
exports.generateExampleEntityType = generateExampleEntityType;
