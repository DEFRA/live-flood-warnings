var Station = require('./station')
var errorMessages = {
  loc: 'No results match your search term. Please try again.',
  geo: 'There is currently a delay in obtaining the results for this area. Normal service will be resumed as soon as possible. In the meantime please use the map below to find the latest information near you.'
}

function RiverLevelsViewModel (model, errorRef, warnings, stations, centroid, queryLocation, formattedLocation) {
  var welshBorderCatchments = ['dee', 'severn uplands', 'teme', 'wye']

  // Localised banner
  if (warnings && warnings.message) {
    if (warnings.severity) {
      var summary = warnings.summary[warnings.severity - 1]
      this.banner = {
        url: summary.severity < 4 ? '/warnings?location=' + queryLocation : '',
        message: warnings.message,
        severity: summary.severity,
        icon: summary.hash
      }
    } else {
      this.banner = {
        message: warnings.message,
        severity: warnings.severity
      }
    }
  }

  this.date = model.date
  this.alertsCount = model.active.length
  this.summary = model.summary
  this.isLocalised = !!formattedLocation
  this.errorMessage = errorRef ? errorMessages[errorRef] : ''
  this.queryLocation = queryLocation
  this.formattedLocation = formattedLocation
  this.centroidJSON = centroid ? JSON.stringify(centroid.coordinates) : 'undefined'
  this.isGrouped = false
  this.provideLocalLinkToNrw = false

  // Set up the (grouped) stations
  if (stations && stations.length) {
    stations = stations.map(function (item) {
      return new Station(item)
    })

    if (stations.length > 6) {
      // Group stations by river if there are more than 6
      this.isGrouped = true

      var group
      var grouped = {}
      for (var i = 0; i < stations.length; i++) {
        group = grouped[stations[i].river]
        if (!group) {
          grouped[stations[i].river] = [stations[i]]
        } else {
          group.push(stations[i])
        }
      }
      this.stations = grouped
    } else {
      this.stations = stations
    }

    // NRW local signposting
    for (var j = 0; j < stations.length; j++) {
      if (welshBorderCatchments.indexOf(stations[j].catchment.toLowerCase()) > -1) {
        this.provideLocalLinkToNrw = true
        break
      }
    }
  }

  // NRW signposting if it's the national view and we're not providing a local link
  this.provideNationalLinkToNrw = !this.isLocalised && !this.provideLocalLinkToNrw
}

module.exports = RiverLevelsViewModel
