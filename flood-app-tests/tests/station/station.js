module.exports = {
  'Station page test run': function (browser) {
    browser
      .url(browser.launchUrl + '/station/7338')
      .waitForElementVisible('body', 1000)
      .assert.title('Flood information service - GOV.UK')
      .assert.containsText('h1', 'Latest river level information for:')
      .assert.visible('#station-chart')
      .assert.hidden('table#telemetry')
      .end()
  }
}
