var Boom = require('boom')
var service = require('../services')

module.exports = {
  method: 'GET',
  path: '/rloi/stationsoverview',
  config: {
    description: 'Get station by id',
    handler: function (request, reply) {
      var db = request.pg.client

      service.getStationsOverview(db, function (err, result) {
        if (err) {
          return reply(Boom.badRequest('Failed to get stations overview data', err))
        }

        reply(result.rows)
      })
    }
  }
}
