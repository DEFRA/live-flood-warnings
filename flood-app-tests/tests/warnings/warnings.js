var warningsSummary = require('../common/warnings-summary')

module.exports = {
  'Warnings page core': function (browser) {
    browser
      .url(browser.launchUrl + '/warnings')
      .waitForElementVisible('#warnings-page', 1000)
      .assert.title('Flood information service - GOV.UK')
      .assert.containsText('h1', 'Flood warnings for:')
      .assert.containsText('h1', 'England and Wales')
      .expect.element('main').to.have.attribute('data-test-info')
  },
  'Warnings page summary': warningsSummary,
  'Warnings page river levels click through': function (browser) {
    browser.getText('header h2', function (result) {
      if (result.value.indexOf('There are currently no flood warnings') === -1) {
        // We have some warnings/alerts therefore we want to test we can
        // open the collapsible panels, find the first occurance and click through
        // to the river levels page.
        browser
          .waitForElementVisible('ul.warnings-list > li:first-child > details > summary', 1000, function (result) {
            browser.expect.element('ul.warnings-list > li:first-child > details > summary').to.be.present
            browser
              .click('ul.warnings-list > li:first-child > details > summary')
              .waitForElementVisible('ul.warnings-list > li:first-child > details > div', 1000)
              .click('ul.warnings-list > li:first-child > details > div > details > summary')
              .click('ul.warnings-list > li:first-child > details > div > details > div a[id$="-rloi"]')
              .waitForElementVisible('body', 1000)
              .assert.containsText('h1', 'River and Sea Levels for:')
          })
      }
    })
    browser.end()
  }
}
