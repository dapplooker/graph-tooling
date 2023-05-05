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
export function runDeploy({ studio, product, subgraphName, node, ipfs, accessToken, manifest, outputDir, skipMigrations, watch, versionLabel }: {
    studio: any;
    product?: string | undefined;
    subgraphName: any;
    node?: string | undefined;
    ipfs: any;
    accessToken: any;
    manifest?: any;
    outputDir?: any;
    skipMigrations?: boolean | undefined;
    watch?: boolean | undefined;
    versionLabel: any;
}): Promise<any>;
