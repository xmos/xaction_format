"use strict";
/*
 * Contains functions to make system calls to git
 * */
Object.defineProperty(exports, "__esModule", { value: true });
exports.push = exports.commit = exports.haveFilesChanged = exports.checkoutBranch = void 0;
// Checkout branch with provided string
const exec_1 = require("@actions/exec");
async function checkoutBranch(branch) {
    await exec_1.exec('git fetch')
        .then((exitCode) => {
        if (exitCode)
            throw new Error('Failed to fetch from remote.');
        // Checkout branch
        // TODO: Is this a security vulnerability? Escaping handled by library
        return exec_1.exec('git checkout', [branch]);
    })
        .then((exitCode) => {
        if (exitCode)
            throw new Error('Failed to fetch from remote.');
        return Promise.resolve();
    });
}
exports.checkoutBranch = checkoutBranch;
// Check output of git diff to see if files have changed
// TODO: there has to be a better way of doing this.
async function haveFilesChanged() {
    let stdout = '';
    return exec_1.exec('git diff', [], {
        listeners: {
            stdout: (data) => {
                stdout += data.toString();
            },
        },
    }).then((exitCode) => {
        if (exitCode)
            throw new Error('Failed to diff changes');
        return Promise.resolve(stdout.length > 0);
    });
}
exports.haveFilesChanged = haveFilesChanged;
async function commit(commitMessage) {
    // Set git email
    return await exec_1.exec('git config --local user.email "41898282+github-actions[bot]@users.noreply.github.com"')
        .then((exitCode) => {
        if (exitCode)
            throw new Error('Error setting git config email\n');
        // Set git name
        return exec_1.exec('git config --local user.name "github-actions[bot]"');
    })
        .then((exitCode) => {
        if (exitCode)
            throw new Error('Error setting git config name\n');
        // Add and commit modified files
        return exec_1.exec('git commit -am', [commitMessage]);
    })
        .then((exitCode) => {
        if (exitCode)
            throw new Error('Error committing\n');
        // Push commit
        return exec_1.exec('git push');
    })
        .then((exitCode) => {
        if (exitCode)
            throw new Error('Error pushing code\n');
        return Promise.resolve(0);
    })
        .catch((e) => {
        // Catch whatever error and re-throw to show which step it failed on
        throw new Error('Failed to commit changes:\n' + e.message);
    });
}
exports.commit = commit;
async function push() {
    const exitCode = await exec_1.exec('git push');
    if (exitCode)
        throw new Error('Error pushing code\n');
}
exports.push = push;
//# sourceMappingURL=git-commands.js.map