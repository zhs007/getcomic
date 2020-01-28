const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const {guessPageSize} = require('./pagesize');
// const blobStream = require('blob-stream');
// const {getImageSize} = require('./img.utils');

/**
 * genPDF - generate a pdf file
 * @param {string} fn - filename
 * @param {string} rootpath - rootpath
 */
async function genPDF(fn, rootpath) {
  const s = await guessPageSize(rootpath);
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      // layout: 'landscape',
      size: [s.w, s.h],
    });

    const stream = doc.pipe(fs.createWriteStream(fn));
    // doc.pipe(blobStream());

    // doc.addPage();
    let i = 1;
    while (true) {
      const cifn = path.join(rootpath, i + '.jpg');
      if (!fs.existsSync(cifn)) {
        break;
      }

      // doc.text(cifn);
      // doc.addPage().text(cifn);
      // doc.addPage().image(cifn, 0, 0);
      // const cs = getImageSize(cifn);
      doc.image(cifn, 0, 0, {
        fit: [s.w, s.h],
        align: 'center',
        valign: 'center',
      });
      doc.addPage();
      i++;
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
