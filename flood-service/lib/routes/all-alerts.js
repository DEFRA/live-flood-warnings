var Boom = require('boom')
var service = require('../services')

module.exports = {
  method: 'GET',
  path: '/fwa/gps',
  config: {
    description: 'Get all notifications',
    handler: function (request, reply) {
      var db = request.pg.client

      service.getAllAlertsAndWarnings(db, function (err, result) {
        if (err) {
          return reply(Boom.badRequest('Failed to get alerts and warnings', err))
        }

        var fwisTimestamp = result.rows.splice(result.rows.length - 1, 1)

        reply({
          date: Date.now(),
          alerts: result.rows,
          fwisTimestamp: fwisTimestamp[0].load_timestamp
        })
      })
    }
  }
}
