import { attr, many } from 'redux-orm';

import BaseModel from './BaseModel';
import ActionTypes from '../constants/ActionTypes';
import { SchedulerBackgroundTypes } from '../constants/Enums';

export default class extends BaseModel {
  static modelName = 'Scheduler';

  static fields = {
    id: attr(),
    name: attr(),
    background: attr(),
    backgroundImage: attr(),
    isFetching: attr({
      getDefault: () => null,
    }),
    isBackgroundImageUpdating: attr({
      getDefault: () => false,
    }),
    managerUsers: many({
      to: 'User',
      through: 'SchedulerManager',
      relatedName: 'schedulersWhereIAmManager',
    }),
    memberUsers: many({
      to: 'User',
      through: 'SchedulerMembership',
      relatedName: 'schedulersWhereIAmMember',
    }),
    filterUsers: many('User', 'filterSchedulers'),
    filterLabels: many('SchedulerLabel', 'filterSchedulers'),
  };

  static reducer({ type, payload }, Scheduler) {
    switch (type) {
      // TODO* check this reducer
      case ActionTypes.LOCATION_CHANGE_HANDLE:
        if (payload.schedulers) {
          payload.schedulers.forEach((scheduler) => {
            Scheduler.upsert(scheduler);
          });
        }

        // test
        // if (payload.scheduler) {
        //   Scheduler.upsert({
        //     ...payload.scheduler,
        //     isFetching: false,
        //   });
        // }
        // end test

        break;
      // case ActionTypes.LOCATION_CHANGE_HANDLE__SCHEDULER_FETCH: // test
      // case ActionTypes.SCHEDULER_FETCH: // test
      //   Scheduler.withId(payload.id).update({
      //     isFetching: true,
      //   });
      //
      //   break;

      case ActionTypes.SOCKET_RECONNECT_HANDLE:
        Scheduler.all().delete();

        // test
        // if (payload.scheduler) {
        //   Scheduler.upsert({
        //     ...payload.scheduler,
        //     isFetching: false,
        //   });
        // }
        // ent test

        payload.schedulers.forEach((scheduler) => {
          Scheduler.upsert(scheduler);
        });

        break;
      // case ActionTypes.SOCKET_RECONNECT_HANDLE__CORE_FETCH: // test
      //   Scheduler.all()
      //     .toModelArray()
      //     .forEach((schedulerModel) => {
      //       if (schedulerModel.id !== payload.currentSchedulerId) {
      //         schedulerModel.update({
      //           isFetching: null,
      //         });
      //
      //         schedulerModel.deleteRelated(payload.currentUserId);
      //       }
      //     });
      //
      //   break;
      case ActionTypes.CORE_INITIALIZE:
        /* case ActionTypes.BOARD_FETCH__SUCCESS: */

        // test
        // if (payload.scheduler) {
        //   Scheduler.upsert({
        //     ...payload.scheduler,
        //     isFetching: false,
        //   });
        // }
        // end test

        payload.schedulers.forEach((scheduler) => {
          Scheduler.upsert(scheduler);
        });

        break;
      case ActionTypes.SCHEDULER_CREATE__SUCCESS:
      case ActionTypes.SCHEDULER_CREATE_HANDLE:
      case ActionTypes.SCHEDULER_UPDATE__SUCCESS:
      case ActionTypes.SCHEDULER_UPDATE_HANDLE:
        Scheduler.upsert(payload.scheduler);

        break;
      case ActionTypes.SCHEDULER_UPDATE: {
        const scheduler = Scheduler.withId(payload.id);
        scheduler.update(payload.data);

        if (
          payload.data.backgroundImage === null &&
          scheduler.background &&
          scheduler.background.type === SchedulerBackgroundTypes.IMAGE
        ) {
          scheduler.background = null;
        }

        break;
      }
      case ActionTypes.SCHEDULER_BACKGROUND_IMAGE_UPDATE:
        Scheduler.withId(payload.id).update({
          isBackgroundImageUpdating: true,
        });

        break;
      case ActionTypes.SCHEDULER_BACKGROUND_IMAGE_UPDATE__SUCCESS:
        Scheduler.withId(payload.scheduler.id).update({
          ...payload.scheduler,
          isBackgroundImageUpdating: false,
        });

        break;
      case ActionTypes.SCHEDULER_BACKGROUND_IMAGE_UPDATE__FAILURE:
        Scheduler.withId(payload.id).update({
          isBackgroundImageUpdating: false,
        });

        break;
      case ActionTypes.SCHEDULER_DELETE:
        Scheduler.withId(payload.id).deleteWithRelated();

        break;
      case ActionTypes.SCHEDULER_DELETE__SUCCESS:
      case ActionTypes.SCHEDULER_DELETE_HANDLE: {
        const schedulerModel = Scheduler.withId(payload.scheduler.id);

        if (schedulerModel) {
          schedulerModel.deleteWithRelated();
        }

        break;
      }
      case ActionTypes.SCHEDULER_MANAGER_CREATE_HANDLE:
      case ActionTypes.SCHEDULER_MEMBERSHIP_CREATE_HANDLE:
        if (payload.scheduler) {
          const schedulerModel = Scheduler.withId(payload.scheduler.id);

          if (schedulerModel) {
            schedulerModel.deleteWithRelated();
          }

          Scheduler.upsert(payload.scheduler);
        }

        break;
      // case ActionTypes.PROJECT_MANAGER_CREATE_HANDLE__PROJECT_FETCH:
      // case ActionTypes.BOARD_MEMBERSHIP_CREATE_HANDLE__PROJECT_FETCH: {
      //   const projectModel = Scheduler.withId(payload.id);
      //
      //   if (projectModel) {
      //     projectModel.boards.toModelArray().forEach((boardModel) => {
      //       if (boardModel.id !== payload.currentBoardId) {
      //         boardModel.update({
      //           isFetching: null,
      //         });
      //
      //         boardModel.deleteRelated(payload.currentUserId);
      //       }
      //     });
      //   }
      //
      //   break;
      // }
      // test start
      // case ActionTypes.SCHEDULER_FETCH__SUCCESS:
      //   Scheduler.upsert({
      //     ...payload.scheduler,
      //     isFetching: false,
      //   });
      //
      //   break;
      // case ActionTypes.SCHEDULER_FETCH__FAILURE:
      //   Scheduler.withId(payload.id).update({
      //     isFetching: null,
      //   });
      //
      //   break;
      // end test
      // case ActionTypes.SCHEDULER_MANAGER_CREATE_HANDLE__SCHEDULER_FETCH: // test
      // case ActionTypes.SCHEDULER_MEMBERSHIP_CREATE_HANDLE__SCHEDULER_FETCH: {
      //   const schedulerModels = Scheduler.all();
      //
      //   schedulerModels.toModelArray().forEach((schedulerModel) => {
      //     if (schedulerModel.id !== payload.currentSchedulerId) {
      //       schedulerModel.update({
      //         isFetching: null,
      //       });
      //
      //       schedulerModel.deleteRelated(payload.currentUserId);
      //     }
      //   });
      //
      //   break;
      // }
      case ActionTypes.USER_TO_SCHEDULER_FILTER_ADD:
        Scheduler.withId(payload.schedulerId).filterUsers.add(payload.id);

        break;
      case ActionTypes.USER_FROM_SCHEDULER_FILTER_REMOVE:
        Scheduler.withId(payload.schedulerId).filterUsers.remove(payload.id);

        break;
      case ActionTypes.SCHEDULER_LABEL_TO_SCHEDULER_FILTER_ADD:
        Scheduler.withId(payload.schedulerId).filterLabels.add(payload.id);

        break;
      case ActionTypes.SCHEDULER_LABEL_FROM_SCHEDULER_FILTER_REMOVE:
        Scheduler.withId(payload.schedulerId).filterLabels.remove(payload.id);

        break;
      default:
    }
  }

