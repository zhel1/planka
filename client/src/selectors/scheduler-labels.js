import { createSelector } from 'redux-orm';

import orm from '../orm';

export const makeSelectSchedulerLabelById = () =>
  createSelector(
    orm,
    (_, id) => id,
    ({ SchedulerLabel }, id) => {
      const labelModel = SchedulerLabel.withId(id);

      if (!labelModel) {
        return labelModel;
      }

      return labelModel.ref;
    },
  );

export const selectSchedulerLabelById = makeSelectSchedulerLabelById();

export default {
  makeSelectSchedulerLabelById,
  selectSchedulerLabelById,
};
