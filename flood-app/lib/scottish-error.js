function ScottishError (formattedAddress) {
  this.formattedAddress = formattedAddress
  this.message = 'Location is in Scotland'
  this.name = 'ScottishError'
  this.stack = Error('ScottishError')
}

ScottishError.prototype = Object.create(Error.prototype)
ScottishError.prototype.constructor = ScottishError

module.exports = ScottishError
