const Errors = {
  SCHEDULER_NOT_FOUND: {
    schedulerNotFound: 'Scheduler not found',
  },
};

const backgroundValidator = (value) => {
  if (_.isNull(value)) {
    return true;
  }

  if (!_.isPlainObject(value)) {
    return false;
  }

  if (!Object.values(Scheduler.BackgroundTypes).includes(value.type)) {
    return false;
  }

  if (
    value.type === Scheduler.BackgroundTypes.GRADIENT &&
    _.size(value) === 2 &&
    Scheduler.BACKGROUND_GRADIENTS.includes(value.name)
  ) {
    return true;
  }

  if (value.type === Scheduler.BackgroundTypes.IMAGE && _.size(value) === 1) {
    return true;
  }

  return false;
};

const backgroundImageValidator = (value) => _.isNull(value);

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
    background: {
      type: 'json',
      custom: backgroundValidator,
    },
    backgroundImage: {
      type: 'json',
      custom: backgroundImageValidator,
    },
  },

  exits: {
    schedulerNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    let scheduler = await Scheduler.findOne(inputs.id);

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

    const values = _.pick(inputs, ['name', 'background', 'backgroundImage']);

    scheduler = await sails.helpers.schedulers.updateOne.with({
      values,
      record: scheduler,
      request: this.req,
    });

    if (!scheduler) {
      throw Errors.SCHEDULER_NOT_FOUND;
    }

    return {
      item: scheduler,
    };
  },
};
