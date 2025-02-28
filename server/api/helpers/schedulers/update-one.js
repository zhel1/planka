const path = require('path');
const rimraf = require('rimraf');

const valuesValidator = (value) => {
  if (!_.isPlainObject(value)) {
    return false;
  }

  if (!_.isNil(value.background) && !_.isPlainObject(value.background)) {
    return false;
  }

  if (!_.isNil(value.backgroundImage) && !_.isPlainObject(value.backgroundImage)) {
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
      type: 'json',
      custom: valuesValidator,
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  exits: {
    backgroundImageInValuesMustNotBeNull: {},
  },

  async fn(inputs) {
    const { values } = inputs;

    if (values.backgroundImage) {
      values.background = {
        type: 'image',
      };
    } else if (
      _.isNull(values.backgroundImage) &&
      inputs.record.background &&
      inputs.record.background.type === 'image'
    ) {
      values.background = null;
    }

    let scheduler;
    if (values.background && values.background.type === 'image') {
      if (_.isNull(values.backgroundImage)) {
        throw 'backgroundImageInValuesMustNotBeNull';
      }

      if (_.isUndefined(values.backgroundImage)) {
        scheduler = await Scheduler.updateOne({
          id: inputs.record.id,
          backgroundImage: {
            '!=': null,
          },
        }).set({ ...values });

        if (!scheduler) {
          delete values.background;
        }
      }
    }

    if (!scheduler) {
      scheduler = await Scheduler.updateOne(inputs.record.id).set({ ...values });
    }

    if (scheduler) {
      if (
        inputs.record.backgroundImage &&
        (!scheduler.backgroundImage ||
          scheduler.backgroundImage.dirname !== inputs.record.backgroundImage.dirname)
      ) {
        try {
          rimraf.sync(
            path.join(
              sails.config.custom.schedulerBackgroundImagesPath,
              inputs.record.backgroundImage.dirname,
            ),
          );
        } catch (error) {
          console.warn(error.stack); // eslint-disable-line no-console
        }
      }

      const schedulerRelatedUserIds = await sails.helpers.schedulers.getManagerAndMemberUserIds(
        scheduler.id,
      );

      schedulerRelatedUserIds.forEach((userId) => {
        sails.sockets.broadcast(
          `user:${userId}`,
          'schedulerUpdate',
          {
            item: scheduler,
          },
          inputs.request,
        );
      });
    }

    return scheduler;
  },
};
