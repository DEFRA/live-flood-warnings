var Joi = require('joi')
var util = require('../util')
var service = require('../services')
var prehandler = require('./ext/prehandler')
var WarningsViewModel = require('../models/warnings-view')
var ScottishError = require('../scottish-error')

module.exports = {
  method: 'GET',
  path: '/warnings',
  config: {
    description: 'Get warnings page',
    handler: function (request, reply) {
      var location = util.cleanseLocation(request.query.location)
      var model
      if (location) {
        service.getFloodDataByLocation(request, location, function (err, result) {
          if (err) {
            if (err instanceof ScottishError) {
              return reply.view('scotland', {
                formattedAddress: err.formattedAddress
              })
            } else {
              // Assume any other error is an issue with the geocoder and we can return national
              var errorMessage = 'There is currently a delay in obtaining the latest results for this area. ' +
                'The most recent results received are below. Normal service will be resumed as soon as possible.'

              model = new WarningsViewModel(service.getFloodData(request), '', errorMessage)
              request.log('error', err)
              return reply.view('warnings', model)
            }
          }

          // If we don't have a result, redirect to the
          // home page and show the location error message
          if (!result) {
            return reply.redirect('/?err=loc')
          }

          // Render the filtered set of notifications
          model = new WarningsViewModel(result, location)
          reply.view('warnings', model)
        })
      } else {
        // Render all the notifications
        model = new WarningsViewModel(service.getFloodData(request))
        reply.view('warnings', model)
      }
    },
    validate: {
      query: {
        location: Joi.string().allow('')
      }
    },
    ext: {
      onPreHandler: [{
        method: prehandler
      }]
    }
  }
}
