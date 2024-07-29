import immutable from 'immutable';
import Protocol from '../protocols';
export declare function abiEvents(abi: {
    data: immutable.Collection<any, any>;
}): immutable.List<any>;
export declare function abiMethods(abi: {
    data: immutable.Collection<any, any>;
}): immutable.List<any>;
export declare const protocolTypeToGraphQL: (protocol: string, name: string) => string;
export declare const generateField: ({ name, type, protocolName, }: {
    name: string;
    type: string;
    protocolName: string;
}) => string;
export declare const generateEventFields: ({ index, input, protocolName, }: {
    index: number;
    input: any;
    protocolName: string;
}) => any;
export declare const generateEventType: (event: any, protocolName: string, contractName: string | undefined) => string;
export declare const generateExampleEntityType: (protocol: Protocol, contractName: string, events: any[]) => string;