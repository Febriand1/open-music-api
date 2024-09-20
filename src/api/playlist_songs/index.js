const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {
    playlistsService,
    playlistSongsService,
    activitiesService,
    validator,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistsService,
      playlistSongsService,
      activitiesService,
      validator,
    );
    server.route(routes(playlistSongsHandler));
  },
};
