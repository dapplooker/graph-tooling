import { Contract } from "./index";
export declare const generateFieldAssignment: (key: string[], value: string[]) => string;
export declare const generateFieldAssignments: ({ index, input }: {
    index: number;
    input: any;
}) => any;
/**
 * Map of input names that are reserved so we do not use them as field names to avoid conflicts
 */
export declare const INPUT_NAMES_BLACKLIST: {
    /** Related to https://github.com/graphprotocol/graph-tooling/issues/710 */
    readonly id: "id";
};
export declare const renameInput: (name: string, subgraphName: string) => string;
export declare const generateEventFieldAssignments: (event: any, contractName: string) => any;
export declare const generateEventIndexingHandlers: ({ events, contractName, contract, isTemplateContract, methods }: {
    events: any[];
    contractName: string;
    contract: Contract;
    isTemplateContract: boolean;
    methods: any[];
}) => string;
