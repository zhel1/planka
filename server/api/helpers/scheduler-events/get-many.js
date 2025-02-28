const criteriaValidator = (value) => _.isArray(value) || _.isPlainObject(value);

module.exports = {
  inputs: {
    criteria: {
      type: 'json',
      custom: criteriaValidator,
    },
  },

  async fn(inputs) {
    return SchedulerEvent.find(inputs.criteria).sort('startDate');
  },
};
