import * as core from '@actions/core';
export const fileExtensions: Array<string> =
  core.getInput('file-extensions') !== ''
    ? core.getInput('file-extensions').split(' ')
    : [];
export const cStyle: string = core.getInput('c-style');
export const pythonStyle: string = core.getInput('python-style');
export const exclude_dirs: Array<string> =
  core.getInput('exclude-dirs') !== ''
    ? core.getInput('exclude-dirs').split(' ')
    : [];
export const exclude_files: Array<string> =
  core.getInput('exclude-files') !== ''
    ? core.getInput('exclude-files').split(' ')
    : [];
export const token: string = core.getInput('token');
