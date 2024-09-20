const autoBind = require('auto-bind-es5');

class UsersHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this.validator.validateUserPayload(request.payload);

    const userId = await this.service.addUser(request.payload);

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
