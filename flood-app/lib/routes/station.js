var Joi = require('joi')
var Boom = require('boom')
var service = require('../services')
var apiService = require('../services/api')
var prehandler = require('./ext/prehandler')
var StationViewModel = require('../models/station-view')
var additionalWelshStations = [4162, 4170, 4173, 4174, 4176]
var nrwStationUrl = 'http://rloi.naturalresources.wales/ViewDetails?station='

module.exports = {
  method: 'GET',
  path: '/station/{id}',
  config: {
    description: 'Gets the station page',
    handler: function (request, reply) {
      var id = request.params.id
      var direction = request.query.direction || 'u'

      if (additionalWelshStations.indexOf(id) > -1) {
        return reply.redirect(nrwStationUrl + id)
      }

      apiService.getStationById(id, direction, function (err, result) {
        if (err) {
          return reply(Boom.badRequest('Failed to get station', err))
        }

        if (!result || !result.length) {
          return reply(Boom.notFound('No station found'))
        }

        if ((result.region || '').toLowerCase() === 'wales') {
          return reply.redirect(nrwStationUrl + id)
        }

        var station = result

        apiService.getStationTelemetry(id, direction, function (err, result) {
          if (err) {
            return reply(Boom.badRequest('Failed to get station telemetry data', err))
          }

          var date = service.getFloodData(request).date
          var model = new StationViewModel(id, station[0], result, date)
          reply.view('station', model)
        })
      })
    },
    validate: {
      params: {
        id: Joi.number().required()
      },
      query: {
        direction: Joi.string().valid('d', 'u')
      }
    },
    ext: {
      onPreHandler: [{
        method: prehandler
      }]
    }
  }
}
