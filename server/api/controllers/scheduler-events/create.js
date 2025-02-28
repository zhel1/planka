const Errors = {
  NOT_ENOUGH_RIGHTS: {
    notEnoughRights: 'Not enough rights',
  },
  SCHEDULER_NOT_FOUND: {
    schedulerNotFound: 'Scheduler not found',
  },
};

// const dateValidator = (value) => moment(value, moment.ISO_8601, true).isValid();

module.exports = {
  inputs: {
    name: {
      type: 'string',
      isNotEmptyString: true,
    },
    description: {
      type: 'string',
      isNotEmptyString: true,
      allowNull: true,
    },
    schedulerId: {
      type: 'string',
      regex: /^[0-9]+$/,
    },
    creatorUserId: {
      type: 'string',
      regex: /^[0-9]+$/,
    },
    schedulerLabelId: {
      type: 'string',
      regex: /^[0-9]+$/,
    },
    startDate: {
      type: 'string',
      // custom: dateValidator,
      allowNull: false,
    },
    untilDate: {
      type: 'string',
      // custom: dateValidator,
      allowNull: true,
    },
    isAllDay: {
      type: 'boolean',
    },
    isRecurring: {
      type: 'boolean',
    },
    duration: {
      type: 'number',
    },
    recurrencePattern: {
      type: 'string',
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

    const values = _.pick(inputs, [
      'schedulerId',
      'name',
      'description',
      'startDate',
      'untilDate',
      'isAllDay',
      'isRecurring',
      'duration',
      'recurrencePattern',
      'schedulerLabelId',
      'creatorUserId',
    ]);

    const card = await sails.helpers.schedulerEvents.createOne.with({
      values: {
        ...values,
        creatorUser: currentUser,
      },
      request: this.req,
    });

    return {
      item: card,
    };
  },
};
