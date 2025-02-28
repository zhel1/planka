const valuesValidator = (value) => {
  if (!_.isPlainObject(value)) {
    return false;
  }

  if (!_.isPlainObject(value.scheduler)) {
    return false;
  }

  if (!_.isPlainObject(value.user)) {
    return false;
  }

  return true;
};

module.exports = {
  inputs: {
    values: {
      type: 'ref',
      custom: valuesValidator,
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  exits: {
    userAlreadySchedulerManager: {},
  },

  async fn(inputs) {
    const { values } = inputs;

    const schedulerManager = await SchedulerManager.create({
      schedulerId: values.scheduler.id,
      userId: values.user.id,
    })
      .intercept('E_UNIQUE', 'userAlreadySchedulerManager')
      .fetch();

    const schedulerRelatedUserIds = await sails.helpers.schedulers.getManagerAndMemberUserIds(
      schedulerManager.schedulerId,
    );

    schedulerRelatedUserIds.forEach((userId) => {
      sails.sockets.broadcast(
        `user:${userId}`,
        'schedulerManagerCreate',
        {
          item: schedulerManager,
        },
        inputs.request,
      );
    });

    return schedulerManager;
  },
};
