var config = require('../../config').bing
var sprintf = require('sprintf-js')
var util = require('../util')
var bingKey = config.key
var bingUrl = config.url
var bingReverseUrl = config.urlReverse

/**
 * geocode
 * @param  {String}   location Place name or postcode
 * @param  {Function} callback
 */
function geocode (location, callback) {
  var query = encodeURIComponent(location + ', UK')
  var url = sprintf.vsprintf(bingUrl, [query, bingKey])

  util.getJson(url, function (err, data) {
    if (err) {
      return callback(err)
    }

    // Check that the json is relevant
    if (!data.resourceSets || !data.resourceSets.length) {
      return callback(new Error('Invalid geocode results (no resourceSets)'))
    }

    // Ensure we have some results
    var set = data.resourceSets[0]
    if (set.estimatedTotal === 0) {
      return callback()
    }

    data = set.resources[0]

    // Determine the confidence level of the result and return if it's not acceptable.
    // This is a check to see if "no results" found, because search is biased to GB if a search term can't be matched
    // the service tends to return the UK with a medium confidence, so this is a good indication that no results were found
    var noConfidence = (data.confidence.toLowerCase() === 'medium' || data.confidence.toLowerCase() === 'low')
    if (data.entityType.toLowerCase() === 'countryregion' && noConfidence) {
      return callback()
    }

    callback(null, set.resources[0])
  })
}

/**
 * reverseGeocode
 * @param  {Number}   lat      Latitude
 * @param  {Number}   lon      Longitude
 * @param  {Function} callback
 */
function reverseGeocode (lat, lng, callback) {
  var url = sprintf.vsprintf(bingReverseUrl, [lat, lng, bingKey])

  util.getJson(url, function (err, data) {
    if (err) {
      return callback(err)
    }
    callback(null, data)
  })
}

/**
 * Finds a location using geocode and, in the event of a partial match, a reverse geocode
 * @param  {String}   location Place name or postcode
 * @param  {Function} callback
 */
function find (location, callback) {
  geocode(location, function (err, geocoded) {
    if (err || !geocoded) {
      return callback(err)
    }

    function finaliseResponse () {
      var address = geocoded.address
      var countryRegion = address.countryRegion
      var iso2 = address.countryRegionIso2

      if (iso2 !== 'GB' || (countryRegion && countryRegion.toLowerCase() !== 'united kingdom')) {
        return callback()
      }

      // Builds the formatted address string from components as built one from geocoder not fit for purpose
      // This checks for scottish address
      var parts = []

      // Do some logic here to form the formatted address per requirements
      if (geocoded.entityType.toLowerCase().indexOf('postcode') > -1) {
        parts.push(address.postalCode)
      }
      parts.push(address.landmark)
      parts.push(address.locality)
      if (address.locality !== address.adminDistrict2) {
        parts.push(address.adminDistrict2)
      }
      parts.push(address.adminDistrict)

      parts = parts.filter(function (value) {
        return value
      })

      if (parts.length) {
        address.formattedAddress = parts.join(', ')
      }

      if (address.formattedAddress.toLowerCase() === 'united kingdom') {
        address.formattedAddress = 'England and Wales'
      }

      if (address.adminDistrict.toLowerCase() === 'scotland') {
        geocoded.isScottishAddress = true
      }

      callback(null, geocoded)
    }

    // Do a check for the presence of `adminDistrict` in
    // the data, and do a reverse lookup if it's missing
    if (geocoded.entityType.toLowerCase() !== 'countryregion' && !geocoded.address.adminDistrict) {
      var coords = geocoded.point.coordinates
      reverseGeocode(coords[0], coords[1], function (err, reverseGeocoded) {
        if (err) {
          return callback(err)
        }

        // Apply the address parts admin districts from
        // the reverse lookup data onto the geocoded data
        if (reverseGeocoded) {
          var set = reverseGeocoded.resourceSets[0]
          if (set.resources.length >= 1) {
            var address = set.resources[0].address
            geocoded.address.adminDistrict = address.adminDistrict
            geocoded.address.adminDistrict2 = address.adminDistrict2
            if (!geocoded.address.countryRegion) {
              geocoded.address.countryRegion = address.countryRegion
            }

            if (!geocoded.address.countryRegionIso2) {
              geocoded.address.countryRegionIso2 = address.countryRegionIso2
            }

            if (!geocoded.address.locality) {
              geocoded.address.locality = address.locality
            }
          }
        }
        finaliseResponse()
      })
    } else {
      finaliseResponse()
    }
  })
}

module.exports = {
  find: find,
  geocode: geocode,
  reverseGeocode: reverseGeocode
}
