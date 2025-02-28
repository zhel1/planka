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
    const schedulerEvent = await SchedulerEvent.archiveOne(inputs.record.id);

    if (schedulerEvent) {
      sails.sockets.broadcast(
        `scheduler:${schedulerEvent.schedulerId}`,
        'schedulerEventDelete',
        {
          item: schedulerEvent,
        },
        inputs.request,
      );
    }

    return schedulerEvent;
  },
};
