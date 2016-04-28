/* global $ */

var ol = require('openlayers')
var WarningsMap = require('../warnings-map')

function MapPage (options) {
  var target = 'map'

  options = $.extend(true, {
    map: {
      target: target
    }
  }, options)

  var $html = $('html')
  var $mapContainer = $('#map-container')
  var $query = $('input[name=location]', $mapContainer)
  var $error = $('#error-message', $mapContainer)
  var $toggleBase = $('a.toggle-base', $mapContainer)
  var $toggleMap = $('a.toggle-map', $mapContainer)
  var warningsMap = new WarningsMap(options.map)

  $mapContainer.on('submit', 'form', function (e) {
    e.preventDefault()

    var location = $query.val().replace(/[^a-zA-Z0-9',-.& ]/g, '')
    var noResults = 'No results match this search term.'

    if (location) {
      var url = '/api/geocode?location=' + location
      $error.text('')

      $.ajax({
        url: url
      }).done(function (data) {
        if (data) {
          if (!data.isScottishAddress) {
            var coords = data.point.coordinates
            var point = ol.proj.transform([coords[1], coords[0]], 'EPSG:4326', 'EPSG:3857')
            warningsMap.panTo(point, 10)
          } else {
            var sepaText = 'Scottish Environment Protection Agency website'
            var sepaLink = '<a title="' + sepaText + '" href="http://www.sepa.org.uk/flooding.aspx" rel="external">' + sepaText + '</a>'
            $error.html('Flood warning information for Scotland is available on the ' + sepaLink)
          }
        } else {
          $error.text(noResults)
        }
      })
      .fail(function (jqxhr, textStatus, error) {
        if (jqxhr.status === 400) {
          $error.text(noResults)
        } else {
          $error.text('There is currently a delay in obtaining the results for this area. Normal service will be resumed as soon as possible. In the meantime please use the map below to find the latest information near you.')
        }
      })
    } else {
      $error.text(noResults)
    }
  })

  $toggleBase.click(function (e) {
    e.preventDefault()
    warningsMap.toggleBase($toggleBase)
  })

  $toggleMap.click(function (e) {
    e.preventDefault()
    $mapContainer.toggleClass('map-enlarge')
    warningsMap.updateSize()
    if ($mapContainer.hasClass('map-enlarge')) {
      $toggleMap.html('Exit full screen <i class="fa fa-compress" alt="Exit full screen">')
      $toggleMap.prop('title', 'Exit full screen')
      $html.css('overflow', 'hidden')
    } else {
      $toggleMap.html('Full screen <i class="fa fa-expand" alt="Full screen">')
      $toggleMap.prop('title', 'Full screen')
      $html.css('overflow', '')
    }
  })
}

module.exports = MapPage
