const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const {guessPageSize, guessPageSize2} = require('./pagesize');
const {log} = require('jarviscrawlercore');
// const blobStream = require('blob-stream');
const {isValidImage} = require('./img.utils');

/**
 * putImgsInPDF - put some images in a pdf file
 * @param {PDFDocument} doc - document
 * @param {object} s - {w, h}
 * @param {string} rootpath - rootpath
 */
async function putImgsInPDF(doc, s, rootpath) {
  let i = 1;
  while (true) {
    const cifn = path.join(rootpath, i + '.jpg');
    if (!fs.existsSync(cifn)) {
      break;
    }

    const isvalidimg = await isValidImage(cifn);
    if (isvalidimg) {
      try {
        doc.image(cifn, 0, 0, {
          fit: [s.w, s.h],
          align: 'center',
          valign: 'center',
        });
      } catch (err) {
        doc.text('404 - Missing pages or damaged file ' + i);
      }
    } else {
      doc.text('404 - Missing pages or damaged file ' + i);
    }

    doc.addPage();
    i++;
  }
}

/**
 * genPDF - generate a pdf file
 * @param {string} fn - filename
 * @param {string} title - title
 * @param {string} rootpath - rootpath
 */
async function genPDF(fn, title, rootpath) {
  const s = await guessPageSize(rootpath);
  if (s == undefined) {
    log.error('genPDF ' + rootpaths + ' non-files');

    return;
  }

  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({
      // layout: 'landscape',
      size: [s.w, s.h],
    });

    doc.info['Title'] = title;

    const stream = doc.pipe(fs.createWriteStream(fn));

    await putImgsInPDF(doc, s, rootpath);

    doc.end();
    stream.on('finish', () => {
      resolve();
      // get a blob you can do whatever you like with
      // const blob = stream.toBlob('application/pdf');
    });
  });
}

/**
 * genPDF2 - generate a pdf file v2
 * @param {string} fn - filename
 * @param {string} title - title
 * @param {string | array} rootpaths - rootpath or rootpaths
 */
async function genPDF2(fn, title, rootpaths) {
  if (!Array.isArray(rootpaths)) {
    return genPDF(fn, title, rootpaths);
  }

  const s = await guessPageSize2(rootpaths);
  if (s == undefined) {
    log.error('genPDF2 ' + rootpaths + ' non-files');

    return;
  }

  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({
      // layout: 'landscape',
      size: [s.w, s.h],
    });

    doc.info['Title'] = title;

    const stream = doc.pipe(fs.createWriteStream(fn));

    for (let i = 0; i < rootpaths.length; ++i) {
      await putImgsInPDF(doc, s, rootpaths[i]);
    }

    doc.end();
    stream.on('finish', () => {
      resolve();
      // get a blob you can do whatever you like with
      // const blob = stream.toBlob('application/pdf');
    });
  });
}

/**
 * putImgsInPDF3 - put some images in a pdf file
 * @param {PDFDocument} doc - document
 * @param {object} s - {w, h}
 * @param {string} rootpath - rootpath
 */
async function putImgsInPDF3(doc, s, rootpath) {
  let i = 1;
  while (true) {
    const cifn = path.join(rootpath, i + '.png');
    if (!fs.existsSync(cifn)) {
      break;
    }

    const isvalidimg = await isValidImage(cifn);
    if (isvalidimg) {
      try {
        doc.image(cifn, 0, 0, {
          fit: [s.w, s.h],
          align: 'center',
          valign: 'center',
        });
      } catch (err) {
        doc.text('404 - Missing pages or damaged file ' + i);
      }
    } else {
      doc.text('404 - Missing pages or damaged file ' + i);
    }

    doc.addPage();
    i++;
  }
}

/**
 * genPDF3 - generate a pdf file v3
 * @param {string} fn - filename
 * @param {string} title - title
 * @param {string | array} rootpaths - rootpath or rootpaths
 */
async function genPDF3(fn, title, rootpaths) {
  if (!Array.isArray(rootpaths)) {
    return genPDF(fn, title, rootpaths);
  }

  const s = await guessPageSize2(rootpaths);
  if (s == undefined) {
    log.error('genPDF2 ' + rootpaths + ' non-files');

    return;
  }

  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({
      // layout: 'landscape',
      size: [s.w, s.h],
    });

    doc.info['Title'] = title;

    const stream = doc.pipe(fs.createWriteStream(fn));

    for (let i = 0; i < rootpaths.length; ++i) {
      await putImgsInPDF3(doc, s, rootpaths[i]);
    }

    doc.end();
    stream.on('finish', () => {
      resolve();
      // get a blob you can do whatever you like with
      // const blob = stream.toBlob('application/pdf');
    });
  });
}

exports.genPDF = genPDF;
exports.genPDF2 = genPDF2;
exports.genPDF3 = genPDF3;
