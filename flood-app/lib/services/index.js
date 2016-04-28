var apiService = require('./api')
var locationService = require('./location')
var FloodData = require('../models/flood-data')
var ScottishError = require('../scottish-error')
var floodData = null // Holds the cached flood data

function getBoundingBox (geocoded) {
  var xmin, ymin, xmax, ymax

  if (geocoded.bbox) {
    xmin = geocoded.bbox[1]
    ymin = geocoded.bbox[0]
    xmax = geocoded.bbox[3]
    ymax = geocoded.bbox[2]
  } else {
    // Use the coordinate point returned from the geocode.
    // Apply an additional adjustment will convert to a tiny
    // box as the equal points don't work in the query
    xmin = geocoded.point.coordinates[1]
    ymin = geocoded.point.coordinates[0]
    xmax = geocoded.point.coordinates[1] + 0.000000001
    ymax = geocoded.point.coordinates[0] + 0.000000001
  }

  return {
    xmin: xmin.toFixed(7),
    ymin: ymin.toFixed(7),
    xmax: xmax.toFixed(7),
    ymax: ymax.toFixed(7)
  }
}

function getFloodData (request) {
  return request.lfw.floodData
}

module.exports = {
  get floodData () {
    return floodData
  },
  set floodData (value) {
    floodData = value && new FloodData(value)
  },
  getFloodData: getFloodData,
  getFloodDataByLocation: function (request, location, callback) {
    var allFloodData = getFloodData(request)

    // Geocode the location
    locationService.find(location, function (err, result) {
      // Check for errors
      if (err) {
        return callback(err)
      }

      // If we don't have a result return nothing
      if (!result || !result.address) {
        return callback()
      }

      var address = result.address

      // If we have a result but it's in
      // scotland, render the `scotland` view
      if (result.isScottishAddress) {
        return callback(new ScottishError(address.formattedAddress))
      }

      // Find bounding box
      var bbox = getBoundingBox(result)

      // Find the notifications within this bounding box
      apiService.alertsByEnvelope(bbox, function (err, data) {
        // Check for errors
        if (err) {
          return callback(err)
        }

        // Find the filtered set of notifications
        var keys = data.map(function (item) {
          return item.fwa_key
        })

        var filteredNotifications = allFloodData.notifications.filter(function (item) {
          return keys.indexOf(item.fwa_key) > -1
        })

        // Build a new `FloodData` model based on the filtered
        // set of notifications and the geocoded address
        var filteredFloodData = new FloodData({
          date: Date.now(),
          alerts: filteredNotifications
        }, result)

        callback(null, filteredFloodData)
      })
    })
  }
}
