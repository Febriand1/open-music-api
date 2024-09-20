const joi = require('joi');

const currentYear = new Date().getFullYear();

const NotPayloadAlbumsSchema = joi.object({
  name: joi.string().required(),
  year: joi.number().integer().min(1900).max(currentYear)
    .required(),
});

module.exports = { NotPayloadAlbumsSchema };
