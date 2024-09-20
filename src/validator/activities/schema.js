const joi = require('joi');

const time = new Date().toISOString();

const NotPayloadActivitiesSchema = joi.object({
  playlistId: joi.string().required(),
  songId: joi.string().required(),
  userId: joi.string().required(),
  action: joi.string().required(),
  time: joi.string().default(time),
});

module.exports = { NotPayloadActivitiesSchema };
