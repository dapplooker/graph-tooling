const { exec } = require("child_process");

/**
 * Create subgraph on custom graph node
 */
const createSubgraph = async ({ subgraphName, node, accessToken }) => {
    let create = `graph create --node ${node} ${subgraphName} --access-token ${accessToken}`;
    exec(create, (error, stdout, stderr) => {
        if (error) {
            console.log(`\nerror in createSubgraph: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`\nstderr in createSubgraph: ${stderr}`);
            return;
        }
        console.log(`\nstdout in createSubgraph: ${stdout}`);
    });
}

module.exports = {
    createSubgraph,
}
