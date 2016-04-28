var Boom = require('boom')
var config = require('../../../config')
var service = require('../../services')

/*
 * Route extension to preload the
 * flood notifications from the service
 */
module.exports = function (request, reply) {
  var floodData = service.floodData

  // Take down service if there are no flood notifications
  if (!floodData) {
    return reply(Boom.badData('No flood data found - taking service offline'))
  }

  // Take down service if flood notifications are older than the given configuration
  if (floodData.age >= config.maxNotificationAge) {
    return reply(Boom.badData('Flood notifications are stale - taking service offline'))
  }

  // Assign the flood data for the duration of the request.
  request.lfw = {
    floodData: floodData
  }

  return reply.continue()
}
