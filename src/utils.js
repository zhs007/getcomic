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
      if (name.charAt(i) >= '0' && name.charAt(i) <= '9') {
        str += name.charAt(i);
      } else {
        break;
      }
    } else {
      if (name.charAt(i) >= '0' && name.charAt(i) <= '9') {
        str += name.charAt(i);
        isnumber = true;
      }
    }
  }

  if (str == '') {
    return -1;
  }

  try {
    return parseInt(str);
  } catch (err) {
    return -1;
  }
}

exports.getNameNumber = getNameNumber;
