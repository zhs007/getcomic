const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const {genPDF6} = require('./pdf.utils');

/**
 * packagePath
 * @param {string} inpath - path
 */
async function packagePath(inpath) {
  try {
    inpath = path.resolve(inpath);

    const lst = [];
    const lstfn = fs.readdirSync(inpath);
    for (let i = 0; i < lstfn.length; ++i) {
      const fstat = fs.statSync(path.join(inpath, lstfn[i]));
      if (fstat.isDirectory()) {
        await packagePath(path.join(inpath, lstfn[i]));
      } else {
        const img = await sharp(path.join(inpath, lstfn[i]));
        if (img) {
          lst.push(path.join(inpath, lstfn[i]));
        }
      }
    }

    if (lst.length > 0) {
      lst.sort();

      const fnarr = inpath.split('/');
      const fn = fnarr[fnarr.length - 1];

      fnarr.splice(fnarr.length - 1, 1);
      const outpath = fnarr.join('/');

      await genPDF6(path.join(outpath, fn + '.pdf'), fn, lst);
    }
  } catch (err) {
    log.error('webp2jpg ' + inpath + ' error', err);
  }
}

exports.packagePath = packagePath;
