import { call, put, select } from 'redux-saga/effects';

import request from '../request';
import selectors from '../../../selectors';
import actions from '../../../actions';
import api from '../../../api';
import { createLocalId } from '../../../utils/local-id';
import mergeRecords from '../../../utils/merge-records';

export function* createSchedulerManager(schedulerId, data) {
  const localId = yield call(createLocalId);

  yield put(
    actions.createSchedulerManager({
      ...data,
      schedulerId,
      id: localId,
    }),
  );

  let schedulerManager;
  try {
    ({ item: schedulerManager } = yield call(
      request,
      api.createSchedulerManager,
      schedulerId,
      data,
    ));
  } catch (error) {
    yield put(actions.createSchedulerManager.failure(localId, error));
    return;
  }

  yield put(actions.createSchedulerManager.success(localId, schedulerManager));
}

export function* createManagerInCurrentScheduler(data) {
  const { schedulerId } = yield select(selectors.selectPath);

  yield call(createSchedulerManager, schedulerId, data);
}

export function* handleSchedulerManagerCreate(schedulerManager) {
  const currentUserId = yield select(selectors.selectCurrentUserId);
  const isCurrentUser = schedulerManager.userId === currentUserId;

  let user;
  // let project;
  let scheduler;
  // let board;
  let users1; // TODO*
  let users2;
  // let projectManagers;
  let schedulerLabels;
  let schedulerEvents;
  let schedulerManagers;
  let schedulerMemberships;
  // let boards;
  // let boardMemberships1;
  // let boardMemberships2;
  // let labels;
  // let lists;
  // let cards;
  // let cardMemberships;
  // let cardLabels;
  // let tasks;
  // let attachments;
  // let deletedNotifications;

  if (isCurrentUser) {
    yield put(
      actions.handleSchedulerManagerCreate.fetchScheduler(
        schedulerManager.schedulerId,
        currentUserId,
      ),
    );

    try {
      ({
        item: scheduler,
        included: {
          users: users1,
          schedulerManagers,
          schedulerMemberships,
          schedulerLabels,
          schedulerEvents,
        },
      } = yield call(request, api.getScheduler, schedulerManager.schedulerId));
    } catch {
      return;
    }
  } else {
    try {
      ({ item: user } = yield call(request, api.getUser, schedulerManager.userId));
    } catch {
      return;
    }
  }

  yield put(
    actions.handleSchedulerManagerCreate(
      schedulerManager,
      scheduler,
      // board,
      isCurrentUser ? mergeRecords(users1, users2) : [user],
      schedulerManagers,
      schedulerMemberships,
      schedulerLabels,
      schedulerEvents,
      // boards,
      // mergeRecords(boardMemberships1, boardMemberships2),
      // labels,
      // lists,
      // cards,
      // cardMemberships,
      // cardLabels,
      // tasks,
      // attachments,
      // deletedNotifications,
    ),
  );
}

export function* deleteSchedulerManager(id) {
  let schedulerManager = yield select(selectors.selectSchedulerManagerById, id);

  const currentUserId = yield select(selectors.selectCurrentUserId);
  const { schedulerId } = yield select(selectors.selectPath);

  yield put(
    actions.deleteSchedulerManager(
      id,
      schedulerManager.userId === currentUserId,
      schedulerManager.schedulerId === schedulerId,
    ),
  );

  try {
    ({ item: schedulerManager } = yield call(request, api.deleteSchedulerManager, id));
  } catch (error) {
    yield put(actions.deleteSchedulerManager.failure(id, error));
    return;
  }

  yield put(actions.deleteSchedulerManager.success(schedulerManager));
}

export function* handleSchedulerManagerDelete(schedulerManager) {
  const currentUserId = yield select(selectors.selectCurrentUserId);
  const { schedulerId } = yield select(selectors.selectPath);

  yield put(
    actions.handleSchedulerManagerDelete(
      schedulerManager,
      schedulerManager.userId === currentUserId,
      schedulerManager.schedulerId === schedulerId,
    ),
  );
}

export default {
  createSchedulerManager,
  createManagerInCurrentScheduler,
  handleSchedulerManagerCreate,
  deleteSchedulerManager,
  handleSchedulerManagerDelete,
};
