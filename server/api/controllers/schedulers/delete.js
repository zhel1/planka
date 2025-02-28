const Errors = {
  SCHEDULER_NOT_FOUND: {
    schedulerNotFound: 'Scheduler not found',
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
    schedulerNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    let scheduler = await Scheduler.findOne(inputs.id);

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

    scheduler = await sails.helpers.schedulers.deleteOne.with({
      record: scheduler,
      request: this.req,
    });

    if (!scheduler) {
      throw Errors.SCHEDULER_NOT_FOUND;
    }

    return {
      item: scheduler,
    };
  },
};
