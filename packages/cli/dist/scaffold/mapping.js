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
exports.generateEventIndexingHandlers = exports.generateEventFieldAssignments = exports.renameInput = exports.INPUT_NAMES_BLACKLIST = exports.generateFieldAssignments = exports.generateFieldAssignment = void 0;
const util = __importStar(require("../codegen/util"));
const generateFieldAssignment = (key, value) => `entity.${key.join('_')} = event.params.${value.join('.')}`;
exports.generateFieldAssignment = generateFieldAssignment;
const generateFieldAssignments = ({ index, input }) => input.type === 'tuple'
    ? util
        .unrollTuple({ value: input, index, path: [input.name || `param${index}`] })
        .map(({ path }) => (0, exports.generateFieldAssignment)(path, path))
    : (0, exports.generateFieldAssignment)([(input.mappedName ?? input.name) || `param${index}`], [input.name || `param${index}`]);
exports.generateFieldAssignments = generateFieldAssignments;
/**
 * Map of input names that are reserved so we do not use them as field names to avoid conflicts
 */
exports.INPUT_NAMES_BLACKLIST = {
    /** Related to https://github.com/graphprotocol/graph-tooling/issues/710 */
    id: 'id',
};
const renameInput = (name, subgraphName) => {
    const inputMap = {
        [exports.INPUT_NAMES_BLACKLIST.id]: `${subgraphName}_id`,
    };
    return inputMap?.[name] ?? name;
};
exports.renameInput = renameInput;
const generateEventFieldAssignments = (event, contractName) => event.inputs.reduce((acc, input, index) => {
    if (Object.values(exports.INPUT_NAMES_BLACKLIST).includes(input.name)) {
        input.mappedName = (0, exports.renameInput)(input.name, contractName ?? 'contract');
    }
    return acc.concat((0, exports.generateFieldAssignments)({ input, index }));
}, []);
exports.generateEventFieldAssignments = generateEventFieldAssignments;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const generateEventIndexingHandlers = ({ events, contractName, contract, isTemplateContract, methods }) => `
import { ${events.map(event => `${event._alias} as ${event._alias}Event`)}} from '../generated${isTemplateContract ? `/templates` : ''}/${contractName}/${contractName}'
import { ${methods.map(method => `${toTitleCase(method._alias)}Call`)}} from '../generated${isTemplateContract ? `/templates` : ''}/${contractName}/${contractName}'
import { ${events.map(event => `${entityNameByEvent(event._alias, contractName)} as ${entityNameByEvent(event._alias, contractName)}Schema`)} } from '../generated/schema'
import { ${methods.map(method => `${entityNameByMethod(method._alias, contractName)} as ${entityNameByMethod(method._alias, contractName)}Schema`)} } from '../generated/schema'
${(isTemplateContract || !containsTemplateContracts([contract])) ? '' : `import { ${contract.templateContracts?.map(tc => tc.contractName)} } from '../generated/templates'`}

${events
    .map(event => `
export function handle${event._alias}Event(event: ${event._alias}Event): void {
  let entity = new ${entityNameByEvent(event._alias, contractName)}Schema(event.transaction.hash.toHex() + '-' + event.logIndex.toString())
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred =  event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  ${generateEventFieldAssignmentsMap(event, contract.templateContracts).join('\n')}
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
  entity.save()
}
  `)
    .join('\n')}


${methods
    .map(method => `
export function handle${method._alias}Call(call: ${toTitleCase(method._alias)}Call): void {
  let id = call.transaction.hash.toHex()
  let entity = new ${entityNameByMethod(method._alias, contractName)}Schema(id);
  entity.txHash = call.transaction.hash
  entity.fromAddress = call.transaction.from
  entity.toAddress = call.transaction.to
  entity.valueTransferred =  call.transaction.value
  entity.gasLimit = call.transaction.gasLimit
  entity.gasPrice = call.transaction.gasPrice
  ${generateMethodFieldAssignments(method).join('\n')}
  entity.save()
}
  `)
    .join('\n')}
`;
exports.generateEventIndexingHandlers = generateEventIndexingHandlers;
const containsTemplateContracts = (fromContracts) => {
    let templateContract = false;
    for (let i = 0; i < fromContracts.length; i++) {
        if (fromContracts[i].templateContracts.length > 0) {
            templateContract = true;
        }
    }
    return templateContract;
};
const toTitleCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const entityNameByMethod = (methodName, contractName) => `${contractName}${methodName}Call`;
const entityNameByEvent = (eventName, contractName) => `${contractName}${eventName}Event`;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const generateEventFieldAssignmentsMap = (event, templateContracts) => {
    let output = [`entity.blockTimestamp = event.block.timestamp`];
    output = event.inputs.reduce(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (acc, input, index) => {
        if (input.name == 'id') {
            return acc;
        }
        if (input.name == 'blockTimestamp') {
            acc.shift();
        }
        return acc.concat((0, exports.generateFieldAssignments)({ input, index }));
    }, output);
    if (templateContracts) {
        output = templateContracts.reduce(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (acc, templateContract) => {
            if (templateContract.factoryContractEvent == event.name) {
                return acc.concat(`${templateContract.contractName}.create(event.params.${templateContract.factoryContractEventParam})`);
            }
            return acc;
        }, output);
    }
    return output;
};
function generateMethodFieldAssignments(method) {
    let output = [`entity.blockTimestamp = call.block.timestamp`];
    output = method.inputs.reduce(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (acc, input, index) => {
        if (input.name == 'id') {
            return acc;
        }
        if (input.name == 'blockTimestamp') {
            acc.shift();
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return acc.concat((0, exports.generateFieldAssignments)({ input, index, context: 'call', field: 'inputs' }));
    }, output);
    output = method.outputs.reduce(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (acc, input, index) => acc.concat((0, exports.generateFieldAssignments)({ input, index, context: 'call', field: 'outputs' })), output);
    return output;
}
