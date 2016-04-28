var config = require('../config')
var serverConfig = config.server

const manifest = {
  server: {
    connections: {
      routes: {
        //  Sets common security headers
        //  http://hapijs.com/api#route-options
        security: true,
        state: {
          failAction: 'ignore' // ignore any legacy cookies state
        }
      }
    }
  },
  connections: [
    {
      port: serverConfig.port,
      host: serverConfig.host
    }
  ],
  registrations: [
    {
      plugin: {
        register: 'inert'
      }
    },
    {
      plugin: {
        register: 'lout'
      }
    },
    {
      plugin: {
        register: 'h2o2'
      }
    },
    {
      plugin: {
        register: 'vision'
      }
    },
    {
      plugin: {
        register: 'good',
        options: config.logging
      }
    }
  ]
}

module.exports = manifest
