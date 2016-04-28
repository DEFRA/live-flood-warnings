var util = require('../util')

function Station (data) {
  this.id = data.rloi_id
  this.qualifier = data.qualifier.toLowerCase()
  this.direction = this.qualifier === 'd' ? 'downstream' : 'upstream'
  this.isDownstream = this.qualifier === 'd'
  this.isUpstream = this.qualifier === 'u'
  this.name = data.external_name
  this.river = data.wiski_river_name
  this.type = data.station_type.toLowerCase()
  this.status = data.status.toLowerCase()
  this.statusDate = data.status_date
  this.region = data.region
  this.catchment = data.catchment
  this.percentile5 = util.toFixed(data.percentile_5, 2)
  this.percentile95 = util.toFixed(data.percentile_95, 2)
  this.stageDatum = util.toFixed(data.stage_datum, 2)
  this.porMinValue = util.toFixed(data.por_min_value, 2)
  this.porMinDate = data.date_por_min
  this.porMaxValue = util.toFixed(data.por_max_value, 2)
  this.porMaxDate = data.date_por_max
  this.coordinates = data.coordinates
  this.isWales = data.iswales
  this.isMulti = this.type === 'm'
  this.isSingle = this.type === 's'
  this.isCoastal = this.type === 'c'
  this.isGroundwater = this.type === 'g'
  this.isClosed = this.status === 'closed'
  this.isActive = this.status === 'active'
  this.isSuspended = this.status === 'suspended'
  this.isUkCmf = this.status === 'ukcmf'
}

module.exports = Station
