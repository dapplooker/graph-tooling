const { exec } = require("child_process");

/**
 * Remove or Delete subgraph from custom graph node
 */
const removeSubgraph = async ({ subgraphName, node, accessToken }) => {
    let remove = `graph remove --node ${node} ${subgraphName} --access-token ${accessToken}`;
    exec(remove, (error, stdout, stderr) => {
        if (error) {
            console.log(`\nerror in removeSubgraph: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`\nstderr in removeSubgraph: ${stderr}`);
            return;
        }
        console.log(`\nstdout in removeSubgraph: ${stdout}`);
    });
}

module.exports = {
    removeSubgraph,
}
