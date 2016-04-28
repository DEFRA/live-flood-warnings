var moment = require('moment')
var config = require('../config')
var wreck = require('wreck').defaults({
  timeout: config.httpTimeoutMs
})

function getJson (url, callback) {
  wreck.get(url, { json: true }, function (err, response, payload) {
    if (err || response.statusCode !== 200) {
      return callback(err || payload || new Error('Unknown error'))
    }
    callback(null, payload)
  })
}

function cleanseLocation (location) {
  if (location) {
    return location.replace(/[^a-zA-Z0-9',-.& ]/g, '')
  }
}

function formatDate (value, format) {
  if (typeof format === 'undefined') {
    format = 'h:mma dddd DD MMMM YYYY'
  }
  return moment(value).format(format)
}

function toFixed (value, dp) {
  if (value) {
    return Number(Math.round(value + 'e' + dp) + 'e-' + dp).toFixed(dp)
  } else {
    return value
  }
}

module.exports = {
  getJson: getJson,
  toFixed: toFixed,
  formatDate: formatDate,
  cleanseLocation: cleanseLocation
}
