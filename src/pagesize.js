const {getImageSize, isJPG} = require('./img.utils');
const fs = require('fs');
const path = require('path');
const {log} = require('jarviscrawlercore');

/**
 * findSize - find size
 * @param {array} lst - lst, it's like [{w,h,n}...]
 * @param {int} w - width
 * @param {int} h - height
 * @return {int} i - index, maybe -1
 */
function findSize(lst, w, h) {
  for (let i = 0; i < lst.length; ++i) {
    if (
      w >= lst[i].w * 0.95 &&
      w <= lst[i].w * 1.05 &&
      h >= lst[i].h * 0.95 &&
      h <= lst[i].h * 1.05
    ) {
      return i;
    }
  }

  return -1;
}

/**
 * countSize - count size
 * @param {array} lst - lst, it's like [{w,h,n,tn,per}...]
 * @param {number} per - per, it's like 0.15
 * @return {object} obj - {w, h}
 */
function countSize(lst, per) {
  let w = 0;
  let h = 0;
  for (let i = 0; i < lst.length; ++i) {
    if (lst[i].per > per) {
      if (lst[i].w > w) {
        w = lst[i].w;
      }

      if (lst[i].h > h) {
        h = lst[i].h;
      }
    }
  }

  return {w: w, h: h};
}

/**
 * guessPageSize - guess page size
 * @param {string} rootpath - rootpath
 * @return {object} obj - {w, h}
 */
async function guessPageSize(rootpath) {
  const lst = [];
  let tn = 0;
  const lstfn = fs.readdirSync(rootpath);
  for (let i = 0; i < lstfn.length; ++i) {
    if (isJPG(lstfn[i])) {
      const cs = await getImageSize(path.join(rootpath, lstfn[i]));
      if (cs != undefined) {
        const csi = findSize(lst, cs.w, cs.h);
        if (csi == -1) {
          lst.push({w: cs.w, h: cs.h, n: 1});
        } else {
          lst[csi].w = (lst[csi].w * lst[csi].n + cs.w) / (lst[csi].n + 1);
          lst[csi].h = (lst[csi].h * lst[csi].n + cs.h) / (lst[csi].n + 1);

          lst[csi].n++;
        }

        tn++;
      }
    }
  }

  if (lst.length > 0) {
    for (let i = 0; i < lst.length; ++i) {
      lst[i].tn = tn;
      lst[i].per = lst[i].n / tn;
    }

    lst.sort((f, s) => {
      if (f.per >= s.per) {
        return -1;
      }

      return 1;
    });

    log.debug('guessPageSize', lst);

    if (lst[0].per > 0.15) {
      return countSize(lst, 0.15);
    } else if (lst[0].per > 0.05) {
      return countSize(lst, 0.05);
    }

    return countSize(lst, 0);
  }

  return undefined;
}

/**
 * guessPageSize2 - guess page size v2
 * @param {string | array} rootpaths - rootpath or rootpaths
 * @return {object} obj - {w, h}
 */
async function guessPageSize2(rootpaths) {
  if (!Array.isArray(rootpaths)) {
    return await guessPageSize(rootpaths);
  }

  const lst = [];
  let tn = 0;
  for (let j = 0; j < rootpaths.length; ++j) {
    const lstfn = fs.readdirSync(rootpaths[j]);
    for (let i = 0; i < lstfn.length; ++i) {
      if (isJPG(lstfn[i])) {
        const cs = await getImageSize(path.join(rootpaths[j], lstfn[i]));
        if (cs != undefined) {
          const csi = findSize(lst, cs.w, cs.h);
          if (csi == -1) {
            lst.push({w: cs.w, h: cs.h, n: 1});
          } else {
            lst[csi].w = (lst[csi].w * lst[csi].n + cs.w) / (lst[csi].n + 1);
            lst[csi].h = (lst[csi].h * lst[csi].n + cs.h) / (lst[csi].n + 1);

            lst[csi].n++;
          }

          tn++;
        }
      }
    }
  }

  if (lst.length > 0) {
    for (let i = 0; i < lst.length; ++i) {
      lst[i].tn = tn;
      lst[i].per = lst[i].n / tn;
    }

    lst.sort((f, s) => {
      if (f.per >= s.per) {
        return -1;
      }

      return 1;
    });

    log.debug('guessPageSize2', lst);

    if (lst[0].per > 0.15) {
      return countSize(lst, 0.15);
    } else if (lst[0].per > 0.05) {
      return countSize(lst, 0.05);
    }

    return countSize(lst, 0);
  }

  return undefined;
}

exports.guessPageSize = guessPageSize;
exports.guessPageSize2 = guessPageSize2;
