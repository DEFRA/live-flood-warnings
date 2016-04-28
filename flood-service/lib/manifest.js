var config = require('../config')
var serverConfig = config.server
var dbConfig = config.database

const manifest = {
  server: {
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
        register: 'hapi-node-postgres',
        options: dbConfig
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
