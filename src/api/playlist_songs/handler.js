const autoBind = require('auto-bind-es5');

class PlaylistSongsHandler {
  constructor(playlistsService, playlistSongsService, activitiesService, validator) {
    this.playlistsService = playlistsService;
    this.playlistSongsService = playlistSongsService;
    this.activitiesService = activitiesService;
    this.validator = validator;

    autoBind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    this.validator.validateSongInPlaylistPayload(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this.playlistSongsService.addSongToPlaylist(playlistId, songId);
    await this.activitiesService.addActivity(playlistId, songId, credentialId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsInPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const playlist = await this.playlistSongsService.getSongsInPlaylist(playlistId);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongInPlaylistHandler(request) {
    this.validator.validateSongInPlaylistPayload(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this.playlistSongsService.deleteSongInPlaylist(playlistId, songId);
    await this.activitiesService.addActivity(playlistId, songId, credentialId, 'delete');

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistSongsHandler;
