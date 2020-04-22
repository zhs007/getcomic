const {loadConfig, checkConfig, isValidBookid} = require('./config.js');
const {genPDF2, genPDF3} = require('./pdf.utils');
const {webp2jpg, webp2png, jpg2png} = require('./imgs.utils');
const {getNameNumber} = require('./utils');
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
      cfg.timeout,
  );

  try {
    const comicjsonfn = path.join(
        cfg.comicrootpath,
        cfg.comicid.toString(),
        cfg.comicid + '.json',
    );
    const comicjsonbuf = fs.readFileSync(comicjsonfn);
    const comicjson = JSON.parse(comicjsonbuf);

    comicjson.books.sort((v1, v2) => {
      const id1 = getNameNumber(v1.name);
      const id2 = getNameNumber(v2.name);

      // 将无数字的排在最后
      if (id1 < 0 && id2 < 0) {
        if (v1.name < v2.name) {
          return -1;
        } else if (v1.name > v2.name) {
          return 1;
        }

        return 0;
      }

      if (id1 < 0) {
        return 1;
      }

      if (id2 < 0) {
        return -1;
      }

      if (id1 < id2) {
        return -1;
      }

      if (id1 > id2) {
        return 1;
      }

      if (id1 == id2) {
        if (v1.name < v2.name) {
          return -1;
        }

        if (v1.name > v2.name) {
          return 1;
        }
      }

      return 0;
    });

    const curpaths = [];
    let starti = 0;
    for (let i = 0; i < comicjson.books.length; ++i) {
      if (!cfg.bookid) {
        if (cfg.roottype >= 0 && cfg.roottype != comicjson.books[i].rootType) {
          continue;
        }
      } else {
        const cbret = parseComicBookURL(comicjson.books[i].url);
        if (cbret instanceof Error) {
          continue;
        }

        // console.log(JSON.stringify(cbret));
        // console.log(JSON.stringify(cfg));

        if (!isValidBookid(cfg, cbret.bookid)) {
          continue;
        }

        // console.log('I get it.');
      }

      if (cfg.outputpdf) {
        if (cfg.outputpng) {
          if (cfg.source == 'manhuagui') {
            await webp2png(
                path.join(
                    cfg.comicrootpath,
                    cfg.comicid.toString(),
                    comicjson.books[i].name,
                ),
            );
          } else {
            await jpg2png(
                path.join(
                    cfg.comicrootpath,
                    cfg.comicid.toString(),
                    comicjson.books[i].name,
                ),
            );
          }
        } else {
          if (cfg.source == 'manhuagui') {
            await webp2jpg(
                path.join(
                    cfg.comicrootpath,
                    cfg.comicid.toString(),
                    comicjson.books[i].name,
                ),
            );
          }
        }

        if (curpaths.length == 0) {
          starti = i;
        }

        curpaths.push(
            path.join(
                cfg.comicrootpath,
                cfg.comicid.toString(),
                comicjson.books[i].name,
            ),
        );

        if (curpaths.length >= cfg.packagebooks) {
          let title = '';
          if (curpaths.length == 1) {
            title = comicjson.books[i].title;
          } else {
            title =
              comicjson.books[starti].title + '-' + comicjson.books[i].title;
          }

          if (cfg.outputpng) {
            await genPDF3(
                path.join(
                    cfg.comicrootpath,
                    cfg.comicid.toString(),
                    title + '.pdf',
                ),
                title,
                curpaths,
            );
          } else {
            await genPDF2(
                path.join(
                    cfg.comicrootpath,
                    cfg.comicid.toString(),
                    title + '.pdf',
                ),
                title,
                curpaths,
            );
          }

          curpaths.splice(0, curpaths.length);
        }
        // else if (i == comicjson.books.length - 1) {
        //   let title = '';
        //   if (curpaths.length == 1) {
        //     title = comicjson.books[i].title;
        //   } else {
        //     title =
        //       comicjson.books[starti].title + '-' + comicjson.books[i].title;
        //   }

        //   if (cfg.outputpng) {
        //     await genPDF3(
        //         path.join(
        //             cfg.comicrootpath,
        //             cfg.comicid.toString(),
        //             title + '.pdf',
        //         ),
        //         title,
        //         curpaths,
        //     );
        //   } else {
        //     await genPDF2(
        //         path.join(
        //             cfg.comicrootpath,
        //             cfg.comicid.toString(),
        //             title + '.pdf',
        //         ),
        //         title,
        //         curpaths,
        //     );
        //   }

        //   curpaths.splice(0, curpaths.length);
        // }
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

    if (curpaths.length > 0) {
      let title = '';
      if (curpaths.length == 1) {
        title = comicjson.books[i].title;
      } else {
        title = comicjson.books[starti].title + '-' + comicjson.books[i].title;
      }

      if (cfg.outputpng) {
        await genPDF3(
            path.join(cfg.comicrootpath, cfg.comicid.toString(), title + '.pdf'),
            title,
            curpaths,
        );
      } else {
        await genPDF2(
            path.join(cfg.comicrootpath, cfg.comicid.toString(), title + '.pdf'),
            title,
            curpaths,
        );
      }

      curpaths.splice(0, curpaths.length);
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
