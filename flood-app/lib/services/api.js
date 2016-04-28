var config = require('../../config').service
var util = require('../util')
var protocol = config.protocol
var host = config.host
var port = config.port
var urlBase = protocol + '://' + host + ':' + port

function getAllAlertsAndWarnings (callback) {
  var path = '/fwa/gps'
  var url = urlBase + path
  return util.getJson(url, callback)
}

function alertsByEnvelope (bbox, callback) {
  var path = '/fwa/gps/alertsbyenvelope/json/'
  var url = urlBase + path + bbox.xmin + '/' + bbox.ymin + '/' + bbox.xmax + '/' + bbox.ymax
  return util.getJson(url, callback)
}

function getStationsByRadius (lat, lng, radiusM, callback) {
  var path = '/rloi/gps/stationsbyradius/'
  var url = urlBase + path + lng + '/' + lat + '/' + radiusM
  return util.getJson(url, callback)
}

function getStationById (id, direction, callback) {
  var path = '/rloi/station/'
  var url = urlBase + path + id + '/' + direction
  return util.getJson(url, callback)
}

function getStationTelemetry (id, direction, callback) {
  var path = '/rloi/telemetry/'
  var url = urlBase + path + id + '/' + direction
  return util.getJson(url, callback)
}

function getStationsOverview (callback) {
  var url = urlBase + '/rloi/stationsoverview'
  return util.getJson(url, callback)
}

module.exports = {
  getAllAlertsAndWarnings: getAllAlertsAndWarnings,
  getStationById: getStationById,
  alertsByEnvelope: alertsByEnvelope,
  getStationsByRadius: getStationsByRadius,
  getStationTelemetry: getStationTelemetry,
  getStationsOverview: getStationsOverview
}
