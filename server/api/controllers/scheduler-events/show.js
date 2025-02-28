const Errors = {
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
    schedulerEventNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const { schedulerEvent, scheduler } = await sails.helpers.schedulerEvents
      .getSchedulerPath(inputs.id)
      .intercept('pathNotFound', () => Errors.SCHEDULER_EVENT_NOT_FOUND);

    const isSchedulerMember = await sails.helpers.users.isSchedulerMember(
      currentUser.id,
      schedulerEvent.schedulerId,
    );

    if (!isSchedulerMember) {
      const isSchedulerManager = await sails.helpers.users.isSchedulerManager(
        currentUser.id,
        scheduler.id,
      );

      if (!isSchedulerManager) {
        throw Errors.SCHEDULER_EVENT_NOT_FOUND; // Forbidden
      }
    }

    // card.isSubscribed = await sails.helpers.users.isCardSubscriber(currentUser.id, card.id);

    // const cardMemberships = await sails.helpers.cards.getCardMemberships(card.id);
    // const cardLabels = await sails.helpers.cards.getCardLabels(card.id);
    // const tasks = await sails.helpers.cards.getTasks(card.id);
    // const attachments = await sails.helpers.cards.getAttachments(card.id);

    return {
      item: schedulerEvent,
      // included: {
      //   cardMemberships,
      //   cardLabels,
      //   tasks,
      //   attachments,
      // },
    };
  },
};
