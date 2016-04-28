module.exports = {
  method: 'GET',
  path: '/news-updates',
  config: {
    description: 'Get the news and update page',
    handler: {
      view: 'news-updates'
    }
  }
}
