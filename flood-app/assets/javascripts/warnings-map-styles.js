var ol = require('openlayers')

module.exports = {
  centroid: function (feature, resolution) {
    var styles = {
      severe: [new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [13, 60],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          src: '/public/images/severe-flood-warning-pin.gif'
        })
      })],
      warning: [new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [13, 60],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          src: '/public/images/flood-warning-pin.gif'
        })
      })],
      alert: [new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [13, 60],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          src: '/public/images/flood-alert-pin.gif'
        })
      })]
    }

    switch (feature.get('severity')) {
      case 1:
        return styles.severe
      case 2:
        return styles.warning
      case 3:
        return styles.alert
      default:
        return
    }
  },
  centroidHighlight: function (feature, resolution) {
    var textStroke = new ol.style.Stroke({
      color: '#dcebf9',
      width: 7
    })
    var textFill = new ol.style.Fill({
      color: '#000'
    })

    var text = new ol.style.Text({
      font: '16px "Lucida Grande",Verdana,Geneva,Lucida,Arial,Helvetica,sans-serif',
      text: feature.get('severity_description') + ' - ' + feature.get('description'),
      fill: textFill,
      stroke: textStroke
    })

    var styles = {
      severe: [new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [13, 60],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          src: './public/images/severe-flood-warning-pin.gif'
        }),
        text: text
      })],
      warning: [new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [13, 60],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          src: './public/images/flood-warning-pin.gif'
        }),
        text: text
      })],
      alert: [new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [13, 60],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          src: './public/images/flood-alert-pin.gif'
        }),
        text: text
      })]
    }

    switch (feature.get('severity')) {
      case 1:
        return styles.severe
      case 2:
        return styles.warning
      case 3:
        return styles.alert
      default:
        return
    }
  }
}
