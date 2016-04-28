var warningsSummary = require('../common/warnings-summary')

module.exports = {
  'Home page core': function (browser) {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('body', 1000)
      .assert.title('Flood information service - GOV.UK')
      .assert.containsText('#logo', 'GOV.UK')
      .assert.containsText('h1', 'Flood information service')
  },
  'Home page summary': function (browser) {
    browser
      .getAttribute('main[data-test-info]', 'data-test-info', function (result) {
        browser.assert.equal(typeof result, 'object')
        browser.assert.equal(result.status, 0)
        browser.assert.equal(result.value.length > 0, true)
        var summary = JSON.parse(result.value)
        browser.assert.equal(typeof summary, 'object')

        browser.expect.element('a.severity.severity-1 .heading-xlarge').text.to.equal(summary[0].count)
        browser.expect.element('a.severity.severity-2 .heading-xlarge').text.to.equal(summary[1].count)
        browser.expect.element('a.severity.severity-3 .heading-xlarge').text.to.equal(summary[2].count)
      })
  },
  'Home page search': function (browser) {
    browser
      .setValue('#location', 'norfolk')
      .click('#start-button')
      .waitForElementVisible('#warnings-page', 1000)
      .assert.containsText('h1', 'Norfolk, England')
  },
  'Home page warnings summary': function (browser) {
    warningsSummary(browser)
    browser.end()
  }
}
