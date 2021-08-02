"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommand = exports.getBranch = exports.octokit = void 0;
// Gets the branch that the PR is merging from
const github_1 = require("@actions/github");
const core = require("@actions/core");
const inputs_1 = require("./inputs");
exports.octokit = github_1.getOctokit(inputs_1.token);
async function getBranch() {
    try {
        // Use context info to get the head reference for source branch of PR
        return exports.octokit.rest.pulls
            .get({
            owner: github_1.context.issue.owner,
            repo: github_1.context.issue.repo,
            pull_number: github_1.context.issue.number,
        })
            .then((resp) => {
            return Promise.resolve(resp.data.head.ref);
        });
    }
    catch (error) {
        core.setFailed(error.message);
        return Promise.reject();
    }
}
exports.getBranch = getBranch;
// Returns first line of comment if it starts with a slash, empty string otherwise
function getCommand() {
    if (github_1.context.payload.comment === undefined)
        throw new Error('context.payload.comment is undefined.');
    const comment = github_1.context.payload.comment.body;
    if (comment[0] === '/')
        return comment.split(/[\n\r]/)[0];
    return '';
}
exports.getCommand = getCommand;
//# sourceMappingURL=helpers.js.map