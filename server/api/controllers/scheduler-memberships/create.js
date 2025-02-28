const Errors = {
  SCHEDULER_NOT_FOUND: {
    schedulerNotFound: 'Scheduler not found',
  },
  USER_NOT_FOUND: {
    userNotFound: 'User not found',
  },
  USER_ALREADY_SCHEDULER_MEMBER: {
    userAlreadySchedulerMember: 'User already scheduler member',
  },
};

module.exports = {
  inputs: {
    schedulerId: {
      type: 'string',
      regex: /^[0-9]+$/,
      required: true,
    },
    userId: {
      type: 'string',
      regex: /^[0-9]+$/,
      required: true,
    },
    role: {
      type: 'string',
      isIn: Object.values(SchedulerMembership.Roles),
      required: true,
    },
    canComment: {
      type: 'boolean',
      allowNull: true,
    },
  },

  exits: {
    schedulerNotFound: {
      responseType: 'notFound',
    },
    userNotFound: {
      responseType: 'notFound',
    },
    userAlreadySchedulerMember: {
      responseType: 'conflict',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const scheduler = await Scheduler.findOne(inputs.schedulerId);

    if (!scheduler) {
      throw Errors.SCHEDULER_NOT_FOUND;
    }

    const isSchedulerManager = await sails.helpers.users.isSchedulerManager(
      currentUser.id,
      scheduler.id,
    );

    if (!isSchedulerManager) {
      throw Errors.SCHEDULER_NOT_FOUND; // Forbidden
    }

    const user = await sails.helpers.users.getOne(inputs.userId);

    if (!user) {
      throw Error.USER_NOT_FOUND;
    }

    const values = _.pick(inputs, ['role', 'canComment']);

    const schedulerMembership = await sails.helpers.schedulerMemberships.createOne
      .with({
        values: {
          ...values,
          scheduler,
          user,
        },
        request: this.req,
      })
      .intercept('userAlreadySchedulerMember', () => Errors.USER_ALREADY_SCHEDULER_MEMBER);

    return {
      item: schedulerMembership,
    };
  },
};
