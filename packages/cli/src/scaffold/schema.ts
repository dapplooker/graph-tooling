// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import immutable from 'immutable';
import { ascTypeForProtocol, valueTypeForAsc } from '../codegen/types';
import * as util from '../codegen/util';
import Protocol from '../protocols';
import { INPUT_NAMES_BLACKLIST, renameInput } from './mapping';

export function abiEvents(abi: { data: immutable.Collection<any, any> }) {
  return util.disambiguateNames({
    // @ts-expect-error improve typings of disambiguateNames to handle iterables
    values: abi.data.filter(item => item.get('type') === 'event'),
    // @ts-expect-error improve typings of disambiguateNames to handle iterables
    getName: event => event.get('name'),
    // @ts-expect-error improve typings of disambiguateNames to handle iterables
    setName: (event, name) => event.set('_alias', name),
  }) as unknown as immutable.List<any>;
}

export function abiMethods(abi: { data: immutable.Collection<any, any> }) {
  return util.disambiguateNames({
    // @ts-expect-error improve typings of disambiguateNames to handle iterables
    values: abi.data.filter(item => item.get('type') === 'function' && item.get('stateMutability') !== 'view' && item.get('stateMutability') !== 'pure'),
    // @ts-expect-error improve typings of disambiguateNames to handle iterables
    getName: method => method.get('name'),
    // @ts-expect-error improve typings of disambiguateNames to handle iterables
    setName: (method, name) => method.set('_alias', name.replace(/[^a-zA-Z0-9]/g, '')),
  }) as unknown as immutable.List<any>;
}

export const protocolTypeToGraphQL = (protocol: string, name: string) => {
  const ascType = ascTypeForProtocol(protocol, name);
  // TODO: we need to figure out how to improve types
  // but for now this always is returning a string
  const convertedType = valueTypeForAsc(ascType) as string;

  // TODO: this is a hack to make array type non-nullable
  // We should refactor the way we convert the Values from ASC to GraphQL
  // For arrays we always want non-nullable children
  return convertedType.endsWith(']') ? convertedType.replace(']', '!]') : convertedType;
};

export const generateField = ({
  name,
  type,
  protocolName,
}: {
  name: string;
  type: string;
  protocolName: string;
}) => `${name}: ${protocolTypeToGraphQL(protocolName, type)}! # ${type}`;

export const generateEventFields = ({
  index,
  input,
  protocolName,
}: {
  index: number;
  input: any;
  protocolName: string;
}) =>
  input.type == 'tuple'
    ? util
        .unrollTuple({ value: input, path: [input.name || `param${index}`], index })
        .map(({ path, type }: any) => generateField({ name: path.join('_'), type, protocolName }))
    : [
        generateField({
          name: input.name || `param${index}`,
          type: input.type,
          protocolName,
        }),
      ];


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

export const generateEventType = (
  event: any,
  protocolName: string,
  contractName: string | undefined,
) => {
  return `type ${contractName}${event._alias}Event @entity(immutable: true) {
      id: ID!
      txHash: Bytes
      fromAddress: Bytes # address
      toAddress: Bytes # address
      valueTransferred: BigInt
      gasLimit: BigInt
      gasPrice: BigInt
        ${event.inputs
          .reduce((acc: any[], input: any, index: number) => {
            if (Object.values(INPUT_NAMES_BLACKLIST).includes(input.name)) {
              input.name = renameInput(input.name, contractName ?? 'contract');
            }
            return acc.concat(generateEventFields({ input, index, protocolName }));
          }, [])
          .join('\n')}
        blockNumber: BigInt!
        blockTimestamp: BigInt!
        transactionHash: Bytes!
      }`;
};

export const generateExampleEntityType = (protocol: Protocol, contractName: string, events: any[]) => {
  if (protocol.hasABIs() && events.length > 0) {

    return `type ExampleEntity @entity {
  id: ID!
  count: BigInt!
  ${events[0].inputs
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .reduce((acc, input, index) => acc.concat(generateEventFields({ input, index, protocolName: protocol.name })), [])
        .slice(0, 2)
        .join('\n')}
}`
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

}
