"use strict";
const fetch = require("node-fetch");
const immutable = require("immutable");
const os = require("os");
const path = require("path");
const toolbox = require("gluegun/toolbox");
const constant = require("./constant");
const { getSubgraphBasename, validateSubgraphName } = require("../command-helpers/subgraph");
const { withSpinner, step } = require("../command-helpers/spinner");
const { generateScaffold, writeScaffold } = require("../command-helpers/scaffold");
const { abiEvents } = require("../scaffold/schema");
const ABI = require("../abi");
const { default: Protocol } = require("../protocols");
const AbiCodeGenerator = require("../protocols/ethereum/codegen/abi");
/**
 * subgraphName: Subgraph name
 * directory: Directory to create the subgraph in
 * network: Ethereum network <mainnet|kovan|rinkeby|ropsten|goerli|poa-core>
 * fromContracts: {
      contractName: contract name
      contractAbi: contract abi,
      contractAddress: contract address,
      templateContracts: {
        contractAbi: template contract abi,
        contractName: template contract name,
        factoryContractEvent: factory contract event which creates instance of template contract,
        factoryContractEventParam: factory contract event param which contains address for instance of of template contract,
      }[],
    }[]
 * etherscanApikey: Api key to fetch ABI from EtherScan
 * indexEvents: Boolean (optional) [default: true]
 * allowSimpleName: Boolean (optional) [default: false]
 * fromExample: Boolean (optional) [default: false], Creates a scaffold based on an example subgraph
 */
