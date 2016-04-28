var locationService = require('../../lib/services/location')
var find = require('./find.json')
var geocode = require('./geocode.json')
var reverseGeocode = require('./reverse-geocode.json')

/**
 * Override the real functions with mock implementations
 */
locationService.find = function (location, callback) {
  process.nextTick(function () {
    callback(null, find)
  })
}

locationService.geocode = function (location, callback) {
  process.nextTick(function () {
    callback(null, geocode)
  })
}

locationService.reverseGeocode = function (lat, lng, callback) {
  process.nextTick(function () {
    callback(null, reverseGeocode)
  })
}
