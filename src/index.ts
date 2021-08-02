import * as core from '@actions/core';

import {Handler, Handlers} from './handlers/handlers';
import {checkoutBranch} from './git-commands';
import {getCommand, getBranch} from './helpers';
import {init} from './init';

async function run(): Promise<void> {
  const command: string = getCommand();

  // if just a normal comment -- no command
  if (command === '') return;

  const handler: Handler | null = Handlers.getInstance().selectHandler(command);

  if (handler === null) {
    console.log(`Command not recognised:\n${command}`);
    return;
  }

  try {
    await checkoutBranch(await getBranch());
    await handler.handle(command);
  } catch (e) {
    core.setFailed(`An unexpected error occurred:\n ${e.message}`);
  }
}

init().then(run);
