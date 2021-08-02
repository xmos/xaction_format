"use strict";
const init = require('../src/init');
test('hasBin for non-existent tool', () => {
    init
        .hasBin('thisToolDoesNotExist')
        .then((res) => expect(res).toBe(false));
});
test('hasBin for installed tool', () => {
    init.hasBin('git').then((res) => expect(res).toBe(true));
});
//# sourceMappingURL=init.test.js.map