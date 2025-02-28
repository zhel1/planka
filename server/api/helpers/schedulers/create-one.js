module.exports = {
  inputs: {
    values: {
      type: 'json',
      required: true,
    },
    user: {
      type: 'ref',
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  async fn(inputs) {
    const { values } = inputs;

    const scheduler = await Scheduler.create({ ...values }).fetch();

    const schedulerManager = await SchedulerManager.create({
      schedulerId: scheduler.id,
      userId: inputs.user.id,
    }).fetch();

    sails.sockets.broadcast(
      `user:${schedulerManager.userId}`,
      'schedulerCreate',
      {
        item: scheduler,
      },
      inputs.request,
    );

    return {
      scheduler,
      schedulerManager,
    };
  },
};
