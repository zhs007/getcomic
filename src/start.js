const {loadConfig, checkConfig} = require('./config.js');
const {genPDF} = require('./pdf.utils');
const {log, downloadComic} = require('jarviscrawlercore');
const path = require('path');
const fs = require('fs');

/**
 * start
 * @param {string} fn - config filename
 */
async function start(fn) {
  const cfg = loadConfig(fn);
  if (!cfg) {
    log.error('start.loadConfig non-file', {fn: fn});

    return;
  }

  const cfgerr = checkConfig(cfg);
  if (cfgerr) {
    log.error('start.checkConfig error', cfgerr);

    return;
  }

  await downloadComic(
      cfg.isdebug,
      cfg.comicid,
      cfg.roottype,
      path.join(cfg.comicrootpath, cfg.comicid.toString()),
  );

  try {
    const comicjsonfn = path.join(
        cfg.comicrootpath,
        cfg.comicid.toString(),
        cfg.comicid + '.json',
    );
    const comicjsonbuf = fs.readFileSync(comicjsonfn);
    const comicjson = JSON.parse(comicjsonbuf);
    for (let i = 0; i < comicjson.books.length; ++i) {
      if (cfg.roottype >= 0 && cfg.roottype != comicjson.books[i].rootType) {
        continue;
      }

      await genPDF(
          path.join(
              cfg.comicrootpath,
              cfg.comicid.toString(),
              comicjson.books[i].title + '.pdf',
              // cfg.comicid + '_' + comicjson.books[i].name + '.pdf',
          ),
          comicjson.books[i].title,
          path.join(
              cfg.comicrootpath,
              cfg.comicid.toString(),
              comicjson.books[i].name,
          ),
      );
    }
  } catch (err) {
    log.error('start.loadjson error', err);
  }
}

exports.start = start;
