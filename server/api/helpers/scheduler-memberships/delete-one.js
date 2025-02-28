const { v4: uuid } = require('uuid');

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

    const schedulerMembership = await SchedulerMembership.destroyOne(inputs.record.id);

    if (schedulerMembership) {
      const notify = (room) => {
        sails.sockets.broadcast(
          room,
          'schedulerMembershipDelete',
          {
            item: schedulerMembership,
          },
          inputs.request,
        );
      };

      const isSchedulerManager = await sails.helpers.users.isSchedulerManager(
        inputs.record.userId,
        inputs.record.schedulerId,
      );

      if (!isSchedulerManager) {
        sails.sockets.removeRoomMembersFromRooms(
          `@user:${schedulerMembership.userId}`,
          `scheduler:${schedulerMembership.schedulerId}`,
          () => {
            notify(`scheduler:${schedulerMembership.schedulerId}`);
          },
        );
      }

      schedulerRelatedUserIds.push(schedulerMembership.userId);

      schedulerRelatedUserIds.forEach((userId) => {
        notify(`user:${userId}`);
      });

      if (isSchedulerManager) {
        const tempRoom = uuid();

        sails.sockets.addRoomMembersToRooms(
          `scheduler:${schedulerMembership.schedulerId}`,
          tempRoom,
          () => {
            sails.sockets.removeRoomMembersFromRooms(
              `user:${schedulerMembership.userId}`,
              tempRoom,
              () => {
                notify(tempRoom);
                sails.sockets.removeRoomMembersFromRooms(tempRoom, tempRoom);
              },
            );
          },
        );
      }
    }

    return schedulerMembership;
  },
};
