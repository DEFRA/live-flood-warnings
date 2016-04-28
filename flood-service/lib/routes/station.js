var Joi = require('joi')
var Boom = require('boom')
var service = require('../services')

module.exports = {
  method: 'GET',
  path: '/rloi/station/{id}/{direction}',
  config: {
    description: 'Get station by id',
    handler: function (request, reply) {
      var db = request.pg.client
      var params = request.params

      service.getStation(db, params.id, params.direction, function (err, result) {
        if (err) {
          return reply(Boom.badRequest('Failed to get station data', err))
        }

        reply(result.rows)
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
