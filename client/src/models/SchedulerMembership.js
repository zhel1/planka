import { attr, fk } from 'redux-orm';

import BaseModel from './BaseModel';
import ActionTypes from '../constants/ActionTypes';

export default class extends BaseModel {
  static modelName = 'SchedulerMembership';

  static fields = {
    id: attr(),
    role: attr(),
    canComment: attr(),
    createdAt: attr({
      getDefault: () => new Date(),
    }),
    schedulerId: fk({
      to: 'Scheduler',
      as: 'scheduler',
      relatedName: 'memberships',
    }),
    userId: fk({
      to: 'User',
      as: 'user',
      relatedName: 'schedulerMemberships',
    }),
  };

  static reducer({ type, payload }, SchedulerMembership) {
    switch (type) {
      case ActionTypes.LOCATION_CHANGE_HANDLE:
      case ActionTypes.SCHEDULER_MANAGER_CREATE_HANDLE:
        if (payload.schedulerMemberships) {
          payload.schedulerMemberships.forEach((schedulerMembership) => {
            SchedulerMembership.upsert(schedulerMembership);
          });
        }

        break;
      case ActionTypes.SOCKET_RECONNECT_HANDLE:
        SchedulerMembership.all().delete();

        payload.schedulerMemberships.forEach((schedulerMembership) => {
          SchedulerMembership.upsert(schedulerMembership);
        });

        break;
      case ActionTypes.CORE_INITIALIZE:
        // case ActionTypes.SCHEDULER_CREATE_HANDLE:
        // case ActionTypes.SCHEDULER_CREATE__SUCCESS:
        // case ActionTypes.BOARD_FETCH__SUCCESS:
        payload.schedulerMemberships.forEach((schedulerMembership) => {
          SchedulerMembership.upsert(schedulerMembership);
        });

        break;
      case ActionTypes.SCHEDULER_MEMBERSHIP_CREATE:
        SchedulerMembership.upsert(payload.schedulerMembership);

        break;
      case ActionTypes.SCHEDULER_MEMBERSHIP_CREATE__SUCCESS:
        SchedulerMembership.withId(payload.localId).delete();
        SchedulerMembership.upsert(payload.schedulerMembership);

        break;
      case ActionTypes.SCHEDULER_MEMBERSHIP_CREATE_HANDLE:
        SchedulerMembership.upsert(payload.schedulerMembership);

        if (payload.schedulerMemberships) {
          payload.schedulerMemberships.forEach((schedulerMembership) => {
            SchedulerMembership.upsert(schedulerMembership);
          });
        }

        break;
      case ActionTypes.SCHEDULER_MEMBERSHIP_UPDATE:
        SchedulerMembership.withId(payload.id).update(payload.data);

        break;
      case ActionTypes.SCHEDULER_MEMBERSHIP_UPDATE__SUCCESS:
      case ActionTypes.SCHEDULER_MEMBERSHIP_UPDATE_HANDLE:
        SchedulerMembership.upsert(payload.schedulerMembership);

        break;
      case ActionTypes.SCHEDULER_MEMBERSHIP_DELETE:
        SchedulerMembership.withId(payload.id).deleteWithRelated();

        break;
      case ActionTypes.SCHEDULER_MEMBERSHIP_DELETE__SUCCESS:
      case ActionTypes.SCHEDULER_MEMBERSHIP_DELETE_HANDLE: {
        const schedulerMembershipModel = SchedulerMembership.withId(payload.schedulerMembership.id);

        if (schedulerMembershipModel) {
          schedulerMembershipModel.deleteWithRelated();
        }

        break;
      }
      default:
    }
  }

  // TODO*
  // deleteRelated() {
  //   this.board.cards.toModelArray().forEach((cardModel) => {
  //     try {
  //       cardModel.users.remove(this.userId);
  //     } catch {} // eslint-disable-line no-empty
  //   });
  //
  //   try {
  //     this.board.filterUsers.remove(this.userId);
  //   } catch {} // eslint-disable-line no-empty
  // }

  deleteWithRelated() {
    // this.deleteRelated();
    this.delete();
  }
}
