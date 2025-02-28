module.exports = {
  inputs: {
    criteria: {
      type: 'json',
      required: true,
    },
  },

  exits: {
    pathNotFound: {},
  },

  async fn(inputs) {
    const schedulerEvent = await SchedulerEvent.findOne(inputs.criteria);

    if (!schedulerEvent) {
      throw 'pathNotFound';
    }

    const scheduler = await Scheduler.findOne(schedulerEvent.schedulerId);

    if (!scheduler) {
      throw {
        pathNotFound: {
          schedulerEvent,
        },
      };
    }

    return {
      schedulerEvent,
      scheduler,
    };
  },
};
