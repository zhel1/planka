module.exports = {
  inputs: {
    name: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const values = _.pick(inputs, ['name']);

    const { scheduler, schedulerManager } = await sails.helpers.schedulers.createOne.with({
      values,
      user: currentUser,
      request: this.req,
    });

    return {
      item: scheduler,
      included: {
        schedulerManagers: [schedulerManager],
      },
    };
  },
};
