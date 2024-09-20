const autoBind = require('auto-bind-es5');

class ActivitiesHandler {
  constructor(activitiesService, playlistsService, validator) {
    this.activitiesService = activitiesService;
    this.playlistsService = playlistsService;
    this.validator = validator;

    autoBind(this);
  }

  async getPlaylistSongsActivityHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const activities = await this.activitiesService.getActivities(playlistId);
    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = ActivitiesHandler;
