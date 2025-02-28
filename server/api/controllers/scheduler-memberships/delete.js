const Errors = {
  SCHEDULER_MEMBERSHIP_NOT_FOUND: {
    schedulerMembershipNotFound: 'Scheduler membership not found',
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
    schedulerMembershipNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    let schedulerMembership = await SchedulerMembership.findOne(inputs.id);

    if (!schedulerMembership) {
      throw Errors.SCHEDULER_MEMBERSHIP_NOT_FOUND;
    }

    const isSchedulerManager = await sails.helpers.users.isSchedulerManager(
      currentUser.id,
      schedulerMembership.schedulerId,
    );

    if (!isSchedulerManager) {
      throw Errors.SCHEDULER_MEMBERSHIP_NOT_FOUND; // Forbidden
    }

    // TODO: check if the last one
    schedulerMembership = await sails.helpers.schedulerMemberships.deleteOne.with({
      record: schedulerMembership,
      request: this.req,
    });

    if (!schedulerMembership) {
      throw Errors.SCHEDULER_MEMBERSHIP_NOT_FOUND;
    }

    return {
      item: schedulerMembership,
    };
  },
};
