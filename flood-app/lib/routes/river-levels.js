var Joi = require('joi')
var Boom = require('boom')
var util = require('../util')
var service = require('../services')
var prehandler = require('./ext/prehandler')
var ScottishError = require('../scottish-error')
var apiService = require('../services/api')
var locationService = require('../services/location')
var RiverLevelsViewModel = require('../models/river-levels-view')

module.exports = {
  method: 'GET',
  path: '/river-and-sea-levels',
  config: {
    description: 'Gets the river levels page',
    handler: function (request, reply) {
      var model
      var radiusM = 10000
      var allNotifications = service.getFloodData(request)

      if (request.query.location) {
        // Retrieve warnings for the selected location so that
        // the flood warnings summary data can be generated.
        var location = util.cleanseLocation(request.query.location)

        service.getFloodDataByLocation(request, location, function (err, result) {
          if (err) {
            if (err instanceof ScottishError) {
              return reply.view('scotland', {
                formattedAddress: err.formattedAddress
              })
            } else {
              request.log('error', err)
              model = new RiverLevelsViewModel(allNotifications, 'geo')
              return reply.view('river-levels', model)
            }
          }

          // If we don't have a result, redirect to the
          // national river levels page and show the
          // location error message
          if (!result) {
            model = new RiverLevelsViewModel(allNotifications, 'loc')
            return reply.view('river-levels', model)
          }

          // Now we need to get the local stations
          var centroid = result.geocoded.point
          var coords = centroid.coordinates

          apiService.getStationsByRadius(coords[0], coords[1], radiusM, function (err, stations) {
            if (err) {
              return reply(Boom.badRequest('Failed to get station data', err))
            }

            // Render the filtered set of notifications
            model = new RiverLevelsViewModel(allNotifications, null, result, stations, centroid, location, result.location)
            reply.view('river-levels', model)
          })
        })
      } else {
        var hasLatLong = request.query.lat && request.query.lng
        if (hasLatLong) {
          // Here we need to get the stations local to the supplied lat/lng
          // The banner only shows the national message and is not filtered
          var coords = [request.query.lat, request.query.lng]
          apiService.getStationsByRadius(coords[0], coords[1], radiusM, function (err, stations) {
            if (err) {
              return reply(Boom.badRequest('Failed to get station data', err))
            }

            // Reverse geocode to get the location
            locationService.reverseGeocode(coords[0], coords[1], function (err, geocoded) {
              if (err) {
                // Log the error but don't return an error.
                // Allow the page to render with the default title.
                request.log('error', err)
              }

              var centroid = { coordinates: coords }
              var formattedLocation = geocoded && geocoded.resourceSets[0].resources[0].name.replace(', United Kingdom', '')
              model = new RiverLevelsViewModel(allNotifications, err && 'geo', null, stations, centroid, null, formattedLocation)

              reply.view('river-levels', model)
            })
          })
        } else {
          if (request.query.location === '') {
            // Handles form post with blank text
            model = new RiverLevelsViewModel(allNotifications, 'loc')
            return reply.view('river-levels', model)
          } else {
            model = new RiverLevelsViewModel(allNotifications)
            return reply.view('river-levels', model)
          }
        }
      }
    },
    validate: {
      query: {
        // err: Joi.valid('loc', 'geo'),
        location: Joi.string().allow(''),
        lat: Joi.number(),
        lng: Joi.number()
      }
    },
    ext: {
      onPreHandler: [{
        method: prehandler
      }]
    }
  }
}
