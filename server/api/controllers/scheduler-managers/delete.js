const Errors = {
  SCHEDULER_MANAGER_NOT_FOUND: {
    schedulerManagerNotFound: 'Scheduler manager not found',
  },
};

module.exports = {
  inputs: {
    id: {
      type: 'string',
      regex: /^[0-9]+$/,
      required: true,
    },
  },

  exits: {
    schedulerManagerNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    let schedulerManager = await SchedulerManager.findOne(inputs.id);

    if (!schedulerManager) {
      throw Errors.SCHEDULER_MANAGER_NOT_FOUND;
    }

    const isSchedulerManager = await sails.helpers.users.isSchedulerManager(
      currentUser.id,
      schedulerManager.schedulerId,
    );

    if (!isSchedulerManager) {
      throw Errors.SCHEDULER_MANAGER_NOT_FOUND; // Forbidden
    }

    // TODO: check if the last one
    schedulerManager = await sails.helpers.schedulerManagers.deleteOne.with({
      record: schedulerManager,
      request: this.req,
    });

    if (!schedulerManager) {
      throw Errors.SCHEDULER_MANAGER_NOT_FOUND;
    }

    return {
      item: schedulerManager,
    };
  },
};
