import * as util from '../codegen/util';
import { Contract } from "./index";

export const generateFieldAssignment = (key: string[], value: string[]) =>
    `entity.${key.join('_')} = event.params.${value.join('.')}`;

export const generateFieldAssignments = ({ index, input }: { index: number; input: any }) =>
    input.type === 'tuple'
        ? util
            .unrollTuple({ value: input, index, path: [input.name || `param${index}`] })
            .map(({ path }: any) => generateFieldAssignment(path, path))
        : generateFieldAssignment(
            [(input.mappedName ?? input.name) || `param${index}`],
            [input.name || `param${index}`],
        );

type BlacklistDictionary = Record<string, string>;

/**
 * Map of input names that are reserved so we do not use them as field names to avoid conflicts
 */
export const INPUT_NAMES_BLACKLIST = {
    /** Related to https://github.com/graphprotocol/graph-tooling/issues/710 */
    id: 'id',
} as const;

export const renameInput = (name: string, subgraphName: string) => {
    const inputMap: BlacklistDictionary = {
        [INPUT_NAMES_BLACKLIST.id]: `${subgraphName}_id`,
    };

    return inputMap?.[name] ?? name;
};

export const generateEventFieldAssignments = (event: any, contractName: string) =>
    event.inputs.reduce((acc: any[], input: any, index: number) => {
        if (Object.values(INPUT_NAMES_BLACKLIST).includes(input.name)) {
            input.mappedName = renameInput(input.name, contractName ?? 'contract');
        }
        return acc.concat(generateFieldAssignments({ input, index }));
    }, []);



// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const generateEventIndexingHandlers = (
    {
        events,
        contractName,
        contract,
        isTemplateContract,
        methods
    }: {
        events: any[],
        contractName:string,
        contract:Contract,
        isTemplateContract:boolean,
        methods:any[]
    }
) =>
    `
import { ${events.map(
        event => `${event._alias} as ${event._alias}Event`,
    )}} from '../generated${isTemplateContract ? `/templates` : ''}/${contractName}/${contractName}'
import { ${methods.map(method => `${toTitleCase(method._alias)}Call`,
    )}} from '../generated${isTemplateContract ? `/templates` : ''}/${contractName}/${contractName}'
import { ${events.map(event => `${entityNameByEvent(event._alias, contractName)} as ${entityNameByEvent(event._alias, contractName)}Schema`)} } from '../generated/schema'
import { ${methods.map(method => `${entityNameByMethod(method._alias, contractName)} as ${entityNameByMethod(method._alias, contractName)}Schema`)} } from '../generated/schema'
${(isTemplateContract || !containsTemplateContracts([contract])) ? '' : `import { ${contract.templateContracts?.map(tc => tc.contractName)} } from '../generated/templates'`}

${events
        .map(
            event =>
                `
export function handle${event._alias}Event(event: ${event._alias}Event): void {
  let entity = new ${entityNameByEvent(event._alias, contractName)
                }Schema(event.transaction.hash.toHex() + '-' + event.logIndex.toString())
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
  `,
        )
        .join('\n')}


${methods
        .map(
            method =>
                `
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
  `,
        )
        .join('\n')}
`;


const containsTemplateContracts = (fromContracts: any[]) => {
    let templateContract = false;
    for (let i = 0; i < fromContracts.length; i++) {
        if (fromContracts[i].templateContracts.length > 0) {
            templateContract = true;
        }
    }
    return templateContract
}

const toTitleCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const entityNameByMethod = (methodName: string, contractName: string) => `${contractName}${methodName}Call`;

const entityNameByEvent = (eventName: string, contractName: string) => `${contractName}${eventName}Event`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const generateEventFieldAssignmentsMap = (event, templateContracts) => {
    let output = [`entity.blockTimestamp = event.block.timestamp`]

    output = event.inputs.reduce(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (acc, input, index) => {
            if (input.name == 'id') {
                return acc
            }
            if (input.name == 'blockTimestamp') {
                acc.shift()
            }
            return acc.concat(generateFieldAssignments({ input, index }))
        },
        output,
    )
    if (templateContracts) {
        output = templateContracts.reduce(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            (acc, templateContract) => {
                if (templateContract.factoryContractEvent == event.name) {
                    return acc.concat(`${templateContract.contractName}.create(event.params.${templateContract.factoryContractEventParam})`)
                }
                return acc
            },
            output,
        )
    }
    return output
}


function generateMethodFieldAssignments(method: any) {
    let output = [`entity.blockTimestamp = call.block.timestamp`];
    output = method.inputs.reduce(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (acc, input, index) => {
            if (input.name == 'id') {
                return acc
            }
            if (input.name == 'blockTimestamp') {
                acc.shift()
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return acc.concat(generateFieldAssignments({ input, index, context: 'call', field: 'inputs' }))
        },
        output,
    );

    output = method.outputs.reduce(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (acc, input, index) => acc.concat(generateFieldAssignments({ input, index, context: 'call', field: 'outputs' })),
        output,
    );

    return output;
}
