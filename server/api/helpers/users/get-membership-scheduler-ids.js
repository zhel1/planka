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
    const schedulerMemberships = await sails.helpers.users.getSchedulerMemberships(inputs.idOrIds);

    return sails.helpers.utils.mapRecords(
      schedulerMemberships,
      'schedulerId',
      _.isArray(inputs.idOrIds),
    );
  },
};
