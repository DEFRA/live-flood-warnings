/* global $ */

var center = require('../center-point').latlng
var StationsMap = require('../stations-map')
var StationChart = require('../station-chart')

function StationPage (options) {
  options = $.extend(true, {
    map: {
      centroid: center,
      target: 'map',
      initialZoom: 11
    }
  }, options)

  var stationsMap = new StationsMap(options.map)
  // Only run station chart if the station is active and has values
  if (options.station.status === 'active') {
    StationChart(options)
  }

  var $details = $('#station-map-details')
  $details.on('click', function () {
    setTimeout(function () {
      stationsMap.map.updateSize()
    }, 50)
  })

  var $broaden = $('#station-broaden')
  var $map = $('#map-article')
  var $mapSummary = $('summary', $map)
  $broaden.on('click', function (e) {
    e.preventDefault()
    $mapSummary.trigger('click')
    $mapSummary.focus()
    window.location.href = $map.selector
  })

  var $express = $('#expand-summary-express')
  var $summaryExpress = $('#summary-express')
  $express.on('click', function (e) {
    e.preventDefault()
    $summaryExpress.trigger('click')
    $summaryExpress.focus()
  })
}

module.exports = StationPage
