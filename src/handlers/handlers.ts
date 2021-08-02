export interface Handler {
  handle(command: string): void;
}

export class Handlers {
  private static instance: Handlers;
  private readonly list: Map<string, Handler> = new Map<string, Handler>();

  private constructor() {}

  public registerHandler(command: string, handler: Handler) {
    this.list.set(command, handler);
  }

  // returns handler for that command if found, undefined otherwise
  public selectHandler(command: string): Handler | null {
    const handler: Handler | undefined = this.list.get(
      command.substring(1).split(' ')[0]
    );

    if (handler !== undefined) return handler;
    return null;
  }

  public static getInstance(): Handlers {
    if (this.instance === undefined) this.instance = new Handlers();
    return this.instance;
  }
}

// Import all the handlers
import './format';
