const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getPlaylistSongsActivityHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
];

module.exports = routes;
