var Joi = require('joi')
var service = require('../services')
var prehandler = require('./ext/prehandler')
var HomeViewModel = require('../models/home-view')

module.exports = {
  method: 'GET',
  path: '/',
  config: {
    description: 'Get homepage',
    handler: function (request, reply) {
      var hasError = request.query.err === 'loc'
      var model = new HomeViewModel(service.getFloodData(request), hasError)
      reply.view('home', model)
    },
    validate: {
      query: {
        err: Joi.string().valid('loc')
      }
    },
    ext: {
      onPreHandler: [{
        method: prehandler
      }]
    }
  }
}
