const Errors = {
  NOT_ENOUGH_RIGHTS: {
    notEnoughRights: 'Not enough rights',
  },
  SCHEDULER_NOT_FOUND: {
    schedulerNotFound: 'Scheduler not found',
  },
};

module.exports = {
  inputs: {
    schedulerId: {
      type: 'string',
      regex: /^[0-9]+$/,
      required: true,
    },
    position: {
      type: 'number',
      required: true,
    },
    name: {
      type: 'string',
      isNotEmptyString: true,
      allowNull: true,
    },
    color: {
      type: 'string',
      isIn: SchedulerLabel.COLORS,
      required: true,
    },
  },

  exits: {
    notEnoughRights: {
      responseType: 'forbidden',
    },
    schedulerNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const scheduler = await Scheduler.findOne(inputs.schedulerId);

    if (!scheduler) {
      throw Errors.SCHEDULER_NOT_FOUND;
    }

    const schedulerMembership = await SchedulerMembership.findOne({
      schedulerId: inputs.schedulerId,
      userId: currentUser.id,
    });

    if (!schedulerMembership) {
      throw Errors.SCHEDULER_NOT_FOUND; // Forbidden
    }

    if (schedulerMembership.role !== SchedulerMembership.Roles.EDITOR) {
      throw Errors.NOT_ENOUGH_RIGHTS;
    }

    const values = _.pick(inputs, ['position', 'name', 'color']);

    const label = await sails.helpers.schedulerLabels.createOne.with({
      values: {
        ...values,
        scheduler,
      },
      request: this.req,
    });

    return {
      item: label,
    };
  },
};
