const {loadConfig, checkConfig} = require('./config.js');
const {genPDF} = require('./pdf.utils');
const {webp2jpg} = require('./imgs.utils');
const {log, downloadComic, parseComicBookURL} = require('jarviscrawlercore');
const {telegraph} = require('adarender');
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

  let tgobj;
  if (cfg.publishtelegraph) {
    const ret = await telegraph.initAccount(cfg.telegraphconfig);
    if (ret.error) {
      console.log('telegraph.initAccount fail. ' + ret.error);

      return;
    }

    console.log('telegraph.initAccount ' + JSON.stringify(ret.telegraph));
    tgobj = ret.telegraph;

    const ai = await telegraph.getAccountInfo(tgobj);
    console.log('telegraph.getAccountInfo ' + JSON.stringify(ai));

    const pl = await telegraph.getTotalPageList(tgobj);
    console.log('telegraph.getTotalPageList ' + JSON.stringify(pl));
  }

  await downloadComic(
      cfg.isdebug,
      cfg.comicid,
      cfg.bookid,
      cfg.roottype,
      path.join(cfg.comicrootpath, cfg.comicid.toString()),
      cfg.source,
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
      if (!cfg.bookid) {
        if (cfg.roottype >= 0 && cfg.roottype != comicjson.books[i].rootType) {
          continue;
        }
      } else {
        const cbret = parseComicBookURL(comicjson.books[i].url);
        if (cbret instanceof Error || cbret.bookid != cfg.bookid) {
          continue;
        }
      }

      if (cfg.outputpdf) {
        if (cfg.source == 'manhuagui') {
          await webp2jpg(
              path.join(
                  cfg.comicrootpath,
                  cfg.comicid.toString(),
                  comicjson.books[i].name,
              ),
          );
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

      if (tgobj) {
        const page = await telegraph.publishImgs(
            tgobj,
            comicjson.name + '-' + comicjson.books[i].name,
            (j) => {
              const fn = path.join(
                  cfg.comicrootpath,
                  cfg.comicid.toString(),
                  comicjson.books[i].name,
                  j + '.jpg',
              );
              if (fs.existsSync(fn)) {
                return fn;
              }

              return;
            },
            1,
            999,
        );
        console.log('telegraph.publishImgs ' + JSON.stringify(page));
      }
    }

    if (tgobj) {
      const pl = await telegraph.getTotalPageList(tgobj);
      console.log('telegraph.getTotalPageList ' + JSON.stringify(pl));
    }
  } catch (err) {
    log.error('start.loadjson error', err);
  }
}

exports.start = start;
