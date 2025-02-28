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
    // remove all events with this label
    await SchedulerEvent.archive({
      schedulerLabelId: inputs.record.id,
    });

    const label = await SchedulerLabel.archiveOne(inputs.record.id);

    if (label) {
      sails.sockets.broadcast(
        `scheduler:${label.schedulerId}`,
        'schedulerLabelDelete',
        {
          item: label,
        },
        inputs.request,
      );
    }

    return label;
  },
};
