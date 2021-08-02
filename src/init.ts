// Check if binary exists (for system calls)
import {exec} from '@actions/exec';
import {requiredBinaries} from './constants';
import * as core from '@actions/core';
import {isCommenterAuthorised} from "./authorisation";

export async function hasBin(name: string): Promise<boolean> {
  return exec('which', [name]).then((exitCode: number) => {
    if (exitCode) return Promise.resolve(false);
    return Promise.resolve(true);
  });
}

function ensureDependenciesResolved(): Promise<void> {
  return Promise.all(
    requiredBinaries.map(async (binary: string) => await hasBin(binary))
  ).then(results => {
    const failed: Array<string> = [];
    results.forEach((res, index) => {
      if (res === false) failed.push(requiredBinaries[index]); // Promise.all preserves order, so this is works
    });
    if (failed.length > 0)
      core.setFailed(
        'The following commands were unavailable:\n\t' + failed.join('\n\t')
      );
  });
}

function installPipPackages() {
  // install pip packages for auto-formatting python
  return exec('python -m pip install --upgrade pip')
    .then((exitCode: number) => {
      if (exitCode) throw new Error("Couldn't update pip");

      return exec('pip install yapf');
    })
    .then(async (exitCode: number) => {
      if (exitCode || !(await hasBin('yapf')))
        throw new Error("Couldn't install yapf");

      return exec('pip install black');
    })
    .then(async (exitCode: number) => {
      if (exitCode || !(await hasBin('black')))
        throw new Error("Couldn't install black");
    })
    .catch((e: Error) => {
      core.setFailed('Unexpected error: ' + e.message);
    });
}

export async function init(): Promise<void> {
  if (!isCommenterAuthorised()) {
    return;
  }

  await ensureDependenciesResolved();
  await installPipPackages();
}
