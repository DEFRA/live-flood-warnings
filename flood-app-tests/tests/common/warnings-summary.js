module.exports = function (browser) {
  browser
    .getAttribute('main[data-test-info]', 'data-test-info', function (result) {
      browser.assert.equal(typeof result, 'object')
      browser.assert.equal(result.status, 0)
      browser.assert.equal(result.value.length > 0, true)
      var summary = JSON.parse(result.value)
      browser.assert.equal(typeof summary, 'object')

      if (summary[0].count) {
        browser.expect.element('.severity.severity-1 .heading-xlarge').to.be.present
        browser.getText('.severity.severity-1 .heading-xlarge', function (result) {
          browser.assert.equal(typeof result, 'object')
          browser.assert.equal(result.status, 0)
          browser.assert.equal(result.value.startsWith(summary[0].count), true)
        })
      }

      if (summary[1].count) {
        browser.expect.element('.severity.severity-2 .heading-xlarge').to.be.present
        browser.getText('.severity.severity-2 .heading-xlarge', function (result) {
          browser.assert.equal(typeof result, 'object')
          browser.assert.equal(result.status, 0)
          browser.assert.equal(result.value.startsWith(summary[1].count), true)
        })
      }

      if (summary[2].count) {
        browser.expect.element('.severity.severity-3 .heading-xlarge').to.be.present
        browser.getText('.severity.severity-3 .heading-xlarge', function (result) {
          browser.assert.equal(typeof result, 'object')
          browser.assert.equal(result.status, 0)
          browser.assert.equal(result.value.startsWith(summary[2].count), true)
        })
      }

      if (summary[3].count) {
        browser.expect.element('.severity.severity-4 .heading-xlarge').to.be.present
        browser.getText('.severity.severity-4 .heading-xlarge', function (result) {
          browser.assert.equal(typeof result, 'object')
          browser.assert.equal(result.status, 0)
          browser.assert.equal(result.value.startsWith(summary[3].count), true)
        })
      }
    })
}
