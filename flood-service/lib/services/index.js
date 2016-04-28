var queries = require('./queries.json')

function FloodService () {
  this.getAllAlertsAndWarnings = function (db, callback) {
    return db.query(queries.allAlertsAndWarnings, callback)
  }

  this.getAlertsByEnvelope = function (db, xmin, ymin, xmax, ymax, callback) {
    return db.query(queries.alertsByEnvelope, [xmin, ymin, xmax, ymax], callback)
  }

  this.getStationsByRadius = function (db, lng, lat, radiusM, callback) {
    return db.query(queries.stationsByRadius, [lng, lat, radiusM], callback)
  }

  this.getStation = function (db, id, direction, callback) {
    return db.query(queries.station, [id, direction], callback)
  }

  this.getTelemetry = function (db, id, direction, callback) {
    return db.query(queries.telemetry, [id, direction], callback)
  }

  this.getStationsOverview = function (db, callback) {
    return db.query(queries.stationsOverview, callback)
  }
}

module.exports = new FloodService()
