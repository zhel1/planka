const util = require('util');
const rimraf = require('rimraf');
const { v4: uuid } = require('uuid');

const Errors = {
  SCHEDULER_NOT_FOUND: {
    schedulerNotFound: 'Scheduler not found',
  },
  NO_FILE_WAS_UPLOADED: {
    noFileWasUploaded: 'No file was uploaded',
  },
  FILE_IS_NOT_IMAGE: {
    fileIsNotImage: 'File is not image',
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
    schedulerNotFound: {
      responseType: 'notFound',
    },
    noFileWasUploaded: {
      responseType: 'unprocessableEntity',
    },
    fileIsNotImage: {
      responseType: 'unprocessableEntity',
    },
    uploadError: {
      responseType: 'unprocessableEntity',
    },
  },

  async fn(inputs, exits) {
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

    const upload = util.promisify((options, callback) =>
      this.req.file('file').upload(options, (error, files) => callback(error, files)),
    );

    let files;
    try {
      files = await upload({
        saveAs: uuid(),
        maxBytes: null,
      });
    } catch (error) {
      return exits.uploadError(error.message); // TODO: add error
    }

    if (files.length === 0) {
      throw Errors.NO_FILE_WAS_UPLOADED;
    }

    const file = _.last(files);

    const fileData = await sails.helpers.schedulers
      .processUploadedBackgroundImageFile(file)
      .intercept('fileIsNotImage', () => {
        try {
          rimraf.sync(file.fd);
        } catch (error) {
          console.warn(error.stack); // eslint-disable-line no-console
        }

        return Errors.FILE_IS_NOT_IMAGE;
      });

    scheduler = await sails.helpers.schedulers.updateOne.with({
      record: scheduler,
      values: {
        backgroundImage: fileData,
      },
      request: this.req,
    });

    if (!scheduler) {
      throw Errors.SCHEDULER_NOT_FOUND;
    }

    return exits.success({
      item: scheduler,
    });
  },
};
