"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = require("@actions/glob");
const exec_1 = require("@actions/exec");
const path = require('path');
const handlers_1 = require("./handlers");
const constants_1 = require("../constants");
const inputs = require("../inputs");
const git_commands_1 = require("../git-commands");
/*
 * Deals with /format command
 * */
class HandleFormat {
    static async findFiles() {
        const include = inputs.fileExtensions
            .map((ext) => `**/*.${ext}`)
            .join('\n');
        const excludeDir = inputs.exclude_dirs
            .map((dir) => `!${dir}`)
            .join('\n');
        const excludeFile = inputs.exclude_files
            .map((file) => `!${file}`)
            .join('\n');
        return await glob_1.create(include +
            (excludeDir.length > 0 ? `\n${excludeDir}` : '') +
            (excludeFile.length > 0 ? `\n${excludeFile}` : '')).then((g) => g.globGenerator());
    }
    static async commitAndPush() {
        console.log('Committing and pushing changes...');
        if (await git_commands_1.haveFilesChanged()) {
            await git_commands_1.commit('Auto-formatted Code');
            await git_commands_1.push();
        }
        else {
            console.log('Nothing has changed. Nothing to commit!');
        }
    }
    async handle(command) {
        console.log(`Starting command: ${command}`);
        for await (const file of await HandleFormat.findFiles()) {
            const ext = path.extname(file).substring(1);
            let exitCode;
            // if it's one of the languages formatted by clang
            if (constants_1.clangExtensions.includes(ext))
                exitCode = await exec_1.exec(`clang-format -i -style=${inputs.cStyle} ${file}`);
            // if it's python
            else if (constants_1.pythonExtensions.includes(ext))
                if (inputs.pythonStyle.toLowerCase() === 'black')
                    exitCode = await exec_1.exec(`black ${file}`);
                else
                    exitCode = await exec_1.exec(`yapf -i --style=${inputs.pythonStyle} ${file}`);
            else
                throw new Error(`*.${ext} files are not yet supported`);
            if (exitCode)
                throw new Error(`Error formatting ${file}`);
        }
        await HandleFormat.commitAndPush();
    }
}
handlers_1.Handlers.getInstance().registerHandler('format', new HandleFormat());
//# sourceMappingURL=format.js.map