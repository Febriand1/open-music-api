const joi = require('joi');

const currentYear = new Date().getFullYear();

const NotPayloadSongsSchema = joi.object({
  title: joi.string().required(),
  year: joi.number().integer().min(1900).max(currentYear)
    .required(),
  genre: joi.string().required(),
  performer: joi.string().required(),
  duration: joi.number(),
  albumId: joi.string(),
});

module.exports = { NotPayloadSongsSchema };
