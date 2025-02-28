const idOrIdsValidator = (value) => _.isString(value) || _.every(value, _.isString);

module.exports = {
  inputs: {
    idOrIds: {
      type: 'json',
      custom: idOrIdsValidator,
      required: true,
    },
  },

  async fn(inputs) {
    const criteria = {
      schedulerId: inputs.idOrIds,
    };

    return sails.helpers.schedulerEvents.getMany(criteria);
  },
};
