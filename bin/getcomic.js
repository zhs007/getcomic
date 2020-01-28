#!/usr/bin/env node

const program = require('commander');
const {start} = require('../src/start.js');
const {log} = require('jarviscrawlercore');

program
    .command('start [cfgfn]')
    .description('get comic')
    .action(function(cfgfn, options) {
      (async () => {
        await start(cfgfn);

        process.exit(-1);
      })().catch((err) => {
        log.console('catch a err ', err);

        process.exit(-1);
      });
    });

program.parse(process.argv);
