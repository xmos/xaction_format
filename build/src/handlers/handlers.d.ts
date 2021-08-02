export interface Handler {
    handle(command: string): void;
}
export declare class Handlers {
    private static instance;
    private readonly list;
    private constructor();
    registerHandler(command: string, handler: Handler): void;
    selectHandler(command: string): Handler | null;
    static getInstance(): Handlers;
}
import './format';
