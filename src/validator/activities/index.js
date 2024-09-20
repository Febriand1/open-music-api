const { NotPayloadActivitiesSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ActivitiesValidator = {
  validateActivityPayload: (payload) => {
    const validationResult = NotPayloadActivitiesSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ActivitiesValidator;
