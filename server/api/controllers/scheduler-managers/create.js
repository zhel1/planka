const Errors = {
  SCHEDULER_NOT_FOUND: {
    schedulerNotFound: 'Scheduler not found',
  },
  USER_NOT_FOUND: {
    userNotFound: 'User not found',
  },
  USER_ALREADY_SCHEDULER_MANAGER: {
    userAlreadySchedulerManager: 'User already scheduler manager',
  },
};

module.exports = {
  inputs: {
    schedulerId: {
      type: 'string',
      regex: /^[0-9]+$/,
      required: true,
    },
    userId: {
      type: 'string',
      regex: /^[0-9]+$/,
      required: true,
    },
  },

  exits: {
    schedulerNotFound: {
      responseType: 'notFound',
    },
    userNotFound: {
      responseType: 'notFound',
    },
    userAlreadySchedulerManager: {
      responseType: 'conflict',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const scheduler = await Scheduler.findOne(inputs.schedulerId);

    if (!scheduler) {
      throw Errors.SCHEDULER_NOT_FOUND;
    }

    const isSchedulerManager = await sails.helpers.users.isSchedulerManager(
      currentUser.id,
      scheduler.id,
    );

    if (!isSchedulerManager) {
      throw Errors.SCHEDULER_NOT_FOUND; // Forbidden
    }

    const user = await sails.helpers.users.getOne(inputs.userId);

    if (!user) {
      throw Error.USER_NOT_FOUND;
    }

    const schedulerManager = await sails.helpers.schedulerManagers.createOne
      .with({
        values: {
          scheduler,
          user,
        },
        request: this.req,
      })
      .intercept('userAlreadySchedulerManager', () => Errors.USER_ALREADY_SCHEDULER_MANAGER);

    return {
      item: schedulerManager,
    };
  },
};
