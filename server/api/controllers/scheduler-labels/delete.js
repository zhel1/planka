const Errors = {
  NOT_ENOUGH_RIGHTS: {
    notEnoughRights: 'Not enough rights',
  },
  SCHEDULER_LABEL_NOT_FOUND: {
    schedulerLabelNotFound: 'Scheduler label not found',
  },
};

module.exports = {
  inputs: {
    id: {
      type: 'string',
      regex: /^[0-9]+$/,
      required: true,
    },
  },

  exits: {
    notEnoughRights: {
      responseType: 'forbidden',
    },
    labelNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    let { schedulerLabel } = await sails.helpers.schedulerLabels
      .getSchedulerPath(inputs.id)
      .intercept('pathNotFound', () => Errors.SCHEDULER_LABEL_NOT_FOUND);

    const schedulerMembership = await SchedulerMembership.findOne({
      schedulerId: schedulerLabel.schedulerId,
      userId: currentUser.id,
    });

    if (!schedulerMembership) {
      throw Errors.SCHEDULER_LABEL_NOT_FOUND; // Forbidden
    }

    if (schedulerMembership.role !== SchedulerMembership.Roles.EDITOR) {
      throw Errors.NOT_ENOUGH_RIGHTS;
    }

    schedulerLabel = await sails.helpers.schedulerLabels.deleteOne.with({
      record: schedulerLabel,
      request: this.req,
    });

    if (!schedulerLabel) {
      throw Errors.SCHEDULER_LABEL_NOT_FOUND;
    }

    return {
      item: schedulerLabel,
    };
  },
};
