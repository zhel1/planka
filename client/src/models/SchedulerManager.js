import { attr, fk } from 'redux-orm';

import BaseModel from './BaseModel';
import ActionTypes from '../constants/ActionTypes';

export default class extends BaseModel {
  static modelName = 'SchedulerManager';

  static fields = {
    id: attr(),
    createdAt: attr({
      getDefault: () => new Date(),
    }),
    schedulerId: fk({
      to: 'Scheduler',
      as: 'scheduler',
      relatedName: 'managers',
    }),
    userId: fk({
      to: 'User',
      as: 'user',
      relatedName: 'schedulerManagers',
    }),
  };

  static reducer({ type, payload }, SchedulerManager) {
    switch (type) {
      case ActionTypes.SOCKET_RECONNECT_HANDLE:
        SchedulerManager.all().delete();

        payload.schedulerManagers.forEach((schedulerManager) => {
          SchedulerManager.upsert(schedulerManager);
        });

        break;
      case ActionTypes.CORE_INITIALIZE:
      case ActionTypes.SCHEDULER_CREATE__SUCCESS:
      case ActionTypes.SCHEDULER_CREATE_HANDLE:
        payload.schedulerManagers.forEach((schedulerManager) => {
          SchedulerManager.upsert(schedulerManager);
        });

        break;
      case ActionTypes.SCHEDULER_MANAGER_CREATE:
        SchedulerManager.upsert(payload.schedulerManager);

        break;
      case ActionTypes.SCHEDULER_MANAGER_CREATE__SUCCESS:
        SchedulerManager.withId(payload.localId).delete();
        SchedulerManager.upsert(payload.schedulerManager);

        break;
      case ActionTypes.SCHEDULER_MANAGER_CREATE_HANDLE:
        SchedulerManager.upsert(payload.schedulerManager);

        if (payload.schedulerManagers) {
          payload.schedulerManagers.forEach((schedulerManager) => {
            SchedulerManager.upsert(schedulerManager);
          });
        }

        break;
      case ActionTypes.SCHEDULER_MANAGER_DELETE:
        SchedulerManager.withId(payload.id).delete();

        break;
      case ActionTypes.SCHEDULER_MANAGER_DELETE__SUCCESS:
      case ActionTypes.SCHEDULER_MANAGER_DELETE_HANDLE: {
        const schedulerManagerModel = SchedulerManager.withId(payload.schedulerManager.id);

        if (schedulerManagerModel) {
          schedulerManagerModel.delete();
        }

        break;
      }
      case ActionTypes.BOARD_MEMBERSHIP_CREATE_HANDLE:
        if (payload.schedulerManagers) {
          payload.schedulerManagers.forEach((schedulerManager) => {
            SchedulerManager.upsert(schedulerManager);
          });
        }

        break;
      default:
    }
  }
}
