import { call, put, select } from 'redux-saga/effects';

import { goToRoot, goToScheduler } from './router';
import request from '../request';
import actions from '../../../actions';
import api from '../../../api';
import selectors from '../../../selectors';

export function* createScheduler(data) {
  yield put(actions.createScheduler(data));

  let scheduler;
  let schedulerManagers;

  try {
    ({
      item: scheduler,
      included: { schedulerManagers },
    } = yield call(request, api.createScheduler, data));
  } catch (error) {
    yield put(actions.createScheduler.failure(error));
    return;
  }

  yield put(actions.createScheduler.success(scheduler, schedulerManagers));
  yield call(goToScheduler, scheduler.id);
}

export function* handleSchedulerCreate({ id }) {
  let scheduler;
  let users;
  let schedulerManagers;
  let schedulerMemberships;
  let schedulerLabels;
  let schedulerEvents;

  try {
    ({
      item: scheduler,
      included: {
        users,
        schedulerManagers,
        schedulerMemberships,
        schedulerLabels,
        schedulerEvents,
      },
    } = yield call(request, api.getScheduler, id));
  } catch (error) {
    return;
  }

  yield put(
    actions.handleSchedulerCreate(
      scheduler,
      users,
      schedulerManagers,
      schedulerMemberships,
      schedulerLabels,
      schedulerEvents,
    ),
  );
}

export function* updateScheduler(id, data) {
  yield put(actions.updateScheduler(id, data));

  let scheduler;
  try {
    ({ item: scheduler } = yield call(request, api.updateScheduler, id, data));
  } catch (error) {
    yield put(actions.updateScheduler.failure(id, error));
    return;
  }

  yield put(actions.updateScheduler.success(scheduler));
}

export function* updateCurrentScheduler(data) {
  const { schedulerId } = yield select(selectors.selectPath);

  yield call(updateScheduler, schedulerId, data);
}

export function* handleSchedulerUpdate(scheduler) {
  yield put(actions.handleSchedulerUpdate(scheduler));
}

export function* updateSchedulerBackgroundImage(id, data) {
  yield put(actions.updateSchedulerBackgroundImage(id));

  let scheduler;
  try {
    ({ item: scheduler } = yield call(request, api.updateSchedulerBackgroundImage, id, data));
  } catch (error) {
    yield put(actions.updateSchedulerBackgroundImage.failure(id, error));
    return;
  }

  yield put(actions.updateSchedulerBackgroundImage.success(scheduler));
}

export function* updateCurrentSchedulerBackgroundImage(data) {
  const { schedulerId } = yield select(selectors.selectPath);

  yield call(updateSchedulerBackgroundImage, schedulerId, data);
}

export function* deleteScheduler(id) {
  const { schedulerId } = yield select(selectors.selectPath);

  if (id === schedulerId) {
    yield call(goToRoot);
  }

  yield put(actions.deleteScheduler(id));

  let scheduler;
  try {
    ({ item: scheduler } = yield call(request, api.deleteScheduler, id));
  } catch (error) {
    yield put(actions.deleteScheduler.failure(id, error));
    return;
  }

  yield put(actions.deleteScheduler.success(scheduler));
}

export function* deleteCurrentScheduler() {
  const { schedulerId } = yield select(selectors.selectPath);

  yield call(deleteScheduler, schedulerId);
}

export function* handleSchedulerDelete(scheduler) {
  const { schedulerId } = yield select(selectors.selectPath);

  if (scheduler.id === schedulerId) {
    yield call(goToRoot);
  }

  yield put(actions.handleSchedulerDelete(scheduler));
}

export default {
  createScheduler,
  handleSchedulerCreate,
  updateScheduler,
  updateCurrentScheduler,
  handleSchedulerUpdate,
  updateSchedulerBackgroundImage,
  updateCurrentSchedulerBackgroundImage,
  deleteScheduler,
  deleteCurrentScheduler,
  handleSchedulerDelete,
};
