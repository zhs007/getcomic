const sharp = require('sharp');
const {log} = require('jarviscrawlercore');

/**
 * getImageSize - get image size
 * @param {string} fn - filename
 * @return {object} obj - {w, h}
 */
async function getImageSize(fn) {
  try {
    const img = await sharp(fn);
    if (img) {
      const metadata = await img.metadata();
      return {w: metadata.width, h: metadata.height};
    }
  } catch (err) {
    log.error('getImageSize ' + fn + ' error', err);
  }

  return undefined;
}

/**
 * isValidImage - is valid image file
 * @param {string} fn - filename
 * @return {boolean} isvalid - isvalid
 */
async function isValidImage(fn) {
  try {
    const img = await sharp(fn);
    if (img) {
      return true;
    }
  } catch (err) {
    log.error('isValidImage ' + fn + ' error', err);
  }

  return false;
}

/**
 * isJPG - is a jpg file
 * @param {string} fn - filename
 * @return {boolean} isjpg - is a jpg file
 */
function isJPG(fn) {
  const lfn = fn.toLowerCase();
  const arr = lfn.split('.');
  if (arr[arr.length - 1] == 'jpg' || arr[arr.length - 1] == 'jpeg') {
    return true;
  }

  return false;
}

/**
 * isWebp - is a webp file
 * @param {string} fn - filename
 * @return {boolean} iswebp - is a webp file
 */
function isWebp(fn) {
  const lfn = fn.toLowerCase();
  const arr = lfn.split('.');
  if (arr[arr.length - 1] == 'webp') {
    return true;
  }

  return false;
}

exports.getImageSize = getImageSize;
exports.isValidImage = isValidImage;
exports.isJPG = isJPG;
exports.isWebp = isWebp;
