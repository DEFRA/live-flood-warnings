var Joi = require('joi')
var Boom = require('boom')
var util = require('../../util')
var service = require('../../services')
var prehandler = require('../ext/prehandler')
var ScottishError = require('../../scottish-error')

function prepareModel (floodData) {
  return {
    address: floodData.address,
    location: floodData.location,
    isLocalised: floodData.isLocalised,
    date: floodData.date,
    summary: floodData.summary,
    message: floodData.message,
    headline: floodData.headline,
    severity: floodData.severity
  }
}

module.exports = {
  method: 'GET',
  path: '/api/warnings',
  config: {
    description: 'Get warnings data',
    handler: function (request, reply) {
      var location = util.cleanseLocation(request.query.location)

      if (location) {
        service.getFloodDataByLocation(request, location, function (err, result) {
          if (err) {
            if (err instanceof ScottishError) {
              return reply({
                isScottish: true,
                formattedAddress: err.formattedAddress
              })
            } else {
              // Assume any other error is an issue with the geocoder and we can return national
              var errorMessage = 'There is currently a delay in obtaining the latest results for this area. ' +
                'The most recent results received are below. Normal service will be resumed as soon as possible.'

              return reply(Boom.badRequest(errorMessage, err))
            }
          }

          // If we don't have a result, return an error
          if (!result) {
            return reply(Boom.badRequest('Geocode error', 'No results found'))
          }

          reply(prepareModel(result))
        })
      } else {
        // Render all the notifications
        reply(prepareModel(service.getFloodData(request)))
      }
    },
    app: {
      useErrorPages: false
    },
    validate: {
      query: {
        location: Joi.string().allow('')
      }
    },
    ext: {
      onPreHandler: [{
        method: prehandler
      }]
    }
  }
}
