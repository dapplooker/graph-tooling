export = AbiCodeGenerator;
declare class AbiCodeGenerator {
    constructor(abi: any);
    abi: any;
    generateModuleImports(): tsCodegen.ModuleImports[];
    generateTypes(): any[];
    _generateCallTypes(): any[];
    _generateEventTypes(): any[];
    _generateInputOrOutput(inputOrOutput: any, index: any, parentClass: any, parentType: any, parentField: any): {
        name: string;
        getter: tsCodegen.Method;
        classes: tsCodegen.Class[];
    } | {
        name: never[];
        getter: tsCodegen.Method;
        classes: never[];
    };
    _tupleTypeName(inputOrOutput: any, index: any, parentClass: any, parentType: any): string;
    _generateTupleType(inputOrOutput: any, index: any, parentClass: any, parentType: any, parentField: any): {
        name: string;
        getter: tsCodegen.Method;
        classes: tsCodegen.Class[];
    };
    _generateSmartContractClass(): any[];
    _getTupleParamType(inputOrOutput: any, index: any, tupleParentType: any): string;
    _indexedInputType(inputType: any): any;
    callableFunctions(): any;
}
import tsCodegen = require("./typescript");
