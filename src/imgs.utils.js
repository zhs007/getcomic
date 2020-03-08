const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const {log} = require('jarviscrawlercore');
const {isWebp} = require('./img.utils');

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

exports.webp2jpg = webp2jpg;
