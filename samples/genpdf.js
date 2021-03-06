const {genPDF} = require('../src/pdf.utils');
const {webp2jpg} = require('../src/imgs.utils');

(async () => {
  // for (let i = 5; i <= 17; ++i) {
  //   await genPDF(
  //       '154_' + i + '.pdf',
  //       '',
  //       '../jarviscrawlercore/comic/154/' + i,
  //   );
  // }

  // for (let i = 11; i <= 14; ++i) {
  //   await genPDF(
  //       '715_' + i + '.pdf',
  //       '',
  //       '../jarviscrawlercore/comic/715/' + i,
  //   );
  // }

  // for (let i = 1; i <= 24; ++i) {
  //   await genPDF(
  //       '147_' + i + '.pdf',
  //       '',
  //       '../jarviscrawlercore/comic/147/' + i,
  //   );
  // }

  await webp2jpg('comic/416/第07卷');
  await genPDF('416-7.pdf', '城市猎人 第7卷', 'comic/416/第07卷');
  // await genPDF('715_2.pdf', '../jarviscrawlercore/comic/715/2');

  process.exit(-1);
})().catch((err) => {
  console.log(err);

  process.exit(-1);
});
