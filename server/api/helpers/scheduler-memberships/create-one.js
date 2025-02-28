const valuesValidator = (value) => {
  if (!_.isPlainObject(value)) {
    return false;
  }

  if (!_.isPlainObject(value.scheduler)) {
    return false;
  }

  if (!_.isPlainObject(value.user)) {
    return false;
  }

  return true;
};

module.exports = {
  inputs: {
    values: {
      type: 'ref',
      custom: valuesValidator,
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  exits: {
    userAlreadySchedulerMember: {},
  },

  async fn(inputs) {
    const { values } = inputs;

    if (values.role === SchedulerMembership.Roles.EDITOR) {
      delete values.canComment;
    } else if (values.role === SchedulerMembership.Roles.VIEWER) {
      if (_.isNil(values.canComment)) {
        values.canComment = false;
      }
    }

    const schedulerMembership = await SchedulerMembership.create({
      ...values,
      schedulerId: values.scheduler.id,
      userId: values.user.id,
    })
      .intercept('E_UNIQUE', 'userAlreadySchedulerMember')
      .fetch();

    const schedulerRelatedUserIds = await sails.helpers.schedulers.getManagerAndMemberUserIds(
      schedulerMembership.schedulerId,
    );

    schedulerRelatedUserIds.push(schedulerMembership.userId);

    schedulerRelatedUserIds.forEach((userId) => {
      sails.sockets.broadcast(
        `user:${userId}`,
        'schedulerMembershipCreate',
        {
          item: schedulerMembership,
        },
        inputs.request,
      );
    });

    sails.sockets.broadcast(
      `scheduler:${schedulerMembership.schedulerId}`,
      'schedulerMembershipCreate',
      {
        item: schedulerMembership,
      },
      inputs.request,
    );

    return schedulerMembership;
  },
};
