import { put } from 'redux-saga/effects';
import actions from '../../../actions';

export function* updateSchedulerState(data) {
  yield put(actions.updateSchedulerState(data));
}

export default {
  updateSchedulerState,
};
