/* global $ */

var proj4 = require('proj4')
var ol = require('openlayers')

// proj4 is accessed using global variable within
// openlayers library so we need to export it to `window`
window.proj4 = proj4

function StationsMap (options) {
  options = $.extend({
    initialZoom: 6,
    showCrosshair: false,
    showFullScreenControl: true
  }, options)

  var target = options.target
  var stationId = options.stationId
  var point = options.centroid.reverse()
  var centre = ol.proj.transform(point, 'EPSG:4326', 'EPSG:3857')
  var $body = $(document.body)
  var hoverId

  // Bing maps source with ordnance survey background mappping
  var mapsSource = new ol.source.BingMaps({
    key: 'Ajou-3bB1TMVLPyXyNvMawg4iBPqYYhAN4QMXvOoZvs47Qmrq7L5zio0VsOOAHUr',
    imagerySet: 'road' // ordnancesurvey
  })

  // New geojson source, from stations layer, using the 40km wide bounding box to filter results
  var sourceStations = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    projection: 'EPSG:3857',
    url: '/flood/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=flood:stations&maxFeatures=10000&outputFormat=application/json&srsName=EPSG:4326'
  })

  function pointStyle (feature, resolution) {
    var id = parseInt(feature.getId().split('stations.')[1], 10)
    var props = feature.getProperties()

    if (id === stationId && resolution <= 200) {
      switch (true) {
        case props.atrisk:
          return [
            new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 42],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/public/images/icon-homepin-amber.png'
              })
            })
          ]
        case props.status === 'Suspended' || props.status === 'Closed':
          return [
            new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 42],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/public/images/icon-homepin-grey.png'
              })
            })
          ]
        default:
          return [
            new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 42],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/public/images/icon-homepin-blue.png'
              })
            })
          ]
      }
    } else if (resolution > 200) {
      switch (true) {
        case props.atrisk:
          return [
            new ol.style.Style({
              image: new ol.style.Circle({
                fill: new ol.style.Fill({
                  color: '#EC7A21'
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                  color: '#000000'
                })
              })
            })
          ]
        case props.status === 'Suspended' || props.status === 'Closed':
          return [
            new ol.style.Style({
              image: new ol.style.Circle({
                fill: new ol.style.Fill({
                  color: '#858585'
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                  color: '#000000'
                })
              })
            })
          ]
        default:
          return [
            new ol.style.Style({
              image: new ol.style.Circle({
                fill: new ol.style.Fill({
                  color: '#2A69AF'
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                  color: '#000000'
                })
              })
            })
          ]
      }
    } else {
      // resolution <= 200
      switch (true) {
        case props.atrisk:
          return [
            new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 21],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/public/images/icon-pin-amber.png'
              })
            })
          ]
        case props.status === 'Suspended' || props.status === 'Closed':
          return [
            new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 21],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/public/images/icon-pin-grey.png'
              })
            })
          ]
        default:
          return [
            new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 21],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/public/images/icon-pin-blue.png'
              })
            })
          ]
      }
    }
  }

  function featureHighlightStyle (feature, resolution) {
    var id = parseInt(feature.getId().split('stations.')[1], 10)
    var props = feature.getProperties()

    if (id === stationId && resolution <= 200) {
      switch (true) {
        case props.atrisk:
          return [
            new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 42],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/public/images/icon-homepin-amber-hl.png'
              })
            })
          ]
        case props.status === 'Suspended' || props.status === 'Closed':
          return [
            new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 42],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/public/images/icon-homepin-grey-hl.png'
              })
            })
          ]
        default:
          return [
            new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 42],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/public/images/icon-homepin-blue-hl.png'
              })
            })
          ]
      }
    } else if (resolution > 200) {
      switch (true) {
        case props.atrisk:
          return [
            new ol.style.Style({
              image: new ol.style.Circle({
                fill: new ol.style.Fill({
                  color: '#FFA700'
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                  color: '#000000'
                })
              })
            })
          ]
        case props.status === 'Suspended' || props.status === 'Closed':
          return [
            new ol.style.Style({
              image: new ol.style.Circle({
                fill: new ol.style.Fill({
                  color: '#B9B9B9'
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                  color: '#000000'
                })
              })
            })
          ]
        default:
          return [
            new ol.style.Style({
              image: new ol.style.Circle({
                fill: new ol.style.Fill({
                  color: '#009EFF'
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                  color: '#000000'
                })
              })
            })
          ]
      }
    } else {
      // resolution <= 200
      switch (true) {
        case props.atrisk:
          return [
            new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 21],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/public/images/icon-pin-amber-hl.png'
              })
            })
          ]
        case props.status === 'Suspended' || props.status === 'Closed':
          return [
            new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 21],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/public/images/icon-pin-grey-hl.png'
              })
            })
          ]
        default:
          return [
            new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 21],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/public/images/icon-pin-blue-hl.png'
              })
            })
          ]
      }
    }
  }

  // Setup the layers
  var tileLayer = new ol.layer.Tile({
    source: mapsSource,
    visible: true
  })

  var stationLayer = new ol.layer.Vector({
    title: 'stations',
    source: sourceStations,
    visible: true,
    style: pointStyle
  })

  var aerialLayer = new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: 'Ajou-3bB1TMVLPyXyNvMawg4iBPqYYhAN4QMXvOoZvs47Qmrq7L5zio0VsOOAHUr',
      imagerySet: 'AerialWithLabels'
    }),
    visible: false
  })

  var layers = [tileLayer, aerialLayer, stationLayer]

  // Crosshair option
  if (options.showCrosshair) {
    // Set the centroid as a crosshair
    var centreFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform(point, 'EPSG:4326', 'EPSG:3857'))
    })

    var centreSource = new ol.source.Vector({
      features: [centreFeature]
    })

    var centreStyle = new ol.style.Style({
      image: new ol.style.Icon({
        src: '/public/images/crosshairs.png'
      })
    })

    var centreLayer = new ol.layer.Vector({
      source: centreSource,
      style: centreStyle
    })

    layers.push(centreLayer)
  }

  // Create the view
  var startZoom = options.initialZoom
  var view = new ol.View({
    center: centre,
    zoom: startZoom,
    minZoom: startZoom <= 6 ? startZoom - 1 : 6,
    maxZoom: 16,
    extent: ol.proj.transformExtent([
      -5.75447130203247,
      49.9302711486816,
      1.79968345165253,
      55.8409309387207
    ], 'EPSG:4326', 'EPSG:3857')
  })

  // Popup divs
  var popup = document.getElementById('station-popup')
  var popupContent = document.getElementById('station-popup-content')

  // overlay used for the popup
  var overlay = new ol.Overlay({
    element: popup
  })

  // Map controls
  var controls = ol.control.defaults()

  controls.push(new ol.control.ScaleLine({
    units: 'imperial',
    minWidth: 128
  }))

  if (options.showFullScreenControl) {
    var inactiveLabel = document.createElement('span')
    inactiveLabel.appendChild(document.createTextNode('Full screen \u2194'))
    var activeLabel = document.createElement('span')
    activeLabel.appendChild(document.createTextNode('Exit full screen \u00d7'))
    controls.push(new ol.control.FullScreen({
      label: inactiveLabel,
      labelActive: activeLabel
    }))
  }

  // setup the map
  var map = new ol.Map({
    controls: controls,
    target: target,
    layers: layers,
    view: view,
    overlays: [overlay],
    pixelRatio: 1,
    interactions: ol.interaction.defaults({
      altShiftDragRotate: false,
      pinchRotate: false
    })
  })

  // overlay for hover icon
  var featureOverlayCentroid = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
      features: new ol.Collection(),
      useSpatialIndex: false
    }),
    style: featureHighlightStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true
  })

  // We're only interested in station
  // pins contained on the stationLayer
  function layerFilter (candidate) {
    return candidate === stationLayer
  }

  // Wrapper for forEachFeatureAtPixel that
  // returns undefined if no feature found
  function getFeatureFromPixel (pixel) {
    return map.forEachFeatureAtPixel(pixel, function (feature, layer) {
      return feature
    }, this, layerFilter)
  }

  // Get the screen location of the specified station.  This exists so that Selenium tests can click on a station icon during
  // headless and parallel tests.
  function getPixelOfFeature (rloi_id) {
    var feature = sourceStations.getFeatureById('stations.' + rloi_id)
    var geometry = feature.getGeometry()
    var coordinates = geometry.getCoordinates()
    return map.getPixelFromCoordinate(coordinates)
  }

  var highlightedFeature
  function highlightFeature (feature) {
    if (feature !== highlightedFeature) {
      unhighlightFeature()
      if (feature) {
        featureOverlayCentroid.getSource().addFeature(feature)
      }
      highlightedFeature = feature
    }
    if (options.additionalHover) {
      options.additionalHover(feature ? parseInt(feature.getId().split('stations.')[1], 10) : -1)
    }
  }

  function unhighlightFeature () {
    if (highlightedFeature) {
      featureOverlayCentroid.getSource().removeFeature(highlightedFeature)
      highlightedFeature = null
    }
    if (options.additionalHoverEnd) {
      options.additionalHoverEnd()
    }
  }

  function highlightFeatureById (featureId) {
    highlightFeature(sourceStations.getFeatureById('stations.' + featureId))
  }

  function setCursorDefault () {
    $body.css('cursor', 'default')
  }

  function setCursorPointer () {
    $body.css('cursor', 'pointer')
  }

  function showPopup (feature, pixel) {
    var props = feature.getProperties()
    hoverId = parseInt(feature.getId().split('stations.')[1], 10)
    var popupHTML = '<ul><li><strong>' + props.river + ' at ' + props.name

    var stationType = props.type.toLowerCase()
    if (typeof stationType === 'string') {
      if (stationType === 'm') {
        popupHTML += ' (upstream/downstream)'
      }
    }

    var stationStatus = props.status.toLowerCase()
    if (stationStatus) {
      if (stationStatus === 'suspended') {
        popupHTML += ' - temporarily out of service'
      }
    }
    if (hoverId !== stationId) {
      popupHTML += '</strong></li><span>Select to view details</span></ul>'
    } else {
      '</strong></li></ul>'
    }

    popupContent.innerHTML = popupHTML
    overlay.setPosition(map.getCoordinateFromPixel(pixel))
  }

  function toggleBase ($element) {
    aerialLayer.setVisible(!aerialLayer.getVisible())

    if (!aerialLayer.getVisible()) {
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

  function getState () {
    return {
      zoom: view.getZoom(),
      center: ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326').reverse()
    }
  }

  function updateLegend () {
    if (view.getResolution() <= 200) {
      $('.legend ul li').each(function (index) {
        $(this).removeClass('round')
        $(this).addClass('pin')
      })
    } else {
      $('.legend ul li').each(function (index) {
        $(this).removeClass('pin')
        $(this).addClass('round')
      })
    }
  }

  // On singleclick, detect if we clicked a
  // station and fire a custom event if so
  map.on('singleclick', function (e) {
    if (map.hasFeatureAtPixel(e.pixel, layerFilter)) {
      var feature = getFeatureFromPixel(e.pixel)
      var id = feature && parseInt(feature.getId().split('stations.')[1], 10)
      if (id && id !== stationId) {
        var props = feature.getProperties()
        if (props.iswales) {
          window.open('http://rloi.naturalresources.wales/ViewDetails?station=' + id)
        } else {
          window.location.href = '/station/' + id + '?direction=' + props.direction
        }
      }
    }
  }, this)

  // On mousemove, detect if we clicked a
  // station and fire a custom event if so
  map.on('pointermove', function (e) {
    if (e.dragging) {
      return
    }

    var pixel = map.getEventPixel(e.originalEvent)
    if (map.hasFeatureAtPixel(pixel, layerFilter)) {
      var feature = getFeatureFromPixel(pixel)
      if (feature) {
        // Highlight feature
        var id = feature.getId() && feature.getId().split('stations.')[1]
        if (id && parseInt(id, 10) !== stationId) {
          setCursorPointer()
        } else {
          setCursorDefault()
        }
        highlightFeature(feature)

        if (id && hoverId !== parseInt(id, 10)) {
          showPopup(feature, pixel)
        }
      } else {
        // Unhighlight feature
        setCursorDefault()
        unhighlightFeature()

        overlay.setPosition()
        hoverId = null
      }
    } else {
      setCursorDefault()
      unhighlightFeature()

      overlay.setPosition()
      hoverId = null
    }
  })

  view.on('change:resolution', function (e) {
    updateLegend()
  })

  updateLegend()

  // Expose publicly accessible properties and methods
  this.map = map
  this.unhighlightFeature = unhighlightFeature
  this.highlightFeatureById = highlightFeatureById
  this.toggleBase = toggleBase
  this.updateSize = updateSize
  this.getState = getState
}

module.exports = StationsMap
