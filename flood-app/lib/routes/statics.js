module.exports = {
  method: 'GET',
  path: '/public/{path*}',
  config: {
    handler: {
      directory: {
        path: ['public']
      }
    }
  }
}
