var Joi = require('joi')

var serverSchema = Joi.object().required().keys({
  host: Joi.string().hostname().required(),
  port: Joi.number().required()
})

var databaseSchema = Joi.object().required().keys({
  connectionString: Joi.string().required()
})

module.exports = {
  server: serverSchema,
  logging: Joi.object(),
  database: databaseSchema
}
