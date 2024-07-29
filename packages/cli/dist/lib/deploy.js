"use strict";
const URL = require('url').URL;
const chalk = require('chalk');
const { identifyDeployKey } = require('../command-helpers/auth');
const { createCompiler } = require('../command-helpers/compiler');
const { createJsonRpcClient } = require('../command-helpers/jsonrpc');
const { validateNodeUrl } = require('../command-helpers/node');
const { withSpinner } = require('../command-helpers/spinner');
const { validateSubgraphName } = require('../command-helpers/subgraph');
const { filesystem, print, system } = require('gluegun/toolbox');
const DataSourcesExtractor = require('../command-helpers/data-sources');
const { default: Protocol } = require('../protocols');
const { chooseNodeUrl } = require('../command-helpers/node');
/**
 * subgraphName: Subgraph name
 * node: Graph node to deploy the subgraph to
 * ipfs: Upload build results to an IPFS node
 * accessToken: Graph access token
 * manifest: Subgraph manifest (Optional) [default: ./subgraph.yaml]
 * outputDir: Directory (Optional) [default: ./build/] Output directory for build results
 * skipMigrations: Boolean (Optional) [default: false] Skip subgraph migrations
 * watch: Boolean (Optional) [default: false] Regenerate types when subgraph files change
 */
const runDeploy = async ({ studio, product = 'hosted-service', subgraphName, node = 'https://api.thegraph.com/deploy/', ipfs, accessToken, manifest = filesystem.resolve('subgraph.yaml'), outputDir = filesystem.path('build'), skipMigrations = false, watch = false, versionLabel }) => {
    console.log(`
    studio:${studio}\nproduct:${product}\nsubgraphName:${subgraphName}\nnode:${node}\n
    ipfs:${ipfs}\naccessToken:${accessToken}\nmanifest:${manifest}\noutputDir:${outputDir}\n
    skipMigrations:${skipMigrations}\nwatch:${watch}\nversionLabel:${versionLabel}`);
    // Fall back to default values for options / parameters
    outputDir = outputDir && outputDir !== '' ? outputDir : filesystem.path('build');
    manifest =
        manifest !== undefined && manifest !== ''
            ? manifest
            : filesystem.resolve('subgraph.yaml');
    // Validate the subgraph name
    if (!subgraphName) {
        print.error('No subgraph name provided');
        process.exitCode = 1;
        return;
    }
    ({ node } = chooseNodeUrl({ product, studio, node }));
    // Validate node
    if (!node) {
        print.error(`No Graph node provided`);
        process.exitCode = 1;
        return;
    }
    try {
        validateNodeUrl(node);
    }
    catch (e) {
        print.error(`Graph node "${node}" is invalid: ${e.message}`);
        process.exitCode = 1;
        return;
    }
    // Validate IPFS
    if (!ipfs) {
        print.error(`No IPFS node provided`);
        process.exitCode = 1;
        return;
    }
    const dataSourcesAndTemplates = await DataSourcesExtractor.fromFilePath(manifest);
    let protocol = Protocol.fromDataSources(dataSourcesAndTemplates);
    const isStudio = node.match(/studio/);
    const isHostedService = node.match(/thegraph.com/) && !isStudio;
    let compiler = createCompiler(manifest, {
        ipfs,
        outputDir,
        outputFormat: 'wasm',
        skipMigrations,
        blockIpfsMethods: isStudio,
        protocol,
    });
    // Exit with an error code if the compiler couldn't be created
    if (!compiler) {
        process.exitCode = 1;
        return;
    }
    let hostedService = node.match(/thegraph.com/) && !isStudio;
    let requestUrl = new URL(node);
    let client = createJsonRpcClient(requestUrl);
    // Exit with an error code if the client couldn't be created
    if (!client) {
        process.exitCode = 1;
        return;
    }
    // Use the access token, if one is set
    accessToken = await identifyDeployKey(node, accessToken);
    if (accessToken !== undefined && accessToken !== null) {
        client.options.headers = { Authorization: 'Bearer ' + accessToken };
    }
    let deploySubgraph = async (ipfsHash) => {
        let spinner = print.spin(`Deploying to Graph node ${requestUrl}`);
        //       `Failed to deploy to Graph node ${requestUrl}`,
        client.request('subgraph_deploy', { name: subgraphName, ipfs_hash: ipfsHash, version_label: versionLabel }, async (requestError, jsonRpcError, res) => {
            if (jsonRpcError) {
                spinner.fail(`Failed to deploy to Graph node ${requestUrl}: ${jsonRpcError.message}`);
                // Provide helpful advice when the subgraph has not been created yet
                if (jsonRpcError.message.match(/subgraph name not found/)) {
                    if (hostedService) {
                        print.info(`
	You may need to created it at https://thegraph.com/explorer/dashboard.`);
                    }
                    else {
                        print.info(`
	Make sure to create the subgraph first by running the following command:
	$ graph create --node ${node} ${subgraphName}`);
                    }
                }
                process.exitCode = 1;
                spinner.fail(`Subgraph deployment Fail code  ${jsonRpcError.code}`);
                spinner.fail(`Subgraph deployment Fail message  ${jsonRpcError.message}`);
                throw new Error(`Failed to deploy Type; JSONRPC Error subgraph code: ${jsonRpcError.code} and Message ${jsonRpcError.message}`);
            }
            else if (requestError) {
                process.exitCode = 1;
                spinner.fail(`HTTP error deploying the subgraph ${requestError.code}`);
                spinner.fail(`Subgraph deployment Fail code  ${requestError.code}`);
                spinner.fail(`Subgraph deployment Fail message  ${requestError.message}`);
                throw new Error(`Failed to deploy subgraph Type: Request Error code: ${requestError.code} and Message ${requestError.message}`);
            }
            else {
                spinner.stop();
                const base = requestUrl.protocol + '//' + requestUrl.hostname;
                let playground = res.playground;
                let queries = res.queries;
                let subscriptions = res.subscriptions;
                // Add a base URL if graph-node did not return the full URL
                if (playground.charAt(0) === ':') {
                    playground = base + playground;
                }
                if (queries.charAt(0) === ':') {
                    queries = base + queries;
                }
                if (subscriptions.charAt(0) === ':') {
                    subscriptions = base + subscriptions;
                }
                if (hostedService) {
                    print.success(`Deployed to ${chalk.blue(`https://thegraph.com/explorer/subgraph/${subgraphName}`)}`);
                }
                else {
                    print.success(`Deployed to ${chalk.blue(`${playground}`)}`);
                }
                print.info('\nSubgraph endpoints:');
                print.info(`Queries (HTTP):     ${queries}`);
                print.info(`Subscriptions (WS): ${subscriptions}`);
                print.info(``);
            }
        });
    };
    if (watch) {
        await compiler.watchAndCompile(async (ipfsHash) => {
            if (ipfsHash !== undefined) {
                await deploySubgraph(ipfsHash);
            }
            return ipfsHash;
        });
    }
    else {
        let result = await compiler.compile({ validate: true });
        if (result === undefined || result === false) {
            // Compilation failed, not deploying.
            process.exitCode = 1;
            return;
        }
        await deploySubgraph(result);
        return result;
    }
};
module.exports = {
    runDeploy,
};