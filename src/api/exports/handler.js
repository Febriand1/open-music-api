const autoBind = require('auto-bind-es5');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this.producerService = producerService;
    this.playlistsService = playlistsService;
    this.validator = validator;

    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this.validator.validateExportPlaylistsPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const message = {
      userId: credentialId,
      targetEmail: request.payload.targetEmail,
    };

    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this.producerService.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
