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
    return new Error('no config.source');
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

  return undefined;
}

exports.loadConfig = loadConfig;
exports.checkConfig = checkConfig;
