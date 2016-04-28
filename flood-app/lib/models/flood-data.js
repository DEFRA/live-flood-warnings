var util = require('../util')
var Severity = require('./severity')
var moment = require('moment')

function FloodData (data, geocoded) {
  var address = geocoded && geocoded.address
  var location = address && address.formattedAddress

  Object.defineProperties(this, {
    data: {
      value: data
    },
    geocoded: {
      value: geocoded
    },
    address: {
      value: address
    },
    location: {
      value: location || 'England and Wales'
    },
    isLocalised: {
      value: !!location
    }
  })
}

Object.defineProperties(FloodData.prototype, {
  date: {
    get: function () {
      return this.data.date
    }
  },
  age: {
    get: function () {
      return moment().diff(moment.unix(this.data.fwisTimestamp))
    }
  },
  notifications: {
    get: function () {
      return this.data.alerts
    }
  },
  hasNotifications: {
    get: function () {
      return !!this.notifications.length
    }
  },
  formattedDate: {
    get: function () {
      return this.getFormattedDate()
    }
  },
  severeWarnings: {
    get: function () {
      return this.notifications.filter(function (item) {
        return item.severity === Severity.severeWarning.id
      })
    }
  },
  warnings: {
    get: function () {
      return this.notifications.filter(function (item) {
        return item.severity === Severity.warning.id
      })
    }
  },
  alerts: {
    get: function () {
      return this.notifications.filter(function (item) {
        return item.severity === Severity.alert.id
      })
    }
  },
  expired: {
    get: function () {
      return this.notifications.filter(function (item) {
        return item.severity === Severity.expired.id
      })
    }
  },
  active: {
    get: function () {
      return [].concat(this.severeWarnings, this.warnings, this.alerts)
    }
  },
  hasActive: {
    get: function () {
      return !!this.active.length
    }
  },
  severity: {
    get: function () {
      var severity = 0
      var summary = this.summary

      var first = summary.find(function (item) {
        return item.count > 0
      })

      if (first) {
        severity = first.severity
      }
      return severity
    }
  },
  summary: {
    get: function () {
      var notifications = this.notifications
      var keys = Severity.keys
      var summary = keys.map(function (key) {
        return {
          severity: Severity[key].id,
          count: 0,
          title: Severity[key].title,
          pluralisedTitle: Severity[key].pluralisedTitle,
          hash: Severity[key].hash,
          tagline: Severity[key].tagline,
          description: Severity[key].description
        }
      })

      for (var i = 0; i < notifications.length; i++) {
        summary[notifications[i].severity - 1].count++
      }

      return summary
    }
  },
  message: {
    get: function () {
      var severeWarnings = this.severeWarnings.length
      var warnings = this.warnings.length
      var alerts = this.alerts.length
      var all = severeWarnings + warnings + alerts
      var text = ''

      var template = 'There <<inner>> in force ' + (this.isLocalised ? 'at this location' : 'in ' + this.location) + '.'

      var build = function (string) {
        return template.replace('<<inner>>', string)
      }

      // set the banner message based on the count of the warnings and alerts
      switch (true) {
        case all === 0:
          text += 'are currently no flood warnings or alerts'
          break
        case severeWarnings === 0 && warnings === 0 && alerts >= 1:
          if (alerts === 1) {
            text += 'is currently one flood alert'
          } else {
            text += 'are currently ' + alerts + ' flood alerts'
          }
          break
        case severeWarnings === 0 && warnings >= 1 && alerts === 0:
          if (warnings === 1) {
            text += 'is currently one flood warning'
          } else {
            text += 'are currently ' + warnings + ' flood warnings'
          }
          break
        case severeWarnings >= 1 && warnings === 0 && alerts === 0:
          if (severeWarnings === 1) {
            text += 'is currently one severe flood warning'
          } else {
            text += 'are currently ' + severeWarnings + ' severe flood warnings'
          }
          break
        case severeWarnings === 0 && warnings >= 1 && alerts >= 1:
          if (warnings === 1) {
            text += 'is currently one flood warning and '
          } else {
            text += 'are currently ' + warnings + ' flood warnings and '
          }
          if (alerts === 1) {
            text += 'one alert'
          } else {
            text += alerts + ' alerts'
          }
          break
        case severeWarnings >= 1 && warnings >= 1 && alerts >= 1:
          if (severeWarnings === 1) {
            text += 'is currently one severe flood warning, '
          } else {
            text += 'are currently ' + severeWarnings + ' severe flood warnings, '
          }
          if (warnings === 1) {
            text += 'one warning and '
          } else {
            text += warnings + ' warnings and '
          }
          if (alerts === 1) {
            text += 'one alert'
          } else {
            text += alerts + ' alerts'
          }
          break
        case severeWarnings >= 1 && warnings >= 1 && alerts === 0:
          if (severeWarnings === 1) {
            text += 'is currently one severe flood warning and '
          } else {
            text += 'are currently ' + severeWarnings + ' severe flood warnings and '
          }
          if (warnings === 1) {
            text += 'one warning'
          } else {
            text += warnings + ' warnings'
          }
          break
        case severeWarnings >= 1 && warnings === 0 && alerts >= 1:
          if (severeWarnings === 1) {
            text += 'is currently one severe flood warning and '
          } else {
            text += 'are currently ' + severeWarnings + ' severe flood warnings and '
          }
          if (alerts === 1) {
            text += 'one alert'
          } else {
            text += alerts + ' alerts'
          }
          break
        default:
          // Default to defensively return all values
          text += 'There are currently ' + severeWarnings + ' severe flood warnings, ' + warnings + ' warnings and ' + alerts + ' alerts'
          break
      }
      return build(text)
    }
  },
  headline: {
    get: function () {
      var severeWarnings = this.summary[0].count
      var warnings = this.summary[1].count
      var alerts = this.summary[2].count
      var all = severeWarnings + warnings + alerts

      // start
      // Build the severe and alert part
      // build the alert part
      // end
      var prefix = 'There '
      var postfix = ' in force at this location.'

      var warningText = ''
      var alertText = ''

      // no warnings or alerts so just drop out
      if (all === 0) {
        return prefix + 'are currently no warnings or alerts' + postfix
      }

      // Alerts text
      if (alerts > 1) {
        alertText = 'and ' + alerts + ' alerts'
      } else if (alerts === 1) {
        alertText = 'and one alert'
      } else {
        alertText = 'and no alerts'
      }

      // Warnings text
      if (severeWarnings + warnings === 0) {
        warningText = 'are currently no warnings '
      } else {
        if (severeWarnings > 1) {
          warningText = 'are currently ' + severeWarnings + ' severe flood warnings, '
        } else if (severeWarnings === 1) {
          warningText = 'is currently one severe flood warning, '
        } else {
          warningText = 'are currently no severe flood warnings, '
        }

        if (warnings > 1) {
          warningText += warnings + ' warnings '
        } else if (warnings === 1) {
          warningText += 'one warning '
        } else {
          warningText += 'no warnings '
        }
      }

      return prefix + warningText + alertText + postfix
    }
  }
})

FloodData.prototype.getFormattedDate = function (format) {
  return util.formatDate(this.date, format)
}

module.exports = FloodData
