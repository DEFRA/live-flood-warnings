var Glue = require('glue')
var config = require('../config')
var handlebars = require('handlebars')
var manifest = require('./manifest')
var routes = require('./routes')
var service = require('./services')
var apiService = require('./services/api')
var pageRefreshTime = config.pageRefreshTime
var analyticsAccount = config.analyticsAccount
var appVersion = require('../package.json').version

var defaultContext = {
  globalHeaderText: 'GOV.UK',
  pageTitle: 'Flood information service - GOV.UK',
  skipLinkMessage: 'Skip to main content',
  homepageUrl: 'https://www.gov.uk/',
  logoLinkTitle: 'Go to the GOV.UK homepage',
  crownCopyrightMessage: '© Crown copyright',
  assetPath: '/public/',
  htmlLang: 'en',
  headerClass: 'with-proposition',
  pageRefreshTime: pageRefreshTime,
  analyticsAccount: analyticsAccount,
  appVersion: appVersion
}

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
      var useErrorPages = request.route.settings.app.useErrorPages !== false

      // In the event of 404
      // return the `404` view
      if (useErrorPages && statusCode === 404) {
        return reply.view('404').code(statusCode)
      }

      request.log('error', {
        statusCode: statusCode,
        data: response.data,
        message: response.message
      })

      // The return the `500` view
      if (useErrorPages) {
        return reply.view('500').code(statusCode)
      }
    }
    return reply.continue()
  })

  /*
   * Create the handlebars engine
   */
  var engine = handlebars.create()

  /*
   * Create the handlebars engine
   */
  var helpers = require('./helpers')
  for (var key in helpers) {
    if (helpers.hasOwnProperty(key)) {
      engine.registerHelper(key, helpers[key])
    }
  }

  var cacheViews = config.cacheViews
  if (!cacheViews) {
    server.log('info', 'Handlebars views are not being cached')
  }

  server.views({
    engines: {
      html: engine
    },
    relativeTo: process.cwd(),
    path: 'views',
    partialsPath: 'views/partials',
    context: defaultContext,
    layout: true,
    isCached: cacheViews
  })

  /**
   * Use the api service poll to get
   * all flood alerts and warnings data.
   */
  function pollNotifications () {
    server.log('info', 'Getting notifications.')
    apiService.getAllAlertsAndWarnings(function (err, data) {
      if (err || !data) {
        // Clear the cached flood data
        service.floodData = null
        err = err || new Error('No notification data returned.')
        server.log('error', 'Error occurred obtaining the notifications. ' + err.toString())
      } else {
        // Update the cached flood data
        service.floodData = data
        server.log('info', 'Updated alerts and warnings.')
      }

      // Schedule another call to happen after
      // the configured interval has elapsed.
      setTimeout(pollNotifications, config.notificationsPollInterval)
    })
  }
  pollNotifications()

  /*
   * Start the server
   */
  server.start(function (err) {
    var details = {
      name: 'flood-app',
      uri: server.info.uri
    }

    if (err) {
      details.error = err
      details.message = 'Failed to start ' + details.name
      server.log('error', details)
      throw err
    } else {
      if (config.mockExternalHttp) {
        require('../mock')
        server.log('info', 'External requests are being mocked')
      }

      details.config = config
      details.message = 'Started ' + details.name
      server.log('info', details)
      console.info(details.message)
    }
  })
})
