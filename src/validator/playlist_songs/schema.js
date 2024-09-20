const joi = require('joi');

const NotPayloadPlaylistSongsSchema = joi.object({
  playlistId: joi.string(),
  songId: joi.string().required(),
});

module.exports = { NotPayloadPlaylistSongsSchema };
