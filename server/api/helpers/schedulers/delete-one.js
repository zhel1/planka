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
    const schedulerManagers = await SchedulerManager.destroy({
      schedulerId: inputs.record.id,
    }).fetch();

    const schedulerMemberships = await SchedulerMembership.destroy({
      schedulerId: inputs.record.id,
    }).fetch();

    const scheduler = await Scheduler.archiveOne(inputs.record.id);

    if (scheduler) {
      const schedulerManagerUserIds = sails.helpers.utils.mapRecords(schedulerManagers, 'userId');
      const schedulerMemberUserIds = sails.helpers.utils.mapRecords(schedulerMemberships, 'userId');

      // TODO* add scheduler members to related users
      // const schedulerMemberUserIds = await sails.helpers.schedulers.getMemberUserIds(schedulerIds);
      const schedulerRelatedUserIds = _.union(schedulerManagerUserIds, schedulerMemberUserIds);

      const schedulerRooms = schedulerRelatedUserIds.map(
        (schedulerManagerUserId) => `scheduler:${schedulerManagerUserId}`,
      );

      schedulerRelatedUserIds.forEach((userId) => {
        sails.sockets.removeRoomMembersFromRooms(`@user:${userId}`, schedulerRooms);

        sails.sockets.broadcast(
          `user:${userId}`,
          'schedulerDelete',
          {
            item: scheduler,
          },
          inputs.request,
        );
      });
    }

    return scheduler;
  },
};
