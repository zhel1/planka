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

  // async fn(inputs) {
  //   const schedulerLabel = await SchedulerLabel.findOne(inputs.criteria);
  //
  //   if (!schedulerLabel) {
  //     throw 'pathNotFound';
  //   }
  //
  //   const path = await sails.helpers.schedulers
  //     .getSchedulerPath(schedulerLabel.schedulerId)
  //     .intercept('pathNotFound', (nodes) => ({
  //       pathNotFound: {
  //         schedulerLabel,
  //         ...nodes,
  //       },
  //     }));
  //
  //   return {
  //     schedulerLabel,
  //     ...path,
  //   };
  // },

  async fn(inputs) {
    const schedulerLabel = await SchedulerLabel.findOne(inputs.criteria);

    if (!schedulerLabel) {
      throw 'pathNotFound';
    }

    const scheduler = await Scheduler.findOne(schedulerLabel.schedulerId);

    if (!scheduler) {
      throw {
        pathNotFound: {
          scheduler,
        },
      };
    }

    return {
      schedulerLabel,
      scheduler,
    };
  },
};
