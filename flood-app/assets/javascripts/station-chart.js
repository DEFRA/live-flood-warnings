/* global $ */
/* global google */

function StationChart (options) {
  var values = []

  var highestLabel = (function () {
    if (options.station.isCoastal) {
      return 'Highest astronomical tide prediction ' + options.station.porMaxValue + 'm'
    } else if (options.station.isGroundwater) {
      return 'Highest recorded groundwater level ' + options.station.porMaxValue + 'm'
    } else {
      return 'Highest recorded level ' + options.station.porMaxValue + 'm on ' + options.station.formattedPorMaxDate
    }
  }())

  $('table tr').each(function (i, v) {
    values[i] = []
    $(this).children('td').each(function (ii, vv) {
      if (ii !== 2) {
        if (ii === 0) {
          // timestamp
          values[i][ii] = new Date($(this).html())
        } else {
          // value
          values[i][ii] = parseFloat($(this).html())
        }
      }
    })
    // constants
    values[i][2] = options.station.percentile5
    values[i][3] = options.station.percentile5 ? 'Flooding is possible over ' + options.station.percentile5 + 'm' : undefined
    values[i][4] = options.station.porMaxValue
    values[i][5] = highestLabel
  })

  // Set up the columns
  values[0] = [{
    label: 'Timestamp',
    id: 'ts',
    type: 'datetime'
  }, {
    label: 'Value',
    id: 'val',
    type: 'number'
  }, {
    label: 'Flooding is possible over ' + options.station.percentile5 + 'm',
    id: 'percentile5',
    type: 'number'
  }, {
    type: 'string',
    role: 'tooltip'
  }, {
    label: highestLabel,
    id: 'porMaxValue',
    type: 'number'
  }, {
    type: 'string',
    role: 'tooltip'
  }]

  var data = google.visualization.arrayToDataTable(values)

  var chartOptions = {
    height: 400,
    fontName: 'nta',
    chartArea: {
      width: '88%',
      left: '8%',
      top: '8%'
    },
    legend: {
      position: 'bottom',
      alignment: 'start',
      maxLines: 3,
      textStyle: {
      }
    },
    hAxis: {
      gridlines: {
        count: -1
      },
      allowContainerBoundaryTextCutoff: false,
      textStyle: {
        bold: true
      }
    },
    vAxis: {
      title: 'Metres',
      baseline: options.station.isCoastal ? Math.floor(data.getColumnRange(1).min) : 'automatic',
      gridlines: {
        count: options.station.isCoastal ? -1 : 5
      },
      textStyle: {
        bold: true
      },
      titleTextStyle: {
        italic: false,
        bold: true
      }
    },
    series: {
      0: {
        type: 'area',
        color: '#238BC6',
        visibleInLegend: false
      },
      1: {
        type: 'line',
        color: '#EC7A21',
        lineWidth: 5,
        lineDashStyle: [10, 10],
        visibleInLegend: !!options.station.percentile5
      },
      2: {
        type: 'line',
        color: '#000000',
        lineWidth: 5,
        visibleInLegend: !!options.station.porMaxValue
      }
    }
  }

  var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'))

  var dateRange = new google.visualization.ControlWrapper({
    controlType: 'ChartRangeFilter',
    containerId: 'controls',
    options: {
      filterColumnIndex: 0,
      filterColumnLabel: 'date and time',
      ui: {
        chartOptions: {
          height: 50,
          fontName: 'nta',
          chartArea: {
            width: '88%',
            left: '8%'
          }
        },
        chartView: {
          columns: [0, 1]
        }
      }
    }
  })

  var chart = new google.visualization.ChartWrapper({
    'chartType': 'ComboChart',
    'containerId': 'station-chart',
    options: chartOptions
  })
  dashboard.bind(dateRange, chart)
  dashboard.draw(data)
}

module.exports = StationChart
