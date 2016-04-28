var Joi = require('joi')
var service = require('../services')
var prehandler = require('./ext/prehandler')
var MapViewModel = require('../models/map-view')

module.exports = {
  method: 'GET',
  path: '/map',
  config: {
    description: 'Get map page',
    handler: function (request, reply) {
      var fwaKey = request.query.fwa_key
      var model = new MapViewModel(service.getFloodData(request), fwaKey)
      reply.view('map', model)
    },
    validate: {
      query: {
        fwa_key: Joi.number()
      }
    },
    ext: {
      onPreHandler: [{
        method: prehandler
      }]
    }
  }
}
