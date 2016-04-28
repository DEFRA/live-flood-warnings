function MapViewModel (model, key) {
  this.date = model.date
  this.summary = model.summary
  this.fwaKey = key || 0

  // Serialized e2e test data
  this.testDataJSON = JSON.stringify(model.summary)
}

module.exports = MapViewModel
