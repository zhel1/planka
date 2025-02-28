import { createSelector } from 'redux-orm';

import orm from '../orm';

export const makeSelectSchedulerManagerById = () =>
  createSelector(
    orm,
    (_, id) => id,
    ({ SchedulerManager }, id) => {
      const schedulerManagerModel = SchedulerManager.withId(id);

      if (!schedulerManagerModel) {
        return schedulerManagerModel;
      }

      return schedulerManagerModel.ref;
    },
  );

export const selectSchedulerManagerById = makeSelectSchedulerManagerById();

export default {
  makeSelectSchedulerManagerById,
  selectSchedulerManagerById,
};
