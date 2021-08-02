"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handlers = void 0;
class Handlers {
    constructor() {
        this.list = new Map();
    }
    registerHandler(command, handler) {
        this.list.set(command, handler);
    }
    // returns handler for that command if found, undefined otherwise
    selectHandler(command) {
        const handler = this.list.get(command.substring(1).split(' ')[0]);
        if (handler !== undefined)
            return handler;
        return null;
    }
    static getInstance() {
        if (this.instance === undefined)
            this.instance = new Handlers();
        return this.instance;
    }
}
exports.Handlers = Handlers;
// Import all the handlers
require("./format");
//# sourceMappingURL=handlers.js.map