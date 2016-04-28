var apiService = require('../services/api')
var prehandler = require('./ext/prehandler')
var Boom = require('boom')

module.exports = {
  method: 'GET',
  path: '/stations-overview',
  config: {
    description: 'Get map page',
    handler: function (request, reply) {
      apiService.getStationsOverview(function (err, result) {
        if (err) {
          return reply(Boom.badRequest('Failed to get station overview data', err))
        }

        var model = {
          stations: result[0].get_stations_overview
        }
        // Just smash throught he data for the timebeing, no need for model or view model yet.
        reply.view('stations-overview', model)
      })
    },
    ext: {
      onPreHandler: [{
        method: prehandler
      }]
    }
  }
}
