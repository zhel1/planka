const valuesValidator = (value) => {
  if (!_.isPlainObject(value)) {
    return false;
  }

  if (!_.isFinite(value.position)) {
    return false;
  }

  if (!_.isPlainObject(value.scheduler)) {
    return false;
  }

  return true;
};

module.exports = {
  inputs: {
    values: {
      type: 'ref',
      custom: valuesValidator,
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  async fn(inputs) {
    const { values } = inputs;

    const labels = await sails.helpers.schedulers.getLabels(values.scheduler.id);

    const { position, repositions } = sails.helpers.utils.insertToPositionables(
      values.position,
      labels,
    );

    repositions.forEach(async ({ id, position: nextPosition }) => {
      await SchedulerLabel.update({
        id,
        schedulerId: values.scheduler.id,
      }).set({
        position: nextPosition,
      });

      sails.sockets.broadcast(`scheduler:${values.scheduler.id}`, 'schedulerLabelUpdate', {
        item: {
          id,
          position: nextPosition,
        },
      });
    });

    const label = await SchedulerLabel.create({
      ...values,
      position,
      schedulerId: values.scheduler.id,
    }).fetch();

    sails.sockets.broadcast(
      `scheduler:${label.schedulerId}`,
      'schedulerLabelCreate',
      {
        item: label,
      },
      inputs.request,
    );

    return label;
  },
};
