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
    role: {
      type: 'string',
      isIn: Object.values(SchedulerMembership.Roles),
    },
    canComment: {
      type: 'boolean',
      allowNull: true,
    },
  },

  exits: {
    schedulerMembershipNotFound: {
      responseType: 'notFound',
    },
  },

  // async fn(inputs) {
  //   const { currentUser } = this.req;
  //
  //   const path = await sails.helpers.boardMemberships
  //     .getProjectPath(inputs.id)
  //     .intercept('pathNotFound', () => Errors.BOARD_MEMBERSHIP_NOT_FOUND);
  //
  //   let { boardMembership } = path;
  //   const { project } = path;
  //
  //   const isProjectManager = await sails.helpers.users.isProjectManager(currentUser.id, project.id);
  //
  //   if (!isProjectManager) {
  //     throw Errors.BOARD_MEMBERSHIP_NOT_FOUND; // Forbidden
  //   }
  //
  //   const values = _.pick(inputs, ['role', 'canComment']);
  //
  //   boardMembership = await sails.helpers.boardMemberships.updateOne.with({
  //     values,
  //     record: boardMembership,
  //     request: this.req,
  //   });
  //
  //   return {
  //     item: boardMembership,
  //   };
  // },

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

    const values = _.pick(inputs, ['role', 'canComment']);

    schedulerMembership = await sails.helpers.schedulerMemberships.updateOne.with({
      values,
      record: schedulerMembership,
      request: this.req,
    });

    return {
      item: schedulerMembership,
    };
  },
};
