/**
 * Scheduler.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const BackgroundTypes = {
  GRADIENT: 'gradient',
  IMAGE: 'image',
};

const BACKGROUND_GRADIENTS = [
  'old-lime',
  'ocean-dive',
  'tzepesch-style',
  'jungle-mesh',
  'strawberry-dust',
  'purple-rose',
  'sun-scream',
  'warm-rust',
  'sky-change',
  'green-eyes',
  'blue-xchange',
  'blood-orange',
  'sour-peel',
  'green-ninja',
  'algae-green',
  'coral-reef',
  'steel-grey',
  'heat-waves',
  'velvet-lounge',
  'purple-rain',
  'blue-steel',
  'blueish-curve',
  'prism-light',
  'green-mist',
  'red-curtain',
];

module.exports = {
  BackgroundTypes,
  BACKGROUND_GRADIENTS,

  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    name: {
      type: 'string',
      required: true,
    },
    background: {
      type: 'json',
    },
    backgroundImage: {
      type: 'json',
      columnName: 'background_image',
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    managerUsers: {
      collection: 'User',
      via: 'schedulerId',
      through: 'SchedulerManager',
    },
    membershipUsers: {
      collection: 'User',
      via: 'schedulerId',
      through: 'SchedulerMembership',
    },
    labels: {
      collection: 'SchedulerLabel',
      via: 'schedulerId',
    },
  },
};
