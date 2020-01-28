#!/usr/bin/env node

const program = require('commander');
const {log, downloadComic} = require('jarviscrawlercore');

program
    .command('downloadcomic [comicid]')
    .description('download comic')
    .option('-o, --output [filename]', 'export output file')
    .option('-t, --type [type]', 'export type')
    .option('-d, --debug [isdebug]', 'debug mode')
    .action(function(comicid, options) {
      const isdebug = options.debug === 'true';
      log.console('debug - ', isdebug);

      const output = options.output;
      log.console('output - ', output);

      let roottype = -1;
      if (options.type) {
        try {
          const rt = parseInt(options.type);
          roottype = rt;
        } catch (err) {
          log.warn('type must be an integer');
        }
      }

      (async () => {
        await downloadComic(isdebug, comicid, roottype, output);

        process.exit(-1);
      })().catch((err) => {
        log.console('catch a err ', err);

        process.exit(-1);
      });
    });

program.parse(process.argv);
