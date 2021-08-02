"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.hasBin = void 0;
// Check if binary exists (for system calls)
const exec_1 = require("@actions/exec");
const constants_1 = require("./constants");
const core = require("@actions/core");
async function hasBin(name) {
    return exec_1.exec('which', [name]).then((exitCode) => {
        if (exitCode)
            return Promise.resolve(false);
        return Promise.resolve(true);
    });
}
exports.hasBin = hasBin;
function ensureDependenciesResolved() {
    return Promise.all(constants_1.requiredBinaries.map(async (binary) => await hasBin(binary))).then(results => {
        const failed = [];
        results.forEach((res, index) => {
            if (res === false)
                failed.push(constants_1.requiredBinaries[index]); // Promise.all preserves order, so this is works
        });
        if (failed.length > 0)
            core.setFailed('The following commands were unavailable:\n\t' + failed.join('\n\t'));
    });
}
function installPipPackages() {
    // install pip packages for auto-formatting python
    return exec_1.exec('python -m pip install --upgrade pip')
        .then((exitCode) => {
        if (exitCode)
            throw new Error("Couldn't update pip");
        return exec_1.exec('pip install yapf');
    })
        .then(async (exitCode) => {
        if (exitCode || !(await hasBin('yapf')))
            throw new Error("Couldn't install yapf");
        return exec_1.exec('pip install black');
    })
        .then(async (exitCode) => {
        if (exitCode || !(await hasBin('black')))
            throw new Error("Couldn't install black");
    })
        .catch((e) => {
        core.setFailed('Unexpected error: ' + e.message);
    });
}
async function init() {
    await ensureDependenciesResolved();
    await installPipPackages();
}
exports.init = init;
//# sourceMappingURL=init.js.map