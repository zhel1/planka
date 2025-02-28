import { attr, fk } from 'redux-orm';

import BaseModel from './BaseModel';
import ActionTypes from '../constants/ActionTypes';

export default class extends BaseModel {
  static modelName = 'SchedulerLabel';

  static fields = {
    id: attr(),
    position: attr(),
    name: attr(),
    color: attr(),
    schedulerId: fk({
      to: 'Scheduler',
      as: 'scheduler',
      relatedName: 'labels',
    }),
  };

  static reducer({ type, payload }, SchedulerLabel) {
    switch (type) {
      case ActionTypes.LOCATION_CHANGE_HANDLE:
      case ActionTypes.CORE_INITIALIZE:
      case ActionTypes.SCHEDULER_MANAGER_CREATE_HANDLE:
      case ActionTypes.SCHEDULER_MEMBERSHIP_CREATE_HANDLE:
        if (payload.schedulerLabels) {
          payload.schedulerLabels.forEach((label) => {
            SchedulerLabel.upsert(label);
          });
        }

        break;
      case ActionTypes.SOCKET_RECONNECT_HANDLE:
        SchedulerLabel.all().delete();

        if (payload.schedulerLabels) {
          payload.schedulerLabels.forEach((label) => {
            SchedulerLabel.upsert(label);
          });
        }

        break;
      // case ActionTypes.BOARD_FETCH__SUCCESS:
      //   payload.labels.forEach((label) => {
      //     SchedulerLabel.upsert(label);
      //   });
      //
      //   break;
      case ActionTypes.SCHEDULER_LABEL_CREATE:
      case ActionTypes.SCHEDULER_LABEL_CREATE_HANDLE:
      case ActionTypes.SCHEDULER_LABEL_UPDATE__SUCCESS:
      case ActionTypes.SCHEDULER_LABEL_UPDATE_HANDLE:
        SchedulerLabel.upsert(payload.schedulerLabel);

        break;
      case ActionTypes.SCHEDULER_LABEL_CREATE__SUCCESS:
        SchedulerLabel.withId(payload.localId).delete();
        SchedulerLabel.upsert(payload.schedulerLabel);

        break;
      case ActionTypes.SCHEDULER_LABEL_UPDATE:
        SchedulerLabel.withId(payload.id).update(payload.data);

        break;
      case ActionTypes.SCHEDULER_LABEL_DELETE:
        SchedulerLabel.withId(payload.id).deleteWithRelated();

        break;
      case ActionTypes.SCHEDULER_LABEL_DELETE__SUCCESS:
      case ActionTypes.SCHEDULER_LABEL_DELETE_HANDLE: {
        const labelModel = SchedulerLabel.withId(payload.schedulerLabel.id);

        if (labelModel) {
          labelModel.delete();
        }

        break;
      }
      default:
    }
  }

  deleteRelatedEvents() {
    this.schedulerEvents.toModelArray().forEach((event) => {
      if (event.schedulerLabelId === this.id) {
        event.delete();
      }
    });
  }

  deleteWithRelated() {
    this.deleteRelatedEvents();
    this.delete();
  }
}
