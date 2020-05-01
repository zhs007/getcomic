const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const {log} = require('jarviscrawlercore');
const {isWebp, isJPG} = require('./img.utils');

/**
 * webp2jpg - webp to jpg
 * @param {string} inpath - input path
 * @return {error} err - error
 */
async function webp2jpg(inpath) {
  try {
    const lstfn = fs.readdirSync(inpath);
    for (let i = 0; i < lstfn.length; ++i) {
      if (isWebp(lstfn[i])) {
        const img = await sharp(path.join(inpath, lstfn[i]));
        if (img) {
          const arr = lstfn[i].split('.webp');
          const img2 = await img.toFormat('jpeg');
          await img2.toFile(path.join(inpath, arr[0] + '.jpg'));

          // if (img3) {
          //   log.debug('webp2jpg ' + arr[0] + '.jpg' + ' ok.');
          // }
        }
      }
    }
  } catch (err) {
    log.error('webp2jpg ' + inpath + ' error', err);
  }

  return undefined;
}

/**
 * webp2png - webp to png
 * @param {string} inpath - input path
 * @return {error} err - error
 */
async function webp2png(inpath) {
  try {
    const lstfn = fs.readdirSync(inpath);
    for (let i = 0; i < lstfn.length; ++i) {
      if (isWebp(lstfn[i])) {
        const img = await sharp(path.join(inpath, lstfn[i]));
        if (img) {
          const arr = lstfn[i].split('.webp');
          const img2 = await img.toFormat('png');
          await img2.toFile(path.join(inpath, arr[0] + '.png'));

          // if (img3) {
          //   log.debug('webp2jpg ' + arr[0] + '.jpg' + ' ok.');
          // }
        }
      }
    }
  } catch (err) {
    log.error('webp2png ' + inpath + ' error', err);
  }

  return undefined;
}

/**
 * jpg2png - jpg to png
 * @param {string} inpath - input path
 * @return {error} err - error
 */
async function jpg2png(inpath) {
  try {
    const lstfn = fs.readdirSync(inpath);
    for (let i = 0; i < lstfn.length; ++i) {
      if (isJPG(lstfn[i])) {
        const img = await sharp(path.join(inpath, lstfn[i]));
        if (img) {
          const arr = lstfn[i].split('.jpg');
          const img2 = await img.toFormat('png');
          await img2.toFile(path.join(inpath, arr[0] + '.png'));

          // if (img3) {
          //   log.debug('webp2jpg ' + arr[0] + '.jpg' + ' ok.');
          // }
        }
      }
    }
  } catch (err) {
    log.error('jpg2png ' + inpath + ' error', err);
  }

  return undefined;
}

/**
 * webp2jpeg - webp to jpeg
 * @param {string} inpath - input path
 * @return {error} err - error
 */
async function webp2jpeg(inpath) {
  try {
    const lstfn = fs.readdirSync(inpath);
    for (let i = 0; i < lstfn.length; ++i) {
      if (isWebp(lstfn[i])) {
        const img = await sharp(path.join(inpath, lstfn[i]));
        if (img) {
          const arr = lstfn[i].split('.webp');
          const img2 = await img.toFormat('jpeg');
          await img2.toFile(path.join(inpath, arr[0] + '.jpeg'));

          // if (img3) {
          //   log.debug('webp2jpg ' + arr[0] + '.jpg' + ' ok.');
          // }
        }
      }
    }
  } catch (err) {
    log.error('webp2jpeg ' + inpath + ' error', err);
  }

  return undefined;
}

/**
 * jpg2jpeg - jpg to jpeg
 * @param {string} inpath - input path
 * @return {error} err - error
 */
async function jpg2jpeg(inpath) {
  try {
    const lstfn = fs.readdirSync(inpath);
    for (let i = 0; i < lstfn.length; ++i) {
      if (isJPG(lstfn[i])) {
        const img = await sharp(path.join(inpath, lstfn[i]));
        if (img) {
          const arr = lstfn[i].split('.jpg');
          const img2 = await img.toFormat('jpeg');
          await img2.toFile(path.join(inpath, arr[0] + '.jpeg'));

          // if (img3) {
          //   log.debug('webp2jpg ' + arr[0] + '.jpg' + ' ok.');
          // }
        }
      }
    }
  } catch (err) {
    log.error('jpg2jpeg ' + inpath + ' error', err);
  }

  return undefined;
}

exports.webp2jpg = webp2jpg;
exports.webp2png = webp2png;
exports.jpg2png = jpg2png;
exports.webp2jpeg = webp2jpeg;
exports.jpg2jpeg = jpg2jpeg;
