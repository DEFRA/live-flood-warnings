/* global $ */

var proj4 = require('proj4')
var ol = require('openlayers')
var center = require('./center-point').lnglat
var centroidHighlightStyle = require('./warnings-map-styles').centroidHighlight
var layers = require('./warnings-map-layers')

// proj4 is accessed using global variable within
// openlayers library so we need to export it to `window`
window.proj4 = proj4

function WarningsMap (options) {
  var fwaKey = options.fwaKey
  var $body = $(document.body)
  var $container = $('#' + options.target)

  // Enable the map to be viewed
  $container.addClass('enable')

  var highlightedFeature

  var extent = ol.proj.transformExtent([
    -5.75447130203247,
    49.9302711486816,
    1.79968345165253,
    55.8409309387207
  ], 'EPSG:4326', 'EPSG:3857')

  var view = new ol.View({
    center: ol.proj.transform(center, 'EPSG:4326', 'EPSG:3857'),
    zoom: 6,
    minZoom: 4,
    maxZoom: 17,
    extent: extent
  })

  var map = new ol.Map({
    target: options.target,
    layers: layers,
    view: view,
    pixelRatio: 1,
    interactions: ol.interaction.defaults({
      altShiftDragRotate: false,
      pinchRotate: false
    })
  })

  var featureOverlayCentroid = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
      features: new ol.Collection(),
      useSpatialIndex: false
    }),
    style: centroidHighlightStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  })

  map.on('singleclick', function (e) {
    var coordinate = e.coordinate
    var pixel = e.pixel

    // Check if an alert/warning centroid has been clicked
    var feature = getFeatureFromPixel(pixel)

    if (!feature) {
      if (bullseye(pixel)) {
        getWMSFeature(coordinate, function (feature) {
          if (feature) {
            navigateToFloodWarning(feature.properties.fwa_key)
          }
        })
      }
    } else {
      navigateToFloodWarning(feature.get('fwa_key'))
    }
  })

  map.on('pointermove', function (e) {
    if (e.dragging) {
      return
    }

    var pixel = map.getEventPixel(e.originalEvent)
    var feature = getFeatureFromPixel(pixel)

    if (feature || bullseye(pixel)) {
      if (feature) {
        highlightFeatureById(feature.get('fwa_key'))
      }
      $body.css('cursor', 'pointer')
    } else {
      unhighlightFeature()
      $body.css('cursor', 'default')
    }
  })

  function navigateToFloodWarning (fwaKey) {
    if (fwaKey) {
      window.location.href = '/warnings#details-' + fwaKey
    }
  }

  function highlightFeatureById (fwaKey) {
    var centroid = getFeatureById(fwaKey)
    highlightFeature(centroid)
  }

  function getFeatureById (fwaKey) {
    var centroidSource = getLayer('alert-centroids').getSource()
    var ret
    centroidSource.forEachFeature(function (feature) {
      if (feature.get('fwa_key') === fwaKey) {
        ret = feature
      }
    })
    return ret
  }

  function getFeatureFromPixel (pixel) {
    var feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
      return feature
    })
    return feature
  }

  function unhighlightFeature () {
    if (highlightedFeature) {
      featureOverlayCentroid.getSource().removeFeature(highlightedFeature)
      highlightedFeature = null
    }
  }

  function highlightFeature (featureCentroid) {
    if (featureCentroid !== highlightedFeature) {
      unhighlightFeature()

      if (featureCentroid) {
        featureOverlayCentroid.getSource().addFeature(featureCentroid)
      }

      highlightedFeature = featureCentroid
    }
  }

  function getLayer (ref) {
    var result
    map.getLayers().forEach(function (layer) {
      if (layer.get('ref') === ref) {
        result = layer
      }
    })
    return result
  }

  function bullseye (pixel) {
    return map.forEachLayerAtPixel(pixel, function (layer) {
      return true
    }, null, function (layer) {
      return layer === getLayer('alert-polygons')
    })
  }

  function getWMSFeature (coordinate, callback) {
    var feature
    var viewResolution = view.getResolution()

    var url = getLayer('alert-polygons').getSource().getGetFeatureInfoUrl(coordinate, viewResolution, 'EPSG:3857', {
      INFO_FORMAT: 'application/json',
      FEATURE_COUNT: 10,
      propertyName: 'fwa_key,severity'
    })

    if (url) {
      $.getJSON(url, function (data) {
        if (data && data.features.length) {
          // Get the feature with the lowest severity
          for (var i = 0; i < data.features.length; i++) {
            if (!feature || data.features[i].properties.severity < feature.properties.severity) {
              feature = data.features[i]
            }
          }
        }
        callback(feature)
      })
    } else {
      callback()
    }
  }

  function panTo (point, zoom) {
    view.setCenter(point)
    view.setZoom(zoom)
  }

  function toggleBase ($element) {
    var road = getLayer('bing-road')
    var aerial = getLayer('bing-aerial')

    road.setVisible(!road.getVisible())
    aerial.setVisible(!aerial.getVisible())

    if (road.getVisible()) {
      $element.html('Earth view<i class="fa fa-earth" title="Earth view"></i>')
      $element.attr('title', 'Earth view')
    } else {
      $element.html('Map view<i class="fa fa-road" title="Map view"></i>')
      $element.attr('title', 'Map view')
    }
  }

  function updateSize () {
    map.updateSize()
  }

  // If we have a fwa then zoom to the centroid once the source is loaded.
  if (fwaKey) {
    var centroidSource = getLayer('alert-centroids').getSource()
    centroidSource.on('change', function (e) {
      if (centroidSource.getState() === 'ready') {
        var feature = getFeatureById(fwaKey)
        if (feature) {
          panTo(feature.getGeometry().getCoordinates(), 12)
          highlightFeatureById(fwaKey)
        }
      }
    })
  }

  this.panTo = panTo
  this.toggleBase = toggleBase
  this.updateSize = updateSize
}

module.exports = WarningsMap
