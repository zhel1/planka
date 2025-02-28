const valuesValidator = (value) => {
  if (!_.isPlainObject(value)) {
    return false;
  }

  if (!_.isUndefined(value.position) && !_.isFinite(value.position)) {
    return false;
  }

  return true;
};

module.exports = {
  inputs: {
    record: {
      type: 'ref',
      required: true,
    },
    values: {
      type: 'json',
      custom: valuesValidator,
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  async fn(inputs) {
    const { values } = inputs;

    if (!_.isUndefined(values.position)) {
      const labels = await sails.helpers.schedulers.getLabels(
        inputs.record.schedulerId,
        inputs.record.id,
      );

      const { position, repositions } = sails.helpers.utils.insertToPositionables(
        values.position,
        labels,
      );

      values.position = position;

      repositions.forEach(async ({ id, position: nextPosition }) => {
        await SchedulerLabel.update({
          id,
          schedulerId: inputs.record.schedulerId,
        }).set({
          position: nextPosition,
        });

        sails.sockets.broadcast(`scheduler:${inputs.record.schedulerId}`, 'schedulerLabelUpdate', {
          item: {
            id,
            position: nextPosition,
          },
        });
      });
    }

    const label = await SchedulerLabel.updateOne(inputs.record.id).set({ ...values });

    if (label) {
      sails.sockets.broadcast(
        `scheduler:${label.schedulerId}`,
        'schedulerLabelUpdate',
        {
          item: label,
        },
        inputs.request,
      );
    }

    return label;
  },
};
