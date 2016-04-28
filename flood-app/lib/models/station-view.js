var moment = require('moment')
var config = require('../../config')
var Station = require('./station')

function dateDiff (date1, date2) {
  return moment(date1).diff(moment(date2), 'days')
}

function StationView (id, stationRaw, telemetry, date) {
  this.station = new Station(stationRaw)
  this.id = id
  this.telemetry = telemetry
  this.catchments = []
  this.date = date
  this.status = this.station.status
  this.outOfDate = dateDiff(Date.now(), this.station.statusDate) <= 5
  this.porMaxValueIsProvisional = false

  var now = moment(Date.now())
  var numberOfProvisionalDays = config.provisionalPorMaxValueDays

  // Provisional por max date
  if (this.station.type === 's' || this.station.type === 'm' || this.station.type === 'g' && this.station.porMaxDate) {
    var diff = moment.duration(now.diff(this.station.porMaxDate))
    if (diff.asDays() < numberOfProvisionalDays) {
      this.station.porMaxValueIsProvisional = true
    }
    this.station.formattedPorMaxDate = moment(this.station.porMaxDate).format('DD/MM/YY')
  }

  // Gets the latest value object
  if (this.telemetry.length) {
    // Need to set the label for the first and last reading (just for chartjs x axis)
    this.telemetry[0].label = moment(this.telemetry[0].ts).format('DD MMMM YYYY hh:mma')
    this.telemetry[this.telemetry.length - 1].label = moment(this.telemetry[this.telemetry.length - 1].ts).format('DD MMMM YYYY hh:mma')
    this.readings = this.telemetry.length
    this.recentValue = this.telemetry[0]
  }

  var coordinates = JSON.parse(this.station.coordinates).coordinates
  this.centroidJSON = JSON.stringify(coordinates.reverse())
  this.stationJSON = JSON.stringify(this.station)

  if (this.station.type === 'c') {
    this.title = 'tidal level'
  } else if (this.station.type === 'g') {
    this.title = 'groundwater level'
  } else {
    this.title = 'river level'
  }

  this.isUpstream = this.station.direction === 'upstream'
  this.isDownstream = this.station.direction === 'downstream'

  function getStationState () {
    var prefix = 'The latest information recorded at this location indicates the river is'
    var suffix = 'its typical range of ' + this.station.percentile95 + ' metres to ' + this.station.percentile5 + ' metres.'

    if (this.station.isSingle || this.station.isMulti) {
      if (!(typeof this.station.percentile5 === 'object' && this.station.percentile5 === null) && !(typeof this.station.percentile95 === 'object' && this.station.percentile95 === null)) {
        if (!isNaN(this.station.percentile5) && !isNaN(this.station.percentile95)) {
          if (parseFloat(this.recentValue._) < parseFloat(this.station.percentile95)) {
            return prefix + ' below ' + suffix
          } else if (parseFloat(this.recentValue._) >= parseFloat(this.station.percentile5)) {
            return 'Flooding is possible. ' + prefix + ' above ' + suffix
          } else {
            return prefix + ' within ' + suffix
          }
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  }

  function getBannerClass () {
    if (!(typeof this.station.percentile5 === 'object' && this.station.percentile5 === null) && !(typeof this.station.percentile95 === 'object' && this.station.percentile95 === null)) {
      if (!isNaN(this.station.percentile5) && !isNaN(this.station.percentile95)) {
        if (parseFloat(this.recentValue._) < parseFloat(this.station.percentile95)) {
          return ''
        } else if (parseFloat(this.recentValue._) >= parseFloat(this.station.percentile5)) {
          return 'alert'
        } else {
          return 'river-level-typical'
        }
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  this.stationState = this.recentValue ? getStationState.call(this) : ''
  this.bannerClass = this.recentValue ? getBannerClass.call(this) : ''
}

module.exports = StationView
