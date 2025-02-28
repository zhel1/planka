import { all, takeEvery } from 'redux-saga/effects';

import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* schedulerStateWatchers() {
  yield all([
    takeEvery(EntryActionTypes.SCHEDULER_STATE_UPDATE, ({ payload: { data } }) =>
      services.updateSchedulerState(data),
    ),
  ]);
}
