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
    const scheduler = await Scheduler.findOne(inputs.id);

    if (!scheduler) {
      throw Errors.SCHEDULER_NOT_FOUND;
    }

    const schedulerMemberships = await sails.helpers.schedulerMemberships.getMany({
      schedulerId: scheduler.id,
    });

    const schedulerManagers = await sails.helpers.schedulers.getSchedulerManagers(scheduler.id);

    const schedulerLabels = await sails.helpers.schedulers.getLabels(scheduler.id);

    const schedulerEvents = await sails.helpers.schedulers.getEvents(scheduler.id);

    const userIds = sails.helpers.utils.mapRecords(schedulerManagers, 'userId');
    const users = await sails.helpers.users.getMany(userIds);

    if (this.req.isSocket) {
      sails.sockets.join(this.req, `scheduler:${scheduler.id}`);
    }

    return {
      item: scheduler,
      included: {
        users,
        schedulerManagers,
        schedulerMemberships,
        schedulerLabels,
        schedulerEvents,
      },
    };
  },
};
