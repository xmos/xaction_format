const init = require('../src/init');

test('hasBin for non-existent tool', () => {
  init
    .hasBin('thisToolDoesNotExist')
    .then((res: boolean) => expect(res).toBe(false));
});

test('hasBin for installed tool', () => {
  init.hasBin('git').then((res: boolean) => expect(res).toBe(true));
});
