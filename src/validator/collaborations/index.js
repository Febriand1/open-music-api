const { NotPayloadPlaylistCollaborationsSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistCollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const validationResult = NotPayloadPlaylistCollaborationsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistCollaborationsValidator;
