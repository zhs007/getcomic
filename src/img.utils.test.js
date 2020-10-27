"use strict";

const { getImageSize } = require("./img.utils");

test("isSameImgExtName", () => {
  let ret = getImageSize("./test/003.jpg");
  expect(ret).not.toBe(undefined);
});
