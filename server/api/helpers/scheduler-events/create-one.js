const valuesValidator = (value) => {
  if (!_.isPlainObject(value)) {
    return false;
  }

  if (!_.isPlainObject(value.creatorUser)) {
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
    positionMustBeInValues: {},
  },

  async fn(inputs) {
    const { values } = inputs;

    const schedulerEvent = await SchedulerEvent.create({
      ...values,
      creatorUserId: values.creatorUser.id,
    }).fetch();

    sails.sockets.broadcast(
      `scheduler:${schedulerEvent.schedulerId}`,
      'schedulerEventCreate',
      {
        item: schedulerEvent,
      },
      inputs.request,
    );

    // if (values.creatorUser.subscribeToOwnCards) {
    //   await CardSubscription.create({
    //     cardId: card.id,
    //     userId: card.creatorUserId,
    //   }).tolerate('E_UNIQUE');
    //
    //   sails.sockets.broadcast(`user:${card.creatorUserId}`, 'cardUpdate', {
    //     item: {
    //       id: card.id,
    //       isSubscribed: true,
    //     },
    //   });
    // }
    //
    // await sails.helpers.actions.createOne.with({
    //   values: {
    //     card,
    //     type: Action.Types.CREATE_CARD,
    //     data: {
    //       list: _.pick(values.list, ['id', 'name']),
    //     },
    //     user: values.creatorUser,
    //   },
    // });

    return schedulerEvent;
  },
};
