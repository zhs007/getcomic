#!/usr/bin/env node

const program = require('commander');
const {log, downloadComic} = require('jarviscrawlercore');

program
    .command('downloadcomic [comicid]')
    .description('download comic')
    .option('-o, --output [filename]', 'export output file')
    .option('-d, --debug [isdebug]', 'debug mode')
    .action(function(comicid, options) {
      const isdebug = options.debug === 'true';
      log.console('debug - ', isdebug);

      const output = options.output;
      log.console('output - ', output);

      (async () => {
        await downloadComic(isdebug, comicid, output);

        process.exit(-1);
      })().catch((err) => {
        log.console('catch a err ', err);

        process.exit(-1);
      });
    });

program.parse(process.argv);
