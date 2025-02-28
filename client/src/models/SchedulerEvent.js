import { attr, fk } from 'redux-orm';

import BaseModel from './BaseModel';
import ActionTypes from '../constants/ActionTypes';

export default class extends BaseModel {
  static modelName = 'SchedulerEvent';

  static fields = {
    id: attr(),
    name: attr(),
    description: attr(),
    startDate: attr(),
    untilDate: attr(),
    isAllDay: attr(),
    isRecurring: attr(),
    duration: attr(),
    recurrencePattern: attr(),
    schedulerId: fk({
      to: 'Scheduler',
      as: 'scheduler',
      relatedName: 'schedulerEvents',
    }),
    creatorUserId: fk({
      to: 'User',
      as: 'user',
      relatedName: 'schedulerEvents',
    }),
    schedulerLabelId: fk({
      to: 'SchedulerLabel',
      as: 'schedulerLabel',
      relatedName: 'schedulerEvents',
    }),
  };

  static reducer({ type, payload }, SchedulerEvent) {
    switch (type) {
      case ActionTypes.LOCATION_CHANGE_HANDLE:
      case ActionTypes.CORE_INITIALIZE:
      case ActionTypes.SCHEDULER_MANAGER_CREATE_HANDLE:
      case ActionTypes.SCHEDULER_MEMBERSHIP_CREATE_HANDLE:
        if (payload.schedulerEvents) {
          payload.schedulerEvents.forEach((event) => {
            SchedulerEvent.upsert(event);
          });
        }

        break;
      case ActionTypes.SOCKET_RECONNECT_HANDLE:
        SchedulerEvent.all().delete();

        if (payload.schedulerEvents) {
          payload.schedulerEvents.forEach((event) => {
            SchedulerEvent.upsert(event);
          });
        }

        break;
      case ActionTypes.SCHEDULER_EVENT_CREATE:
      case ActionTypes.SCHEDULER_EVENT_CREATE_HANDLE:
      case ActionTypes.SCHEDULER_EVENT_UPDATE__SUCCESS:
      case ActionTypes.SCHEDULER_EVENT_UPDATE_HANDLE:
        SchedulerEvent.upsert(payload.schedulerEvent);

        break;
      case ActionTypes.SCHEDULER_EVENT_UPDATE:
        SchedulerEvent.withId(payload.id).update(payload.data);

        break;
      case ActionTypes.SCHEDULER_EVENT_DELETE:
        SchedulerEvent.withId(payload.id).deleteWithRelated();

        break;
      case ActionTypes.SCHEDULER_EVENT_DELETE__SUCCESS:
      case ActionTypes.SCHEDULER_EVENT_DELETE_HANDLE: {
        const schedulerEventModel = SchedulerEvent.withId(payload.schedulerEvent.id);

        if (schedulerEventModel) {
          schedulerEventModel.deleteWithRelated();
        }

        break;
      }
      // case ActionTypes.BOARD_FETCH__SUCCESS:
      //   payload.labels.forEach((label) => {
      //     SchedulerEvent.upsert(label);
      //   });
      //
      //   break;

      case ActionTypes.SCHEDULER_EVENT_CREATE__SUCCESS:
        SchedulerEvent.withId(payload.localId).delete();
        SchedulerEvent.upsert(payload.schedulerEvent);

        break;

      /*      case ActionTypes.SCHEDULER_LABEL_CREATE:
      case ActionTypes.SCHEDULER_LABEL_CREATE_HANDLE:
      case ActionTypes.SCHEDULER_LABEL_UPDATE__SUCCESS:
      case ActionTypes.SCHEDULER_LABEL_UPDATE_HANDLE:
        SchedulerEvent.upsert(payload.schedulerEvent);

        break;
      case ActionTypes.SCHEDULER_LABEL_CREATE__SUCCESS:
        SchedulerEvent.withId(payload.localId).delete();
        SchedulerEvent.upsert(payload.schedulerLabel);

        break;
      case ActionTypes.SCHEDULER_LABEL_UPDATE:
        SchedulerEvent.withId(payload.id).update(payload.data);

        break;
      case ActionTypes.SCHEDULER_LABEL_DELETE:
        SchedulerEvent.withId(payload.id).delete();

        break;
      case ActionTypes.SCHEDULER_LABEL_DELETE__SUCCESS:
      case ActionTypes.SCHEDULER_LABEL_DELETE_HANDLE: {
        const labelModel = SchedulerEvent.withId(payload.schedulerEvent.id);

        if (labelModel) {
          labelModel.delete();
        }

        break;
      }
      */
      default:
    }
  }

  isAvailableForUser(userId) {
    return (
      this.scheduler &&
      (this.scheduler.hasManagerForUser(userId) || this.scheduler.hasMembershipForUser(userId))
    );
  }

  // deleteRelated() {}

  deleteWithRelated() {
    // this.deleteRelated();
    this.delete();
  }
}
