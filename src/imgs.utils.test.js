'use strict';

const {
  webp2png,
  webp2jpg,
  jpg2png,
  isSameImgExtName,
  countImgs,
} = require('./imgs.utils');
const {isSameFile} = require('./test.utils');
const fs = require('fs');

test('imgs.utils', async () => {
  await webp2jpg('./test');

  let ret = isSameFile('./test/001.jpg', './test/001s.jpg');
  fs.unlinkSync('./test/001.jpg');

  expect(ret).toBe(true);

  await webp2png('./test');

  ret = isSameFile('./test/001.png', './test/001ss.png');
  fs.unlinkSync('./test/001.png');

  expect(ret).toBe(true);

  await jpg2png('./test');

  ret = isSameFile('./test/002.png', './test/002s.png');
  fs.unlinkSync('./test/002.png');
  fs.unlinkSync('./test/001s.png');
  fs.unlinkSync('./test/003.png');

  expect(ret).toBe(true);
});

test('isSameImgExtName', () => {
  expect(isSameImgExtName('a.png', '.png')).toBe(true);
});

test('countImgs', () => {
  expect(countImgs('./test', '.jpg')).toBe(3);
});
