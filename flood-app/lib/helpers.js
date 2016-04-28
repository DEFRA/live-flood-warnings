var util = require('./util')

function formatDate (value, format) {
  if (typeof format === 'string') {
    return util.formatDate(value, format)
  } else {
    return util.formatDate(value)
  }
}

module.exports = {
  formatDate: formatDate
}
