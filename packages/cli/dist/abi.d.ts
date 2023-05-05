export = ABI;
declare class ABI {
    static oldEventSignature(event: any): string;
    static eventSignature(event: any): string;
    static normalized(json: any): any;
    static load(name: any, file: any): import("./abi");
    constructor(name: any, file: any, data: any);
    name: any;
    file: any;
    data: any;
    codeGenerator(): AbiCodeGenerator;
    /**
     * For the ABI of a function, returns a string function signature compatible
     * with the Rust `ethabi` library. It is of the form
     *
     *     <function>([<input-type-1>, ...])[:(<output-type-1,...)]
     *
     * A few examples for a function called `example`:
     *
     * - No inputs or outputs: `example()`
     * - One input and output: `example(uint256):(bool)`
     * - Multiple inputs and outputs: `example(uint256,(string,bytes32)):(bool,uint256)`
     */
    functionSignature(fn: any): string;
    oldEventSignatures(): any;
    eventSignatures(): any;
    callFunctions(): any;
    callFunctionSignatures(): any;
}
import AbiCodeGenerator = require("./codegen/abi");
