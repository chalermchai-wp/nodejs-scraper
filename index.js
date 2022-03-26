const cheerio = require('cheerio');
const Browser = require('zombie');
const url = 'https://codequiz.azurewebsites.net/';
const scrapedData = [];

let browser = new Browser();
browser
  .visit(url)
  .then(() => {
    console.log(`Visited ${url}..`);
    browser.click("input[type='button'][value='Accept']").then(() => {
      setTimeout(function () {
        const $ = cheerio.load(browser.html());
        const listItem = $('body > table > tbody > tr');
        listItem.each((idx, el) => {
          if (idx === 0) return true;
          const tds = $(el).find('td');

          const fundName = $(tds[0]).text();
          const nav = $(tds[1]).text();
          const bid = $(tds[2]).text();
          const offer = $(tds[3]).text();
          const change = $(tds[4]).text();

          const tableRow = { fundName, nav, bid, offer, change };
          scrapedData.push(tableRow);
        });

        findDataByArg();
      }, 500);
    });
  })
  .catch((error) => {
    console.error(`Error ${error}`);
  });

function findDataByArg() {
  const myArgs = process.argv.slice(2);
  var data = scrapedData.find((res) => res.fundName === myArgs[0]);

  console.log(data ? data.nav : 'not have :' + myArgs[0]);
}
