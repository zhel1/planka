const Errors = {
  NOT_ENOUGH_RIGHTS: {
    notEnoughRights: 'Not enough rights',
  },
  SCHEDULER_EVENT_NOT_FOUND: {
    schedulerEventNotFound: 'Scheduler event not found',
  },
  SCHEDULER_NOT_FOUND: {
    schedulerNotFound: 'Scheduler not found',
  },
};

// const dateValidator = (value) => moment(value, moment.ISO_8601, true).isValid();  // TODO* do we need it?

module.exports = {
  inputs: {
    id: {
      type: 'string',
      regex: /^[0-9]+$/,
      required: true,
    },
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
    schedulerEventNotFound: {
      responseType: 'notFound',
    },
    schedulerNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    // eslint-disable-next-line prefer-const
    let { schedulerEvent, scheduler } = await sails.helpers.schedulerEvents
      .getSchedulerPath(inputs.id)
      .intercept('pathNotFound', () => Errors.SCHEDULER_EVENT_NOT_FOUND);

    // let { card } = path;
    // const { list, board } = path;

    let schedulerMembership = await SchedulerMembership.findOne({
      schedulerId: scheduler.id,
      userId: currentUser.id,
    });

    if (!schedulerMembership) {
      throw Errors.SCHEDULER_EVENT_NOT_FOUND; // Forbidden
    }

    if (schedulerMembership.role !== SchedulerMembership.Roles.EDITOR) {
      throw Errors.NOT_ENOUGH_RIGHTS;
    }

    let nextScheduler;
    if (!_.isUndefined(inputs.schedulerId)) {
      nextScheduler = await Scheduler.findOne({
        id: inputs.schedulerId,
      });

      schedulerMembership = await SchedulerMembership.findOne({
        schedulerId: inputs.schedulerId,
        userId: currentUser.id,
      });

      if (!schedulerMembership) {
        throw Errors.SCHEDULER_NOT_FOUND; // Forbidden
      }

      if (schedulerMembership.role !== SchedulerMembership.Roles.EDITOR) {
        throw Errors.NOT_ENOUGH_RIGHTS;
      }
    }

    const values = _.pick(inputs, [
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

    schedulerEvent = await sails.helpers.schedulerEvents.updateOne.with({
      scheduler,
      record: schedulerEvent,
      values: {
        ...values,
        scheduler: nextScheduler,
      },
      user: currentUser,
      request: this.req,
    });

    if (!schedulerEvent) {
      throw Errors.SCHEDULER_EVENT_NOT_FOUND;
    }

    return {
      item: schedulerEvent,
    };
  },
};
