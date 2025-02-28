import { call, put, select } from 'redux-saga/effects';

import { goToEvent, goToScheduler } from './router';
import request from '../request';
import selectors from '../../../selectors';
import actions from '../../../actions';
import api from '../../../api';
import { createLocalId } from '../../../utils/local-id';

export function* createSchedulerEvent(data, autoOpen) {
  const { schedulerId } = yield select(selectors.selectPath);
  const creatorUserId = yield select(selectors.selectCurrentUserId);

  const localId = yield call(createLocalId);

  yield put(
    actions.createSchedulerEvent({
      ...data,
      schedulerId,
      creatorUserId,
      id: localId,
    }),
  );

  let schedulerEvent;
  try {
    ({ item: schedulerEvent } = yield call(request, api.createSchedulerEvent, schedulerId, data));
  } catch (error) {
    yield put(actions.createSchedulerEvent.failure(localId, error));
    return;
  }

  yield put(actions.createSchedulerEvent.success(localId, schedulerEvent));

  if (autoOpen) {
    yield call(goToEvent, schedulerEvent.id);
  }
}

export function* handleSchedulerEventCreate(schedulerEvent) {
  yield put(actions.handleSchedulerEventCreate(schedulerEvent));
}

export function* updateSchedulerEvent(id, data) {
  yield put(actions.updateSchedulerEvent(id, data));

  let schedulerEvent;
  try {
    ({ item: schedulerEvent } = yield call(request, api.updateSchedulerEvent, id, data));
  } catch (error) {
    yield put(actions.updateSchedulerEvent.failure(id, error));
    return;
  }

  yield put(actions.updateSchedulerEvent.success(schedulerEvent));
}

export function* updateCurrentSchedulerEvent(data) {
  const { schedulerEventId } = yield select(selectors.selectPath);

  yield call(updateSchedulerEvent, schedulerEventId, data);
}

// TODO: handle card transfer
export function* handleSchedulerEventUpdate(schedulerEvent) {
  yield put(actions.handleSchedulerEventUpdate(schedulerEvent));
}
//
// export function* moveCard(id, listId, index) {
//   const position = yield select(selectors.selectNextCardPosition, listId, index, id);
//
//   yield call(updateCard, id, {
//     listId,
//     position,
//   });
// }
//
// export function* moveCurrentCard(listId, index) {
//   const { cardId } = yield select(selectors.selectPath);
//
//   yield call(moveCard, cardId, listId, index);
// }

export function* transferSchedulerEvent(id, schedulerId) {
  const { schedulerEventId: currentSchedulerEventId, schedulerId: currentSchedulerId } =
    yield select(selectors.selectPath);

  if (id === currentSchedulerEventId) {
    yield call(goToScheduler, currentSchedulerId);
  }

  yield call(updateSchedulerEvent, id, {
    schedulerId,
  });
}

export function* transferCurrentSchedulerEvent(schedulerId) {
  const { schedulerEventId } = yield select(selectors.selectPath);

  yield call(transferSchedulerEvent, schedulerEventId, schedulerId);
}

export function* deleteSchedulerEvent(id) {
  const { schedulerEventId, schedulerId } = yield select(selectors.selectPath);

  if (id === schedulerEventId) {
    yield call(goToScheduler, schedulerId);
  }

  yield put(actions.deleteSchedulerEvent(id));

  let schedulerEvent;
  try {
    ({ item: schedulerEvent } = yield call(request, api.deleteSchedulerEvent, id));
  } catch (error) {
    yield put(actions.deleteSchedulerEvent.failure(id, error));
    return;
  }

  yield put(actions.deleteSchedulerEvent.success(schedulerEvent));
}

export function* deleteCurrentSchedulerEvent() {
  const { schedulerEventId } = yield select(selectors.selectPath);

  yield call(deleteSchedulerEvent, schedulerEventId);
}

export function* handleSchedulerEventDelete(schedulerEvent) {
  const { schedulerEventId, schedulerId } = yield select(selectors.selectPath);

  if (schedulerEvent.id === schedulerEventId) {
    yield call(goToScheduler, schedulerId);
  }

  yield put(actions.handleSchedulerEventDelete(schedulerEvent));
}

export default {
  createSchedulerEvent,
  handleSchedulerEventCreate,
  updateSchedulerEvent,
  updateCurrentSchedulerEvent,
  // moveCard,
  // moveCurrentCard,
  transferSchedulerEvent,
  transferCurrentSchedulerEvent,
  handleSchedulerEventUpdate,
  deleteSchedulerEvent,
  deleteCurrentSchedulerEvent,
  handleSchedulerEventDelete,
};
