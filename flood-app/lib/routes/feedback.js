module.exports = {
  method: 'GET',
  path: '/feedback',
  config: {
    description: 'Get the feedback page',
    handler: {
      view: 'feedback'
    }
  }
}
