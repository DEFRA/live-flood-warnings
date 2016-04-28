module.exports = {
  'River levels national test run': function (browser) {
    browser
      .url(browser.launchUrl + '/river-and-sea-levels')
      .waitForElementVisible('#river-levels-page', 1000)
      .assert.title('Flood information service - GOV.UK')
      .assert.containsText('h1', 'River and sea levels in England')
      .end()
  }
}
