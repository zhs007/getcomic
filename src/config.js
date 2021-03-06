const yaml = require('yaml-js');
const fs = require('fs');

/**
 * load config
 * @param {string} cfgfile - cfgfile
 * @return {object} cfg - config
 */
function loadConfig(cfgfile) {
  const fd = fs.readFileSync(cfgfile);
  if (fd) {
    const cfg = yaml.load(fd);

    return cfg;
  }

  return undefined;
}

/**
 * check config
 * @param {object} cfg - config
 * @return {Error} err - error
 */
function checkConfig(cfg) {
  if (!cfg) {
    return new Error('config undefined');
  }

  if (!cfg.source) {
    cfg.source = 'manhuadb';
  }

  if (!cfg.comicid) {
    return new Error('no config.comicid');
  }

  if (cfg.isdebug == undefined) {
    cfg.isdebug = false;
  }

  if (cfg.roottype == undefined) {
    cfg.roottype = -1;
  }

  if (cfg.comicrootpath == undefined) {
    cfg.comicrootpath = './comic';
  }

  if (cfg.outputpdf == undefined) {
    cfg.outputpdf = false;
  }

  if (cfg.publishtelegraph == undefined) {
    cfg.publishtelegraph = false;
  }

  if (cfg.publishtelegraph) {
    if (!cfg.telegraphconfig) {
      cfg.telegraphconfig = './cfg/telegraph.yaml';
    }
  }

  if (cfg.packagebooks == undefined) {
    cfg.packagebooks = 1;
  } else if (typeof cfg.packagebooks != 'number') {
    try {
      const pb = parseInt(cfg.packagebooks);
      cfg.packagebooks = pb;
    } catch (err) {
      cfg.packagebooks = 1;
    }
  }

  if (!cfg.timeout) {
    cfg.timeout = 30 * 1000;
  }

  if (cfg.outputpng == undefined) {
    cfg.outputpng = false;
  }

  if (!Array.isArray(cfg.excludebookid)) {
    cfg.excludebookid = [];
  }

  if (cfg.outputjpg == undefined) {
    cfg.outputjpg = false;
  }

  if (cfg.outputjpgquality == undefined) {
    cfg.outputjpgquality = 70;
  }

  if (cfg.onlypackage !== true) {
    cfg.onlypackage = false;
  }

  return undefined;
}

/**
 * isValidBookid
 * @param {object} cfg - config
 * @param {string} bookid - bookid
 * @return {boolean} isvalid - is valid bookid
 */
function isValidBookid(cfg, bookid) {
  if (cfg.excludebookid.indexOf(bookid) >= 0) {
    return false;
  }

  if (!cfg.bookid) {
    return true;
  }

  if (Array.isArray(cfg.bookid)) {
    if (cfg.bookid.indexOf(bookid) >= 0) {
      return true;
    }

    return false;
  }

  return cfg.bookid == bookid;
}

exports.loadConfig = loadConfig;
exports.checkConfig = checkConfig;
exports.isValidBookid = isValidBookid;