const runInit = async ({ subgraphName, directory, network, fromContracts, etherscanApikey, indexEvents = false, allowSimpleName = false, fromExample = false, product = "hosted-service", protocol = "ethereum", node = "https://api.thegraph.com/deploy/", studio }) => {
    console.table([{
        SubgraphName: subgraphName,
        Directory: directory,
        Network: network,
        Contracts: JSON.stringify(fromContracts),
        EtherscanApikey: etherscanApikey,
        IndexEvents: indexEvents,
        AllowSimpleName: allowSimpleName,
        FromExample: fromExample,
        Product: product,
        Protocol: protocol,
        Node: node,
        Studio: studio
    }]);
    if (fromContracts && fromExample) {
        toolbox.print.error(`Only one of --from-example and --from-contract can be used at a time.`);
        process.exitCode = 1;
        return;
    }
    // Detect git
    const git = await toolbox.system.which("git");
    if (git === null) {
        toolbox.print.error(`Git was not found on your system. Please install 'git' so it is in $PATH.`);
        process.exitCode = 1;
        return;
    }
    // Detect Yarn and/or NPM
    const yarn = await toolbox.system.which("yarn");
    const npm = await toolbox.system.which("npm");
    if (!yarn && !npm) {
        toolbox.print.error(`Neither Yarn nor NPM were found on your system. Please install one of them.`);
        process.exitCode = 1;
        return;
    }
    const commands = {
        install: npm ? "npm install" : "yarn",
        codegen: npm ? "npm run codegen" : "yarn codegen",
        deploy: npm ? "npm run deploy" : "yarn deploy"
    };
    // If all parameters are provided from the command-line,
    // go straight to creating the subgraph from the example
    if (fromExample && subgraphName && directory) {
        return await initSubgraphFromExample(toolbox, { allowSimpleName, directory, subgraphName }, { commands });
    }
    // If all parameters are provided from the command-line,
    // go straight to creating the subgraph from an existing contract
    if (fromContracts && subgraphName && directory && network) {
        for (let i = 0; i < fromContracts.length; i++) {
            if (protocol !== "near") {
                const fromContract = fromContracts[i];
                if (fromContract.contractAbi) {
                    try {
                        fromContract.contractAbi = await loadAbiFromFile(fromContract.contractAbi);
                    }
                    catch (e) {
                        toolbox.print.error(`Failed to load ABI: ${e.message}`);
                        process.exitCode = 1;
                        return;
                    }
                }
                else {
                    try {
                        if (constant.nonEtherscanSupportedNetworks.includes(network)) {
                            fromContract.contractAbi = await loadAbiFromBlockScout(network, fromContract.contractAddress);
                        }
                        else {
                            fromContract.contractAbi = await loadAbiFromEtherscan(network, fromContract.contractAddress, etherscanApikey);
                        }
                    }
                    catch (e) {
                        toolbox.print.error(`Failed to load ABI: ${e.message}`);
                        process.exitCode = 1;
                        return;
                    }
                }
                for (let j = 0; j < fromContract.templateContracts.length; j++) {
                    const templateContract = fromContract.templateContracts[j];
                    if (templateContract.contractAbi) {
                        try {
                            templateContract.contractAbi = await loadAbiFromFile(templateContract.contractAbi);
                        }
                        catch (e) {
                            toolbox.print.error(`Failed to load template contract ABI: ${e.message}`);
                            process.exitCode = 1;
                            return;
                        }
                    }
                    else {
                        toolbox.print.error(`Provide ABI file for template contract: ${e.message}`);
                        process.exitCode = 1;
                        return;
                    }
                }
            }
        }
        const protocolInstance = new Protocol(protocol);
        return await initSubgraphFromContract(toolbox, {
            allowSimpleName,
            directory,
            fromContracts,
            indexEvents,
            network,
            subgraphName,
            etherscanApikey,
            node,
            studio,
            product,
            protocolInstance
        }, { commands });
    }
    return `Process Init Form`;
};
const loadAbiFromBlockScout = async (network, address) => await withSpinner(`Fetching ABI from BlockScout`, `Failed to fetch ABI from BlockScout`, `Warnings while fetching ABI from BlockScout`, async () => {
    const result = await fetch(`https://blockscout.com/${network.replace("-", "/")}/api?module=contract&action=getabi&address=${address}`);
    const json = await result.json();
    // BlockScout returns a JSON object that has a `status`, a `message` and
    // a `result` field. The `status` is '0' in case of errors and '1' in
    // case of success
    if (json.status === "1") {
        return new ABI("Contract", undefined, immutable.fromJS(JSON.parse(json.result)));
    }
    throw new Error("ABI not found, try loading it from a local file");
});
const loadAbiFromEtherscan = async (network, address, etherscanApikey) => await withSpinner(`Fetching ABI from Etherscan`, `Failed to fetch ABI from Etherscan`, `Warnings while fetching ABI from Etherscan`, async () => {
    const url = `${constant.etherscanNetworkApiBaseUrlMap.get(network)}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc${etherscanApikey ? "&apikey=" + etherscanApikey : ""}`;
    const result = await fetch(url);
    const json = await result.json();
    // Etherscan returns a JSON object that has a `status`, a `message` and
    // a `result` field. The `status` is '0' in case of errors and '1' in
    // case of success
    if (json.status === "1") {
        return new ABI("Contract", undefined, immutable.fromJS(JSON.parse(json.result)));
    }
    throw new Error("ABI not found, try loading it from a local file");
});
const loadAbiFromFile = async (filename) => {
    const exists = await toolbox.filesystem.exists(filename);
    if (!exists) {
        throw Error("File does not exist.");
    }
    else if (exists === "dir") {
        throw Error("Path points to a directory, not a file.");
    }
    else if (exists === "other") {
        throw Error("Not sure what this path points to.");
    }
    else {
        return await ABI.load("Contract", filename);
    }
};
const revalidateSubgraphName = (toolbox, subgraphName, { allowSimpleName }) => {
    // Fail if the subgraph name is invalid
    try {
        validateSubgraphName(subgraphName, { allowSimpleName });
        return true;
    }
    catch (e) {
        toolbox.print.error(`${e.message}
  Examples:
    $ graph init ${os.userInfo().username}/${subgraphName}
    $ graph init ${subgraphName} --allow-simple-name`);
        return false;
    }
};
const initRepository = async (toolbox, directory) => await withSpinner(`Initialize subgraph repository`, `Failed to initialize subgraph repository`, `Warnings while initializing subgraph repository`, async () => {
    // Remove .git dir in --from-example mode; in --from-contract, we're
    // starting from an empty directory
    const gitDir = path.join(directory, ".git");
    if (toolbox.filesystem.exists(gitDir)) {
        await toolbox.filesystem.remove(gitDir);
    }
    await toolbox.system.run("git init", { cwd: directory });
    await toolbox.system.run("git add --all", { cwd: directory });
    await toolbox.system.run("git commit -m \"Initial commit\"", {
        cwd: directory
    });
    return true;
});
const installDependencies = async (toolbox, directory, installCommand) => await withSpinner(`Install dependencies with ${toolbox.print.colors.muted(installCommand)}`, `Failed to install dependencies`, `Warnings while installing dependencies`, async () => {
    await toolbox.system.run(installCommand, { cwd: directory });
    return true;
});
const runCodegen = async (toolbox, directory, codegenCommand) => await withSpinner(`Generate ABI and schema types with ${toolbox.print.colors.muted(codegenCommand)}`, `Failed to generate code from ABI and GraphQL schema`, `Warnings while generating code from ABI and GraphQL schema`, async () => {
    await toolbox.system.run(codegenCommand, { cwd: directory });
    return true;
});
const printNextSteps = (toolbox, { subgraphName, directory }, { commands }) => {
    const { print } = toolbox;
    const relativeDir = path.relative(process.cwd(), directory);
    // Print instructions
    print.success(`
Subgraph ${print.colors.blue(subgraphName)} created in ${print.colors.blue(relativeDir)}
`);
    print.info(`Next steps:
  1. Run \`${print.colors.muted("graph auth https://api.thegraph.com/deploy/ <access-token>")}\`
      to authenticate with the hosted service. You can get the access token from
      https://thegraph.com/explorer/dashboard/.
  2. Type \`${print.colors.muted(`cd ${relativeDir}`)}\` to enter the subgraph.
  3. Run \`${print.colors.muted(commands.deploy)}\` to deploy the subgraph to
      https://thegraph.com/explorer/subgraph/${subgraphName}.
Make sure to visit the documentation on https://thegraph.com/docs/ for further information.`);
};
const initSubgraphFromExample = async (toolbox, { allowSimpleName, subgraphName, directory }, { commands }) => {
    const { filesystem, print, system } = toolbox;
    // Fail if the subgraph name is invalid
    if (!revalidateSubgraphName(toolbox, subgraphName, { allowSimpleName })) {
        process.exitCode = 1;
        return;
    }
    // Fail if the output directory already exists
    if (filesystem.exists(directory)) {
        print.error(`Directory or file "${directory}" already exists`);
        process.exitCode = 1;
        return;
    }
    // Clone the example subgraph repository
    const cloned = await withSpinner(`Cloning example subgraph`, `Failed to clone example subgraph`, `Warnings while cloning example subgraph`, async (spinner) => {
        await system.run(`git clone http://github.com/graphprotocol/example-subgraph ${directory}`);
        return true;
    });
    if (!cloned) {
        process.exitCode = 1;
        return;
    }
    // Update package.json to match the subgraph name
    const prepared = await withSpinner(`Update subgraph name and commands in package.json`, `Failed to update subgraph name and commands in package.json`, `Warnings while updating subgraph name and commands in package.json`, async (spinner) => {
        try {
            // Load package.json
            const pkgJsonFilename = filesystem.path(directory, "package.json");
            const pkgJson = await filesystem.read(pkgJsonFilename, "json");
            pkgJson.name = getSubgraphBasename(subgraphName);
            for (const name of Object.keys(pkgJson.scripts)) {
                pkgJson.scripts[name] = pkgJson.scripts[name].replace("example", subgraphName);
            }
            delete pkgJson["license"];
            delete pkgJson["repository"];
            // Write package.json
            await filesystem.write(pkgJsonFilename, pkgJson, { jsonIndent: 2 });
            return true;
        }
        catch (e) {
            print.error(`Failed to preconfigure the subgraph: ${e}`);
            filesystem.remove(directory);
            return false;
        }
    });
    if (!prepared) {
        process.exitCode = 1;
        return;
    }
    // Initialize a fresh Git repository
    const repo = await initRepository(toolbox, directory);
    if (repo !== true) {
        process.exitCode = 1;
        return;
    }
    // Install dependencies
    const installed = await installDependencies(toolbox, directory, commands.install);
    if (installed !== true) {
        process.exitCode = 1;
        return;
    }
    // Run code-generation
    const codegen = await runCodegen(toolbox, directory, commands.codegen);
    if (codegen !== true) {
        process.exitCode = 1;
        return;
    }
    printNextSteps(toolbox, { subgraphName, directory }, { commands });
    return true;
};
const initSubgraphFromContract = async (toolbox, { protocolInstance, allowSimpleName, subgraphName, directory, network, fromContracts, indexEvents, etherscanApikey, node, studio, product }, { commands }) => {
    const { print } = toolbox;
    // Fail if the subgraph name is invalid
    if (!revalidateSubgraphName(toolbox, subgraphName, { allowSimpleName })) {
        process.exitCode = 1;
        return;
    }
    // Fail if the output directory already exists
    if (toolbox.filesystem.exists(directory)) {
        print.error(`Directory or file "${directory}" already exists`);
        process.exitCode = 1;
        return;
    }
    for (let i = 0; i < fromContracts.length; i++) {
        const abi = fromContracts[i].contractAbi;
        if (protocolInstance.hasEvents() && abiEvents(abi).length === 0) {
            // Fail if the ABI does not contain any events
            print.error(`ABI does not contain any events`);
            process.exitCode = 1;
            return;
        }
        fromContracts.name = `DummyName${i}`;
        fromContracts.data = fromContracts.contractAbi;
    }
    // Scaffold subgraph from ABI
    print.info("Initializing withSpinner........");
    const scaffold = await withSpinner(`Create subgraph scaffold`, `Failed to create subgraph scaffold`, `Warnings while creating subgraph scaffold`, async (spinner) => {
        const scaffold = await generateScaffold({
            protocolInstance,
            subgraphName,
            network,
            fromContracts,
            indexEvents,
            etherscanApikey,
            node,
            studio,
            product
        }, spinner);
        await writeScaffold(scaffold, directory, spinner);
        return true;
    });
    if (scaffold !== true) {
        process.exitCode = 1;
        return;
    }
    // Initialize a fresh Git repository
    print.info("Initializing repository.");
    const repo = await initRepository(toolbox, directory);
    if (repo !== true) {
        process.exitCode = 1;
        return;
    }
    // Install dependencies
    print.info("Installing dependencies.");
    const installed = await installDependencies(toolbox, directory, commands.install);
    if (installed !== true) {
        process.exitCode = 1;
        return;
    }
    // Run code-generation
    const codegen = await runCodegen(toolbox, directory, commands.codegen);
    if (codegen !== true) {
        process.exitCode = 1;
        return;
    }
    printNextSteps(toolbox, { subgraphName, directory }, { commands });
    return true;
};
module.exports = {
    runInit,
    loadAbiFromBlockScout,
    loadAbiFromEtherscan,
    loadAbiFromFile,
    initSubgraphFromContract,
    initSubgraphFromExample
};
