/*
 * Contains functions to make system calls to git
 * */

// Checkout branch with provided string
import {exec} from '@actions/exec';

export async function checkoutBranch(branch: string): Promise<void> {
  await exec('git fetch')
    .then((exitCode: number): Promise<number> => {
      if (exitCode) throw new Error('Failed to fetch from remote.');

      // Checkout branch
      return exec('git checkout', [branch]);
    })
    .then((exitCode: number): Promise<void> => {
      if (exitCode) throw new Error('Failed to fetch from remote.');

      return Promise.resolve();
    });
}

// Check output of git diff to see if files have changed
// TODO: there has to be a better way of doing this.
export async function haveFilesChanged(): Promise<Boolean> {
  let stdout = '';
  return exec('git diff', [], {
    listeners: {
      stdout: (data: Buffer) => {
        stdout += data.toString();
      },
    },
  }).then((exitCode: number): Promise<boolean> => {
    if (exitCode) throw new Error('Failed to diff changes');

    return Promise.resolve(stdout.length > 0);
  });
}

export async function commit(commitMessage: string): Promise<number> {
  // Set git email
  return await exec(
    'git config --local user.email "41898282+github-actions[bot]@users.noreply.github.com"'
  )
    .then((exitCode: number): Promise<number> => {
      if (exitCode) throw new Error('Error setting git config email\n');
      // Set git name
      return exec('git config --local user.name "github-actions[bot]"');
    })
    .then((exitCode: number): Promise<number> => {
      if (exitCode) throw new Error('Error setting git config name\n');

      // Add and commit modified files
      return exec('git commit -am', [commitMessage]);
    })
    .then((exitCode: number): Promise<number> => {
      if (exitCode) throw new Error('Error committing\n');

      // Push commit
      return exec('git push');
    })
    .then((exitCode: number): Promise<number> => {
      if (exitCode) throw new Error('Error pushing code\n');

      return Promise.resolve(0);
    })
    .catch((e: Error) => {
      // Catch whatever error and re-throw to show which step it failed on
      throw new Error('Failed to commit changes:\n' + e.message);
    });
}

export async function push(): Promise<void> {
  const exitCode: number = await exec('git push');
  if (exitCode) throw new Error('Error pushing code\n');
}