  getOrderedManagersQuerySet() {
    return this.managers.orderBy('createdAt');
  }

  getOrderedMembershipsQuerySet() {
    return this.memberships.orderBy('createdAt');
  }

  getOrderedSchedulerLabelsQuerySet() {
    return this.labels.orderBy('position');
  }

  getOrderedSchedulerEventsQuerySet() {
    return this.schedulerEvents.orderBy('startDate');
  }

  getFilteredOrderedSchedulerEventsModelArray() {
    let eventModels = this.getOrderedSchedulerEventsQuerySet().toModelArray();

    const filterUserIds = this.filterUsers.toRefArray().map((user) => user.id);
    const filterLabelIds = this.filterLabels.toRefArray().map((label) => label.id);

    if (filterUserIds.length > 0) {
      eventModels = eventModels.filter((eventModel) => {
        const user = eventModel.user.ref;

        return filterUserIds.includes(user.id);
      });
    }

    if (filterLabelIds.length > 0) {
      eventModels = eventModels.filter((eventModel) => {
        const label = eventModel.schedulerLabel.ref;

        return filterLabelIds.includes(label.id);
      });
    }

    return eventModels;
  }

  getMembershipModelForUser(userId) {
    return this.memberships
      .filter({
        userId,
      })
      .first();
  }

  // getOrderedBoardsQuerySet() {
  //   return this.boards.orderBy('position');
  // }
  //
  // getOrderedBoardsModelArrayForUser(userId) {
  //   return this.getOrderedBoardsQuerySet()
  //     .toModelArray()
  //     .filter((boardModel) => boardModel.hasMembershipForUser(userId));
  // }

  // getOrderedBoardsModelArrayAvailableForUser(userId) {
  //   if (this.hasManagerForUser(userId)) {
  //     return this.getOrderedBoardsQuerySet().toModelArray();
  //   }
  //
  //   return this.getOrderedBoardsModelArrayForUser(userId);
  // }

  hasManagerForUser(userId) {
    return this.managers
      .filter({
        userId,
      })
      .exists();
  }

  hasMembershipForUser(userId) {
    return this.memberships
      .filter({
        userId,
      })
      .exists();
  }

  isAvailableForUser(userId) {
    return this.hasManagerForUser(userId) || this.hasMembershipForUser(userId);
  }

  deleteRelated() {
    this.managers.delete();
    this.memberships.delete();
  }

  deleteWithRelated() {
    this.deleteRelated();
    this.delete();
  }
}
