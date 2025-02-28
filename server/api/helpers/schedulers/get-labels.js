const idOrIdsValidator = (value) => _.isString(value) || _.every(value, _.isString);

module.exports = {
  inputs: {
    idOrIds: {
      type: 'json',
      custom: idOrIdsValidator,
      required: true,
    },
    exceptSchedulerLabelIdOrIds: {
      type: 'json',
      custom: idOrIdsValidator,
    },
  },

  async fn(inputs) {
    const criteria = {
      schedulerId: inputs.idOrIds,
    };

    if (!_.isUndefined(inputs.exceptSchedulerLabelIdOrIds)) {
      criteria.id = {
        '!=': inputs.exceptSchedulerLabelIdOrIds,
      };
    }

    return sails.helpers.schedulerLabels.getMany(criteria);
  },
};
