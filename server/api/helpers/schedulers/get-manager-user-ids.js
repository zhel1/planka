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
    const schedulerManagers = await sails.helpers.schedulers.getSchedulerManagers(inputs.idOrIds);

    return sails.helpers.utils.mapRecords(schedulerManagers, 'userId', _.isArray(inputs.idOrIds));
  },
};
