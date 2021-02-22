'use strict';

const {getNameNumber, fixFilename} = require('./utils');

test('utils.getNameNumber 第123话 - 456', () => {
  const ret = getNameNumber('第123话 - 456');

  expect(ret).toBe(123);
});

test('utils.getNameNumber 456', () => {
  const ret = getNameNumber('456号123');

  expect(ret).toBe(456);
});

test('utils.getNameNumber 第123.5话 - 456', () => {
  const ret = getNameNumber('第123.5话 - 456');

  expect(ret).toBe(123.5);
});

test('utils.fixFilename 第121話一秒/二百五十年（19P） - 第121話一秒二百五十年（19P）', () => {
  const ret = fixFilename('第121話一秒/二百五十年（19P）');

  expect(ret).toBe('第121話一秒二百五十年（19P）');
});
