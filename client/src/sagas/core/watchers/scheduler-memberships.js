import { all, takeEvery } from 'redux-saga/effects';

import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* schedulerMembershipsWatchers() {
  yield all([
    takeEvery(EntryActionTypes.MEMBERSHIP_IN_CURRENT_SCHEDULER_CREATE, ({ payload: { data } }) =>
      services.createMembershipInCurrentScheduler(data),
    ),
    takeEvery(
      EntryActionTypes.SCHEDULER_MEMBERSHIP_CREATE_HANDLE,
      ({ payload: { schedulerMembership } }) =>
        services.handleSchedulerMembershipCreate(schedulerMembership),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_MEMBERSHIP_UPDATE, ({ payload: { id, data } }) =>
      services.updateSchedulerMembership(id, data),
    ),
    takeEvery(
      EntryActionTypes.SCHEDULER_MEMBERSHIP_UPDATE_HANDLE,
      ({ payload: { schedulerMembership } }) =>
        services.handleSchedulerMembershipUpdate(schedulerMembership),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_MEMBERSHIP_DELETE, ({ payload: { id } }) =>
      services.deleteSchedulerMembership(id),
    ),
    takeEvery(
      EntryActionTypes.SCHEDULER_MEMBERSHIP_DELETE_HANDLE,
      ({ payload: { schedulerMembership } }) =>
        services.handleSchedulerMembershipDelete(schedulerMembership),
    ),
  ]);
}
