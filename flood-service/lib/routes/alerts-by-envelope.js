var Joi = require('joi')
var Boom = require('boom')
var service = require('../services')

module.exports = {
  method: 'GET',
  path: '/fwa/gps/alertsbyenvelope/{format}/{xmin}/{ymin}/{xmax}/{ymax}',
  config: {
    description: 'Get alerts by envelope',
    handler: function (request, reply) {
      var db = request.pg.client
      var params = request.params

      service.getAlertsByEnvelope(db, params.xmin, params.ymin, params.xmax, params.ymax, function (err, result) {
        if (err) {
          return reply(Boom.badRequest('Failed to get alerts', err))
        }

        reply(result.rows)
      })
    },
    validate: {
      params: {
        format: Joi.string().valid('xml', 'json'),
        xmin: Joi.number().required(),
        ymin: Joi.number().required(),
        xmax: Joi.number().required(),
        ymax: Joi.number().required()
      }
    }
  }
}
