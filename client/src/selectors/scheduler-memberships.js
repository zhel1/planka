import { createSelector } from 'redux-orm';

import orm from '../orm';

export const makeSelectSchedulerMembershipById = () =>
  createSelector(
    orm,
    (_, id) => id,
    ({ SchedulerMembership }, id) => {
      const schedulerMembershipModel = SchedulerMembership.withId(id);

      if (!schedulerMembershipModel) {
        return schedulerMembershipModel;
      }

      return schedulerMembershipModel.ref;
    },
  );

export const selectSchedulerMembershipById = makeSelectSchedulerMembershipById();

export default {
  makeSelectSchedulerMembershipById,
  selectSchedulerMembershipById,
};
