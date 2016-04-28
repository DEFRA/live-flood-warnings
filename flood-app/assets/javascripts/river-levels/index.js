/* global $ */

var StationsMap = require('../stations-map')
var centerPoint = require('../center-point').latlng
var storageKey = 'lfw-river-levels-national-map-state'
var storage = window.sessionStorage

function getState () {
  var state
  if (storage) {
    state = storage.getItem(storageKey)
    if (state) {
      state = JSON.parse(state)
    }
  }
  return state
}

function setState (value) {
  return storage && storage.setItem(storageKey, value)
}

function removeState () {
  return storage && storage.removeItem(storageKey)
}

function RiverLevelsPage (options) {
  var isLocal = !!options.map.centroid
  var center = centerPoint
  var $html = $('html')
  var $mapContainer = $('#map-container')
  var $toggleBase = $('a.toggle-base', $mapContainer)
  var $toggleMap = $('a.toggle-map', $mapContainer)
  var $links = $('.station-links')
  var hasStations = $('a', $links).length > 0
  var initialZoom = 6

  var $fsContents = $('div.fs').contents()

  if (isLocal) {
    initialZoom = hasStations ? 11 : 10
    removeState()
  } else {
    var state = getState()

    if (state) {
      initialZoom = state.zoom
      center = state.center
    }
  }

  options = $.extend(true, {
    map: {
      target: 'map',
      centroid: center,
      showCrosshair: isLocal,
      initialZoom: initialZoom,
      showFullScreenControl: false,
      additionalHover: function (stationId) {
        $links.find('[data-station-id=' + stationId + ']').addClass('hover')
      },
      additionalHoverEnd: function () {
        $links.find('.hover').removeClass('hover')
      }
    }
  }, options)

  var stationsMap = new StationsMap(options.map)
  var map = stationsMap.map

  map.on('moveend', function (e) {
    var value = JSON.stringify(stationsMap.getState())
    setState(value)
  })

  // Map View / Earth view toggle
  $toggleBase.click(function (e) {
    e.preventDefault()
    stationsMap.toggleBase($toggleBase)
  })

  // Custom Fullscreen button
  $toggleMap.click(function (e) {
    e.preventDefault()
    $mapContainer.toggleClass('map-enlarge')
    if ($mapContainer.hasClass('map-enlarge')) {
      $('div.fs').replaceWith($fsContents)
      $toggleMap.html('Exit full screen <i class="fa fa-compress" alt="Exit full screen">')
      $toggleMap.prop('title', 'Exit full screen')
      $html.css('overflow', 'hidden')
    } else {
      $fsContents.wrapAll('<div class="fs"></div>')
      $toggleMap.html('Full screen <i class="fa fa-expand" alt="Full screen">')
      $toggleMap.prop('title', 'Full screen')
      $html.css('overflow', '')
    }
    stationsMap.updateSize()
  })

  // When hovering over `li` elements
  // within the links, highlight the map pin
  if (hasStations) {
    $links.on({
      mouseenter: function (e) {
        var id = $(this).data('station-id')
        stationsMap.highlightFeatureById(id)
      },
      mouseleave: function (e) {
        stationsMap.unhighlightFeature()
      }
    }, 'li')
  }
}

module.exports = RiverLevelsPage
