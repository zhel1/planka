import { createSelector } from 'redux-orm';
import orm from '../orm';
import { selectPath } from './router';
import { selectCurrentUserId } from './users';
import { isLocalId } from '../utils/local-id';

export const selectCurrentScheduler = createSelector(
  orm,
  (state) => selectPath(state).schedulerId,
  ({ Scheduler }, id) => {
    if (!id) {
      return id;
    }

    const schedulerModel = Scheduler.withId(id);

    if (!schedulerModel) {
      return schedulerModel;
    }

    return schedulerModel.ref;
  },
);

export const selectManagersForCurrentScheduler = createSelector(
  orm,
  (state) => selectPath(state).schedulerId,
  (state) => selectCurrentUserId(state),
  ({ Scheduler }, id, currentUserId) => {
    if (!id) {
      return id;
    }

    const schedulerModel = Scheduler.withId(id);

    if (!schedulerModel) {
      return schedulerModel;
    }

    return schedulerModel
      .getOrderedManagersQuerySet()
      .toModelArray()
      .map((schedulerManagerModel) => ({
        ...schedulerManagerModel.ref,
        isPersisted: !isLocalId(schedulerManagerModel.id),
        user: {
          ...schedulerManagerModel.user.ref,
          isCurrent: schedulerManagerModel.user.id === currentUserId,
        },
      }));
  },
);

export const selectMembershipsForCurrentScheduler = createSelector(
  orm,
  (state) => selectPath(state).schedulerId,
  (state) => selectCurrentUserId(state),
  ({ Scheduler }, id, currentUserId) => {
    if (!id) {
      return id;
    }

    const schedulerModel = Scheduler.withId(id);

    if (!schedulerModel) {
      return schedulerModel;
    }

    return schedulerModel
      .getOrderedMembershipsQuerySet()
      .toModelArray()
      .map((schedulerMembershipModel) => ({
        ...schedulerMembershipModel.ref,
        isPersisted: !isLocalId(schedulerMembershipModel.id),
        user: {
          ...schedulerMembershipModel.user.ref,
          isCurrent: schedulerMembershipModel.user.id === currentUserId,
        },
      }));
  },
);

export const makeSelectLabelsForCurrentScheduler = () =>
  createSelector(
    orm,
    (state) => selectPath(state).schedulerId,
    ({ Scheduler }, id) => {
      if (!id) {
        return id;
      }

      const schedulerModel = Scheduler.withId(id);

      if (!schedulerModel) {
        return schedulerModel;
      }

      return schedulerModel
        .getOrderedSchedulerLabelsQuerySet()
        .toRefArray()
        .map((label) => ({
          ...label,
          isPersisted: !isLocalId(label.id),
        }));
    },
  );

export const selectLabelsForCurrentScheduler = makeSelectLabelsForCurrentScheduler();

export const selectFilterUsersForCurrentScheduler = createSelector(
  orm,
  (state) => selectPath(state).schedulerId,
  ({ Scheduler }, id) => {
    if (!id) {
      return id;
    }

    const schedulerModel = Scheduler.withId(id);

    if (!schedulerModel) {
      return schedulerModel;
    }

    return schedulerModel.filterUsers.toRefArray();
  },
);

export const selectFilterSchedulerLabelsForCurrentScheduler = createSelector(
  orm,
  (state) => selectPath(state).schedulerId,
  ({ Scheduler }, id) => {
    if (!id) {
      return id;
    }

    const schedulerModel = Scheduler.withId(id);

    if (!schedulerModel) {
      return schedulerModel;
    }

    return schedulerModel.filterLabels.toRefArray();
  },
);

export const selectCurrentUserMembershipForCurrentScheduler = createSelector(
  orm,
  (state) => selectPath(state).schedulerId,
  (state) => selectCurrentUserId(state),
  ({ Scheduler }, id, currentUserId) => {
    if (!id) {
      return id;
    }

    const schedulerModel = Scheduler.withId(id);

    if (!schedulerModel) {
      return schedulerModel;
    }

    const schedulerMembershipModel = schedulerModel.getMembershipModelForUser(currentUserId);

    if (!schedulerMembershipModel) {
      return schedulerMembershipModel;
    }

    return schedulerMembershipModel.ref;
  },
);

export const makeSelectEventsForCurrentScheduler = () =>
  createSelector(
    orm,
    (state) => selectPath(state).schedulerId,
    ({ Scheduler }, id) => {
      if (!id) {
        return id;
      }

      const schedulerModel = Scheduler.withId(id);

      if (!schedulerModel) {
        return schedulerModel;
      }

      return schedulerModel.getFilteredOrderedSchedulerEventsModelArray();
      // return schedulerModel.getOrderedSchedulerEventsQuerySet().toRefArray();
    },
  );

export const selectEventsForCurrentScheduler = makeSelectEventsForCurrentScheduler();

export default {
  selectCurrentScheduler,
  selectManagersForCurrentScheduler,
  makeSelectLabelsForCurrentScheduler,
  selectLabelsForCurrentScheduler,
  // selectBoardsForCurrentScheduler,
  // selectIsCurrentUserManagerForCurrentScheduler,
  // selectIsCurrentUserManagerForCurrentScheduler,

  // new
  selectMembershipsForCurrentScheduler,
  selectFilterUsersForCurrentScheduler,
  selectFilterSchedulerLabelsForCurrentScheduler,
  selectCurrentUserMembershipForCurrentScheduler,
  selectEventsForCurrentScheduler,
  makeSelectEventsForCurrentScheduler,
};
