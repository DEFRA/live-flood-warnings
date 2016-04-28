var config = require('../../config').geoserver
var uri = config.protocol + '://' + config.host + ':' + config.port + '/geoserver/flood/ows'

module.exports = {
  method: 'GET',
  path: '/flood/ows',
  config: {
    description: 'Proxy requests bound for Geoserver',
    handler: {
      proxy: {
        mapUri: function (request, callback) {
          var url = uri + request.url.search
          callback(null, url)
        },
        passThrough: true
      }
    }
  }
}
