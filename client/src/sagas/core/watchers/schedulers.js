import { all, takeEvery } from 'redux-saga/effects';

import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* schedulersWatchers() {
  yield all([
    takeEvery(EntryActionTypes.SCHEDULER_CREATE, ({ payload: { data } }) =>
      services.createScheduler(data),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_CREATE_HANDLE, ({ payload: { scheduler } }) =>
      services.handleSchedulerCreate(scheduler),
    ),
    takeEvery(EntryActionTypes.CURRENT_SCHEDULER_UPDATE, ({ payload: { data } }) =>
      services.updateCurrentScheduler(data),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_UPDATE_HANDLE, ({ payload: { scheduler } }) =>
      services.handleSchedulerUpdate(scheduler),
    ),
    takeEvery(EntryActionTypes.CURRENT_SCHEDULER_BACKGROUND_IMAGE_UPDATE, ({ payload: { data } }) =>
      services.updateCurrentSchedulerBackgroundImage(data),
    ),
    takeEvery(EntryActionTypes.CURRENT_SCHEDULER_DELETE, () => services.deleteCurrentScheduler()),
    takeEvery(EntryActionTypes.SCHEDULER_DELETE_HANDLE, ({ payload: { scheduler } }) =>
      services.handleSchedulerDelete(scheduler),
    ),
  ]);
}
