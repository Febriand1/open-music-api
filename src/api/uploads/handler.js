const autoBind = require('auto-bind-es5');
const config = require('../../utils/config');

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this.storageService = storageService;
    this.albumsService = albumsService;
    this.validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this.validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this.storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${config.app.host}:${config.app.port}/upload/file/images/${filename}`;

    await this.albumsService.addImage(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Cover berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
