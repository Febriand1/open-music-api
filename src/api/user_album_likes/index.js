const AlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumLikes',
  version: '1.0.0',
  register: async (server, {
    albumLikesService,
    // validator,
  }) => {
    const albumLikesHandler = new AlbumLikesHandler(
      albumLikesService,
    //   validator,
    );
    server.route(routes(albumLikesHandler));
  },
};
