module.exports = {
  inputs: {
    record: {
      type: 'ref',
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  async fn(inputs) {
    const schedulerRelatedUserIds = await sails.helpers.schedulers.getManagerAndMemberUserIds(
      inputs.record.schedulerId,
    );

    const schedulerManager = await SchedulerManager.destroyOne(inputs.record.id);

    if (schedulerManager) {
      schedulerRelatedUserIds.forEach((userId) => {
        sails.sockets.broadcast(
          `user:${userId}`,
          'schedulerManagerDelete',
          {
            item: schedulerManager,
          },
          inputs.request,
        );
      });
    }

    return schedulerManager;
  },
};
