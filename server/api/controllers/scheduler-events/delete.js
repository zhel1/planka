const Errors = {
  NOT_ENOUGH_RIGHTS: {
    notEnoughRights: 'Not enough rights',
  },
  SCHEDULER_EVENT_NOT_FOUND: {
    schedulerEventNotFound: 'Scheduler event not found',
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
    schedulerEventNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    let { schedulerEvent } = await sails.helpers.schedulerEvents
      .getSchedulerPath(inputs.id)
      .intercept('pathNotFound', () => Errors.SCHEDULER_EVENT_NOT_FOUND);

    const schedulerMembership = await SchedulerMembership.findOne({
      schedulerId: schedulerEvent.schedulerId,
      userId: currentUser.id,
    });

    if (!schedulerMembership) {
      throw Errors.SCHEDULER_EVENT_NOT_FOUND; // Forbidden
    }

    if (schedulerMembership.role !== SchedulerMembership.Roles.EDITOR) {
      throw Errors.NOT_ENOUGH_RIGHTS;
    }

    schedulerEvent = await sails.helpers.schedulerEvents.deleteOne.with({
      record: schedulerEvent,
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
