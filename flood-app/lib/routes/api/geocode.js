var Joi = require('joi')
var Boom = require('boom')
var util = require('../../util')
var locationService = require('../../services/location')

module.exports = {
  method: 'GET',
  path: '/api/geocode',
  config: {
    description: 'API geocode',
    handler: function (request, reply) {
      var location = util.cleanseLocation(request.query.location)
      locationService.find(location, function (err, result) {
        if (err) {
          // Send a 500 back - this is handled as a special
          // case with a detailed error message used on the client
          return reply(Boom.badImplementation('Geocode error', err))
        }

        reply(result || null)
      })
    },
    app: {
      useErrorPages: false
    },
    validate: {
      query: {
        location: Joi.string().required()
      }
    }
  }
}
