module.exports = {
  method: 'GET',
  path: '/robots.txt',
  config: {
    handler: {
      file: 'public/robots.txt'
    }
  }
}
