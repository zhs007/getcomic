const fs = require('fs');
const path = require('path');

/**
 * getNameNumber - 第123回 -> 123
 * @param {string} name - name
 * @return {int} number - number
 */
function getNameNumber(name) {
  let str = '';
  let isnumber = false;
  for (let i = 0; i < name.length; ++i) {
    if (isnumber) {
      if (
        (name.charAt(i) >= '0' && name.charAt(i) <= '9') ||
        name.charAt(i) == '.'
      ) {
        str += name.charAt(i);
      } else {
        break;
      }
    } else {
      if (
        (name.charAt(i) >= '0' && name.charAt(i) <= '9') ||
        name.charAt(i) == '.'
      ) {
        str += name.charAt(i);
        isnumber = true;
      }
    }
  }

  if (str == '') {
    return -1;
  }

  try {
    return parseFloat(str);
  } catch (err) {
    return -1;
  }
}

/**
 * printInfo - print infomation
 */
function printInfo() {
  const proj = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../package.json')),
  );

  console.log('getcomic v' + proj.version + '.');
  console.log('The project\'s url is https://github.com/zhs007/getcomic .');
  console.log('Author is  Zerro Zhao (zerrozhao@gmail.com).');
}

/**
 * fixFilename - fix filename
 * @param {string} fn - filename
 * @return {string} fn - a valid filename
 */
function fixFilename(fn) {
  let fn1 = fn.trim();

  const arr = ['\\', '/', '"', '\''];
  for (let i = 0; i < arr.length; ++i) {
    fn1 = fn1.replace(arr[i], '');
  }

  return fn1;
}

exports.getNameNumber = getNameNumber;
exports.printInfo = printInfo;
exports.fixFilename = fixFilename;
