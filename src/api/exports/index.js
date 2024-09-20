const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exportPlaylists',
  version: '1.0.0',
  register: async (server, { ProducerService, playlistsService, validator }) => {
    const exportsHandler = new ExportsHandler(ProducerService, playlistsService, validator);
    server.route(routes(exportsHandler));
  },
};
