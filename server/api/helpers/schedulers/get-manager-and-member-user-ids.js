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
    const schedulerManagerUserIds = await sails.helpers.schedulers.getManagerUserIds(
      inputs.idOrIds,
    );
    // const memberUserIds = await sails.helpers.schedulers.getMemberUserIds(inputs.idOrIds);

    return _.union(schedulerManagerUserIds /* , boardMemberUserIds */); // TODO* add members also
  },
};
