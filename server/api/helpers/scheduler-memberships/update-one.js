module.exports = {
  inputs: {
    record: {
      type: 'ref',
      required: true,
    },
    values: {
      type: 'json',
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  async fn(inputs) {
    const { values } = inputs;
    const role = values.role || inputs.record.role;

    if (role === SchedulerMembership.Roles.EDITOR) {
      values.canComment = null;
    } else if (role === SchedulerMembership.Roles.VIEWER) {
      const canComment = _.isUndefined(values.canComment)
        ? inputs.record.canComment
        : values.canComment;

      if (_.isNull(canComment)) {
        values.canComment = false;
      }
    }

    const schedulerMembership = await SchedulerMembership.updateOne(inputs.record.id).set({
      ...values,
    });

    if (schedulerMembership) {
      sails.sockets.broadcast(
        `scheduler:${schedulerMembership.schedulerId}`,
        'schedulerMembershipUpdate',
        {
          item: schedulerMembership,
        },
        inputs.request,
      );
    }

    return schedulerMembership;
  },
};
