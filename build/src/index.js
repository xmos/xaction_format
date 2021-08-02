"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const handlers_1 = require("./handlers/handlers");
const git_commands_1 = require("./git-commands");
const helpers_1 = require("./helpers");
const init_1 = require("./init");
async function run() {
    const command = helpers_1.getCommand();
    // if just a normal comment -- no command
    if (command === '')
        return;
    const handler = handlers_1.Handlers.getInstance().selectHandler(command);
    if (handler === null) {
        console.log(`Command not recognised:\n${command}`);
        return;
    }
    try {
        await git_commands_1.checkoutBranch(await helpers_1.getBranch());
        await handler.handle(command);
    }
    catch (e) {
        core.setFailed(`An unexpected error occurred:\n ${e.message}`);
    }
}
init_1.init().then(run);
//# sourceMappingURL=index.js.map