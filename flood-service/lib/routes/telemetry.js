var Joi = require('joi')
var Boom = require('boom')
var service = require('../services')

module.exports = {
  method: 'GET',
  path: '/rloi/telemetry/{id}/{direction}',
  config: {
    description: 'Get telemetry by station rloi id',
    handler: function (request, reply) {
      var db = request.pg.client
      var params = request.params

      service.getTelemetry(db, params.id, params.direction, function (err, result) {
        if (err) {
          return reply(Boom.badRequest('Failed to get telemetry data', err))
        }
        reply(result.rows[0].get_telemetry || {})
      })
    },
    validate: {
      params: {
        id: Joi.number().required(),
        direction: Joi.string().valid('u', 'd')
      }
    }
  }
}
