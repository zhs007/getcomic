const fs = require('fs');

/**
 * isSameFile - is same file
 * @param {string} fn0 - filename
 * @param {string} fn1 - filename
 * @return {boolean} ret - is same file
 */
function isSameFile(fn0, fn1) {
  const buf0 = fs.readFileSync(fn0);
  const buf1 = fs.readFileSync(fn1);

  return buf0.equals(buf1);
}

exports.isSameFile = isSameFile;
