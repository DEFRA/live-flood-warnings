var Joi = require('joi')
var Boom = require('boom')
var service = require('../services')

module.exports = {
  method: 'GET',
  path: '/rloi/gps/stationsbyradius/{lng}/{lat}/{radiusM}',
  config: {
    description: 'Get stations by radius',
    handler: function (request, reply) {
      var db = request.pg.client
      var params = request.params

      service.getStationsByRadius(db, params.lng, params.lat, params.radiusM, function (err, result) {
        if (err) {
          return reply(Boom.badRequest('Failed to get station data', err))
        }

        reply(result.rows)
      })
    },
    validate: {
      params: {
        lng: Joi.number().required(),
        lat: Joi.number().required(),
        radiusM: Joi.number().required()
      }
    }
  }
}
