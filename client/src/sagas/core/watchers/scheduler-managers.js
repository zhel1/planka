import { all, takeEvery } from 'redux-saga/effects';

import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* schedulerManagersWatchers() {
  yield all([
    takeEvery(EntryActionTypes.MANAGER_IN_CURRENT_SCHEDULER_CREATE, ({ payload: { data } }) =>
      services.createManagerInCurrentScheduler(data),
    ),
    takeEvery(
      EntryActionTypes.SCHEDULER_MANAGER_CREATE_HANDLE,
      ({ payload: { schedulerManager } }) =>
        services.handleSchedulerManagerCreate(schedulerManager),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_MANAGER_DELETE, ({ payload: { id } }) =>
      services.deleteSchedulerManager(id),
    ),
    takeEvery(
      EntryActionTypes.SCHEDULER_MANAGER_DELETE_HANDLE,
      ({ payload: { schedulerManager } }) =>
        services.handleSchedulerManagerDelete(schedulerManager),
    ),
  ]);
}
