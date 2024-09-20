const joi = require('joi');

const NotPayloadPlaylistsSchema = joi.object({
  name: joi.string().required(),
  owner: joi.string(),
});

module.exports = { NotPayloadPlaylistsSchema };
