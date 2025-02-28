module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    schedulerId: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const schedulerManager = await SchedulerManager.findOne({
      schedulerId: inputs.schedulerId,
      userId: inputs.id,
    });

    return !!schedulerManager;
  },
};
