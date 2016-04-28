module.exports = {
  'Map page core': function (browser) {
    browser
      .url(browser.launchUrl + '/map')
      .waitForElementVisible('body', 1000)
      .assert.title('Flood information service - GOV.UK')
      .assert.containsText('h1', 'Flood warnings for: England and Wales')
  },
  'Map page controls': function (browser) {
    browser.expect.element('a.toggle-base').text.to.equal('Earth view')
    browser.click('a.toggle-base')
    browser.expect.element('a.toggle-base').text.to.equal('Map view')
    browser.click('a.toggle-base')
    browser.expect.element('a.toggle-base').text.to.equal('Earth view')

    browser.expect.element('a.toggle-map').text.to.equal('Full screen')
    browser.click('a.toggle-map')
    browser.expect.element('a.toggle-map').text.to.equal('Exit full screen')
    browser.click('a.toggle-map')
    browser.expect.element('a.toggle-map').text.to.equal('Full screen')
  },
  'Map page warnings summary': function (browser) {
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
    .end()
  }
}
