const {loadConfig, checkConfig} = require('./config.js');
const {log, downloadComic} = require('jarviscrawlercore');
const path = require('path');

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
}

exports.start = start;
