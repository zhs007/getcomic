'use strict';

const {getNameNumber} = require('./utils');

test('utils.getNameNumber 第123话 - 456', () => {
  const ret = getNameNumber('第123话 - 456');

  expect(ret).toBe(123);
});

test('utils.getNameNumber 456', () => {
  const ret = getNameNumber('456号123');

  expect(ret).toBe(456);
});
