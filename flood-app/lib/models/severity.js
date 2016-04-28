var proto = {
  getTitle: function (severity, count) {
    var title = count === 1 ? severity.title : severity.pluralisedTitle
    return (count || 'No') + ' ' + title
  }
}

module.exports = Object.create(proto, {
  severeWarning: {
    value: {
      id: 1,
      title: 'Severe Flood Warning',
      pluralisedTitle: 'Severe Flood Warnings',
      hash: 'severe-flood-warnings',
      subTitle: 'severe flooding. Danger to life.',
      tagline: 'Severe flooding',
      description: 'Danger to life'
    },
    enumerable: true
  },
  warning: {
    value: {
      id: 2,
      title: 'Flood Warning',
      pluralisedTitle: 'Flood Warnings',
      hash: 'flood-warnings',
      subTitle: 'flooding is expected. Immediate action required.',
      tagline: 'Flooding is expected',
      description: 'Immediate action required'
    },
    enumerable: true
  },
  alert: {
    value: {
      id: 3,
      title: 'Flood Alert',
      pluralisedTitle: 'Flood Alerts',
      hash: 'flood-alerts',
      subTitle: 'flooding is possible. Be prepared.',
      tagline: 'Flooding is possible',
      description: 'Be prepared'
    },
    enumerable: true
  },
  expired: {
    value: {
      id: 4,
      title: 'Warning no longer in force',
      pluralisedTitle: 'Warnings no longer in force',
      hash: 'warnings-no-longer-in-force',
      subTitle: 'flood warnings and flood alerts removed in the last 24 hours.',
      tagline: 'Flood warnings and flood alerts',
      description: 'Removed in the last 24 hours'
    },
    enumerable: true
  },
  keys: {
    get: function () {
      return Object.keys(this)
    }
  }
})
