var Joi = require('joi')

var serverSchema = Joi.object().required().keys({
  host: Joi.string().hostname().required(),
  port: Joi.number().required()
})

var serviceSchema = Joi.object().required().keys({
  protocol: Joi.string().required().allow(['http', 'https']),
  host: Joi.string().hostname().required(),
  port: Joi.number().required()
})

var bingSchema = Joi.object().required().keys({
  key: Joi.string().required(),
  url: Joi.string().uri().required(),
  urlReverse: Joi.string().required()
})

module.exports = {
  server: serverSchema,
  service: serviceSchema,
  geoserver: serviceSchema,
  bing: bingSchema,
  logging: Joi.object(),
  httpTimeoutMs: Joi.number().required().min(0).max(30000),
  pageRefreshTime: Joi.number().required().min(0).max(3600),
  cacheExpiry: Joi.number().required().min(90000).max(9000000),
  provisionalPorMaxValueDays: Joi.number().required().min(0).max(365),
  mockExternalHttp: Joi.boolean().required(),
  cacheViews: Joi.boolean().required(),
  analyticsAccount: Joi.string().required().allow(''),
  maxNotificationAge: Joi.number().required(),
  notificationsPollInterval: Joi.number().required().min(1000)
}
