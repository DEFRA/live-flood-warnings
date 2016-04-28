var Severity = require('./severity')

function NotificationViewModel (date, severity, notification, location) {
  this.key = notification.fwa_key
  this.date = date
  this.title = notification.severity_description + ' at ' + notification.description
  this.description = notification.description
  this.message = notification.message
  this.messageDate = notification.message_changed
  this.severityDate = notification.severity_changed
  this.iconName = severity.hash
  this.severity = severity
  this.isExpired = severity.id === 4
  if (location) {
    this.riversHref = '/river-and-sea-levels?location=' + location
  } else {
    var point = JSON.parse(notification.centroid_json)
    this.riversHref = '/river-and-sea-levels?lat=' + point.coordinates[1].toFixed(5) + '&lng=' + point.coordinates[0].toFixed(5)
  }
}

function PanelViewModel (date, severity, notifications, location, summary) {
  this.severity = severity
  this.summary = summary
  this.title = notifications.length + ' ' + (notifications.length > 1 ? severity.pluralisedTitle : severity.title).toLowerCase()
  this.subTitle = severity.subTitle
  this.notifications = notifications.map(function (item) {
    return new NotificationViewModel(date, severity, item, location)
  })
  this.showFilter = this.notifications.length > 10
}

function WarningsViewModel (model, location, errorMessage) {
  var date = model.date
  this.date = date
  this.title = model.location
  this.location = location
  this.isLocalised = model.isLocalised
  this.bannerMessage = model.headline
  this.panels = []
  this.errorMessage = errorMessage || ''

  var summary = model.summary
  if (model.severeWarnings.length) {
    this.panels.push(new PanelViewModel(date, Severity.severeWarning, model.severeWarnings, location, summary[0]))
  }
  if (model.warnings.length) {
    this.panels.push(new PanelViewModel(date, Severity.warning, model.warnings, location, summary[1]))
  }
  if (model.alerts.length) {
    this.panels.push(new PanelViewModel(date, Severity.alert, model.alerts, location, summary[2]))
  }
  if (model.expired.length) {
    this.panels.push(new PanelViewModel(date, Severity.expired, model.expired, location, summary[3]))
  }
  this.hasPanels = this.panels.length

  // Serialized e2e test data
  this.testDataJSON = JSON.stringify(model.summary)
}

module.exports = WarningsViewModel
