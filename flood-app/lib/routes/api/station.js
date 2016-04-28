var Joi = require('joi')
var Boom = require('boom')
var apiService = require('../../services/api')
var Station = require('../../models/station')

module.exports = {
  method: 'GET',
  path: '/api/station/{id}',
  config: {
    description: 'Get station by id',
    handler: function (request, reply) {
      var id = request.params.id
      var direction = request.query.direction

      apiService.getStationById(id, direction || 'u', function (err, result) {
        if (err) {
          return reply(Boom.badRequest('Error occured obtaining the station', err))
        }

        if (!result || !result.length) {
          return reply(Boom.badRequest('No station data found'))
        }

        reply(new Station(result[0]))
      })
    },
    app: {
      useErrorPages: false
    },
    validate: {
      params: {
        id: Joi.number().required()
      },
      query: {
        direction: Joi.string().valid('u', 'd')
      }
    }
  }
}
