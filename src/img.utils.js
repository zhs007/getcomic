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

exports.getImageSize = getImageSize;
exports.isValidImage = isValidImage;
