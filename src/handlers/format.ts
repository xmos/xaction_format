import {Globber, create} from '@actions/glob';
import {exec} from '@actions/exec';
const path = require('path');

import {Handler, Handlers} from './handlers';
import {clangExtensions, pythonExtensions} from '../constants';
import * as inputs from '../inputs';
import {haveFilesChanged, commit, push} from '../git-commands';

/*
 * Deals with /format command
 * */
class HandleFormat implements Handler {
  private static async findFiles(): Promise<
    AsyncGenerator<string, void, unknown>
  > {
    const include: string = inputs.fileExtensions
      .map((ext: string) => `**/*.${ext}`)
      .join('\n');

    const excludeDir: string = inputs.exclude_dirs
      .map((dir: string) => `!${dir}`)
      .join('\n');

    const excludeFile: string = inputs.exclude_files
      .map((file: string) => `!${file}`)
      .join('\n');

    return await create(
      include +
        (excludeDir.length > 0 ? `\n${excludeDir}` : '') +
        (excludeFile.length > 0 ? `\n${excludeFile}` : '')
    ).then((g: Globber) => g.globGenerator());
  }

  private static async commitAndPush(): Promise<void> {
    console.log('Committing and pushing changes...');
    if (await haveFilesChanged()) {
      await commit('Auto-formatted Code');
      await push();
    } else {
      console.log('Nothing has changed. Nothing to commit!');
    }
  }

  async handle(command: string) {
    console.log(`Starting command: ${command}`);

    for await (const file of await HandleFormat.findFiles()) {
      const ext = path.extname(file).substring(1);
      let exitCode;
      // if it's one of the languages formatted by clang
      if (clangExtensions.includes(ext))
        exitCode = await exec(
          `clang-format -i -style=${inputs.cStyle} ${file}`
        );
      // if it's python
      else if (pythonExtensions.includes(ext))
        if (inputs.pythonStyle.toLowerCase() === 'black')
          exitCode = await exec(`black ${file}`);
        else
          exitCode = await exec(
            `yapf -i --style=${inputs.pythonStyle} ${file}`
          );
      else throw new Error(`*.${ext} files are not yet supported`);

      if (exitCode) throw new Error(`Error formatting ${file}`);
    }

    await HandleFormat.commitAndPush();
  }
}

Handlers.getInstance().registerHandler('format', new HandleFormat());
