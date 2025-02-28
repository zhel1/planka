const valuesValidator = (value) => {
  if (!_.isPlainObject(value)) {
    return false;
  }

  if (!_.isUndefined(value.scheduler) && !_.isPlainObject(value.scheduler)) {
    return false;
  }

  return true;
};

module.exports = {
  inputs: {
    record: {
      type: 'ref',
      required: true,
    },
    values: {
      type: 'ref',
      custom: valuesValidator,
      required: true,
    },
    user: {
      type: 'ref',
    },
    scheduler: {
      type: 'ref',
    },
    request: {
      type: 'ref',
    },
  },

  exits: {
    userMustBePresent: {},
    schedulerMustBePresent: {},
  },

  async fn(inputs) {
    const { ...values } = inputs.values;

    if (values.scheduler) {
      if (!inputs.scheduler) {
        throw 'schedulerMustBePresent';
      }

      if (values.scheduler) {
        if (values.scheduler.id === inputs.scheduler.id) {
          delete values.scheduler;
        } else {
          values.schedulerId = values.scheduler.id;
        }
      }
    }

    if (values.scheduler && !inputs.user) {
      throw 'userMustBePresent';
    }

    //
    let schedulerEvent;
    if (_.isEmpty(values)) {
      schedulerEvent = inputs.record;
    } else {
      let prevLabel;
      if (values.scheduler) {
        prevLabel = await SchedulerLabel.findOne(inputs.record.schedulerLabelId);
      }

      schedulerEvent = await SchedulerEvent.updateOne(inputs.record.id).set({ ...values });

      if (!schedulerEvent) {
        return schedulerEvent;
      }

      if (values.scheduler) {
        const labels = await sails.helpers.schedulers.getLabels(schedulerEvent.schedulerId);
        const labelByName = _.keyBy(labels, 'name');

        let labelId;
        if (labelByName[prevLabel.name]) {
          labelId = labelByName[prevLabel.name].id;
        } else {
          const { id } = await sails.helpers.schedulerLabels.createOne.with({
            values: {
              ..._.omit(prevLabel, ['id', 'schedulerId']),
              scheduler: values.scheduler,
            },
          });

          labelId = id;
        }

        schedulerEvent = await SchedulerEvent.updateOne(inputs.record.id).set({
          schedulerLabelId: labelId,
        });

        sails.sockets.broadcast(`scheduler:${schedulerEvent.schedulerId}`, 'schedulerEventUpdate', {
          item: schedulerEvent,
        });

        // const subscriptionUserIds = await sails.helpers.cards.getSubscriptionUserIds(card.id);
        //
        // subscriptionUserIds.forEach((userId) => {
        //   sails.sockets.broadcast(`user:${userId}`, 'schedulerEventUpdate', {
        //     item: {
        //       id: schedulerEvent.id,
        //       isSubscribed: true,
        //     },
        //   });
        // });
      } else {
        sails.sockets.broadcast(
          `scheduler:${schedulerEvent.schedulerId}`,
          'schedulerEventUpdate',
          {
            item: schedulerEvent,
          },
          inputs.request,
        );
      }

      // save action for history
      // if (!values.board && values.list) {
      //   await sails.helpers.actions.createOne.with({
      //     values: {
      //       card,
      //       user: inputs.user,
      //       type: Action.Types.MOVE_CARD,
      //       data: {
      //         fromList: _.pick(inputs.list, ['id', 'name']),
      //         toList: _.pick(values.list, ['id', 'name']),
      //       },
      //     },
      //   });
      // }

      // TODO: add transfer action
    }

    // if (!_.isUndefined(isSubscribed)) {
    //   const prevIsSubscribed = await sails.helpers.users.isCardSubscriber(inputs.user.id, card.id);
    //
    //   if (isSubscribed !== prevIsSubscribed) {
    //     if (isSubscribed) {
    //       await CardSubscription.create({
    //         cardId: card.id,
    //         userId: inputs.user.id,
    //       }).tolerate('E_UNIQUE');
    //     } else {
    //       await CardSubscription.destroyOne({
    //         cardId: card.id,
    //         userId: inputs.user.id,
    //       });
    //     }
    //
    //     sails.sockets.broadcast(
    //       `user:${inputs.user.id}`,
    //       'schedulerEventUpdate',
    //       {
    //         item: {
    //           isSubscribed,
    //           id: card.id,
    //         },
    //       },
    //       inputs.request,
    //     );
    //   }
    // }

    return schedulerEvent;
  },
};
