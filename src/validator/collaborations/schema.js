const joi = require('joi');

const NotPayloadPlaylistCollaborationsSchema = joi.object({
  playlistId: joi.string().required(),
  userId: joi.string().required(),
});

module.exports = { NotPayloadPlaylistCollaborationsSchema };
