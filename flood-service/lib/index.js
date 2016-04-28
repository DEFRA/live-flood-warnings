var Glue = require('glue')
var config = require('../config')
var manifest = require('./manifest')
var routes = require('./routes')

var options = {
  relativeTo: __dirname
}

Glue.compose(manifest, options, function (err, server) {
  if (err) {
    throw err
  }

  /*
   * Register routes
   */
  server.route(routes)

  /*
   * Handle route errors
   */
  server.ext('onPreResponse', function (request, reply) {
    var response = request.response

    if (response.isBoom) {
      // An error was raised during
      // processing the request
      var statusCode = response.output.statusCode

      request.log('error', {
        statusCode: statusCode,
        data: response.data,
        message: response.message
      })
    }
    return reply.continue()
  })

  /*
   * Start the server
   */
  server.start(function (err) {
    var details = {
      name: 'flood-service',
      uri: server.info.uri
    }

    if (err) {
      details.error = err
      details.message = 'Failed to start ' + details.name
      server.log('error', details)
      throw err
    } else {
      details.config = config
      details.message = 'Started ' + details.name
      server.log('info', details)
      console.info(details.message)
    }
  })
})
