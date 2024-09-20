const { NotPayloadPlaylistSongsSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistSongsValidator = {
  validateSongInPlaylistPayload: (payload) => {
    const validationResult = NotPayloadPlaylistSongsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongsValidator;
