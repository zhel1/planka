/**
 * SchedulerEvent.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      isNotEmptyString: true,
      allowNull: true,
    },
    startDate: {
      type: 'ref',
      columnName: 'start_date',
    },
    untilDate: {
      type: 'ref',
      columnName: 'until_date',
    },
    isAllDay: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'is_all_day',
    },
    isRecurring: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'is_recurring',
    },
    duration: {
      type: 'number',
    },
    recurrencePattern: {
      type: 'string',
      columnName: 'recurrence_pattern',
      allowNull: true,
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    schedulerId: {
      model: 'Scheduler',
      required: true,
      columnName: 'scheduler_id',
    },
    creatorUserId: {
      model: 'User',
      columnName: 'creator_user_id',
    },
    schedulerLabelId: {
      model: 'SchedulerLabel',
      required: true,
      columnName: 'scheduler_label_id',
    },
  },

  tableName: 'scheduler_event',
};
