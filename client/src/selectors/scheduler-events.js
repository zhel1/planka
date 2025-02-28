import { createSelector } from 'redux-orm';
import orm from '../orm';
import { selectPath } from './router';

export const makeSelectSchedulerLabelByEventId = () =>
  createSelector(
    orm,
    (_, id) => id,
    ({ SchedulerEvent }, id) => {
      const schedulerEventModel = SchedulerEvent.withId(id);

      if (!schedulerEventModel || !schedulerEventModel.schedulerLabel) {
        return schedulerEventModel;
      }

      return schedulerEventModel.schedulerLabel.ref;
    },
  );
export const selectSchedulerLabelByEventId = makeSelectSchedulerLabelByEventId();

export const makeSelectCreatorUserByEventId = () =>
  createSelector(
    orm,
    (_, id) => id,
    ({ SchedulerEvent }, id) => {
      const schedulerEventModel = SchedulerEvent.withId(id);

      if (!schedulerEventModel) {
        return schedulerEventModel;
      }

      return schedulerEventModel.user.ref;
    },
  );

export const selectCreatorUserByEventId = makeSelectCreatorUserByEventId();

export const selectCurrentSchedulerEvent = createSelector(
  orm,
  (state) => selectPath(state).schedulerEventId,
  ({ SchedulerEvent }, id) => {
    if (!id) {
      return id;
    }

    const schedulerEventModel = SchedulerEvent.withId(id);

    if (!schedulerEventModel) {
      return schedulerEventModel;
    }

    return schedulerEventModel.ref;
  },
);

export const selectCreatorUserForCurrentSchedulerEvent = createSelector(
  orm,
  (state) => selectPath(state).schedulerEventId,
  ({ SchedulerEvent }, id) => {
    if (!id) {
      return id;
    }

    const schedulerEventModel = SchedulerEvent.withId(id);

    if (!schedulerEventModel) {
      return schedulerEventModel;
    }

    return schedulerEventModel.user.ref;
  },
);

export const selectLabelForCurrentSchedulerEvent = createSelector(
  orm,
  (state) => selectPath(state).schedulerEventId,
  ({ SchedulerEvent }, id) => {
    if (!id) {
      return id;
    }

    const schedulerEventModel = SchedulerEvent.withId(id);

    if (!schedulerEventModel) {
      return schedulerEventModel;
    }

    return schedulerEventModel.schedulerLabel.ref;
  },
);

export default {
  selectSchedulerLabelByEventId,
  makeSelectSchedulerLabelByEventId,
  selectCreatorUserByEventId,
  makeSelectCreatorUserByEventId,
  selectCurrentSchedulerEvent,
  selectCreatorUserForCurrentSchedulerEvent,
  selectLabelForCurrentSchedulerEvent,
};
