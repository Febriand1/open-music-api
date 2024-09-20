const autoBind = require('auto-bind-es5');

class PlaylistSongsHandler {
  constructor(albumLikesService) {
    this.albumLikesService = albumLikesService;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.albumLikesService.addLike({ userId: credentialId, albumId });

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.albumLikesService.deleteLike({ userId: credentialId, albumId });

    return {
      status: 'success',
      message: 'Berhasil batal menyukai album',
    };
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const responseData = await this.albumLikesService.getLikes(albumId);

    const isFromCache = responseData.fromCache || false;

    const response = h.response({
      status: 'success',
      data: {
        albumId,
        likes: responseData.data.likes,
      },
    });

    if (isFromCache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = PlaylistSongsHandler;
