function HomeViewModel (model, hasError) {
  this.date = model.date
  this.bannerMessage = model.message
  this.summary = model.summary

  // Handling any errors coming in
  if (hasError) {
    this.locationError = 'No results match your search term. Please try again.'
  }

  // Serialized e2e test data
  this.testDataJSON = JSON.stringify(model.summary)
}

module.exports = HomeViewModel
