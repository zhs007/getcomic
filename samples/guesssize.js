const {guessPageSize} = require('../src/pagesize');

(async () => {
  const s = await guessPageSize('../jarviscrawlercore/comic/715/1');

  console.log(s);

  process.exit(-1);
})().catch((err) => {
  console.log(err);

  process.exit(-1);
});
