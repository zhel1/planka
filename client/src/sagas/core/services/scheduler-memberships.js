import { call, put, select } from 'redux-saga/effects';

import { goToRoot } from './router';
import request from '../request';
import selectors from '../../../selectors';
import actions from '../../../actions';
import api from '../../../api';
import { createLocalId } from '../../../utils/local-id';

export function* createSchedulerMembership(schedulerId, data) {
  const localId = yield call(createLocalId);

  yield put(
    actions.createSchedulerMembership({
      ...data,
      schedulerId,
      id: localId,
    }),
  );

  let schedulerMembership;
  try {
    ({ item: schedulerMembership } = yield call(
      request,
      api.createSchedulerMembership,
      schedulerId,
      data,
    ));
  } catch (error) {
    yield put(actions.createSchedulerMembership.failure(localId, error));
    return;
  }

  yield put(actions.createSchedulerMembership.success(localId, schedulerMembership));
}

export function* createMembershipInCurrentScheduler(data) {
  const { schedulerId } = yield select(selectors.selectPath);

  yield call(createSchedulerMembership, schedulerId, data);
}

export function* handleSchedulerMembershipCreate(schedulerMembership) {
  const currentUserId = yield select(selectors.selectCurrentUserId);
  const isCurrentUser = schedulerMembership.userId === currentUserId;

  let user;
  // let project;
  let scheduler;
  // let board;
  let users; // TODO*
  // let users2;
  // let projectManagers;
  let schedulerManagers;
  let schedulerMemberships;
  let schedulerLabels;
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
      actions.handleSchedulerMembershipCreate.fetchScheduler(
        schedulerMembership.schedulerId,
        currentUserId,
      ),
    );

    try {
      ({
        item: scheduler,
        included: { users, schedulerManagers, schedulerMemberships, schedulerLabels },
      } = yield call(request, api.getScheduler, schedulerMembership.schedulerId));
    } catch {
      return;
    }
  } else {
    try {
      ({ item: user } = yield call(request, api.getUser, schedulerMembership.userId));
    } catch {
      return;
    }
  }

  yield put(
    actions.handleSchedulerMembershipCreate(
      schedulerMembership,
      scheduler,
      // board,
      isCurrentUser ? users : [user],
      schedulerManagers,
      schedulerMemberships,
      schedulerLabels,
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

export function* updateSchedulerMembership(id, data) {
  yield put(actions.updateSchedulerMembership(id, data));

  let schedulerMembership;
  try {
    ({ item: schedulerMembership } = yield call(request, api.updateSchedulerMembership, id, data));
  } catch (error) {
    yield put(actions.updateSchedulerMembership.failure(id, error));
    return;
  }

  yield put(actions.updateSchedulerMembership.success(schedulerMembership));
}

export function* handleSchedulerMembershipUpdate(boardMembership) {
  yield put(actions.handleSchedulerMembershipUpdate(boardMembership));
}

export function* deleteSchedulerMembership(id) {
  let schedulerMembership = yield select(selectors.selectSchedulerMembershipById, id);

  const currentUserId = yield select(selectors.selectCurrentUserId);
  const { schedulerId } = yield select(selectors.selectPath);

  if (
    schedulerMembership.userId === currentUserId &&
    schedulerMembership.schedulerId === schedulerId
  ) {
    const isCurrentUserManager = yield select(
      selectors.selectIsCurrentUserManagerForCurrentScheduler,
    );

    if (!isCurrentUserManager) {
      yield call(goToRoot);
    }
  }

  yield put(actions.deleteSchedulerMembership(id));

  try {
    ({ item: schedulerMembership } = yield call(request, api.deleteSchedulerMembership, id));
  } catch (error) {
    yield put(actions.deleteSchedulerMembership.failure(id, error));
    return;
  }

  yield put(actions.deleteSchedulerMembership.success(schedulerMembership));
}

export function* handleSchedulerMembershipDelete(schedulerMembership) {
  const currentUserId = yield select(selectors.selectCurrentUserId);
  const { schedulerId } = yield select(selectors.selectPath);

  if (
    schedulerMembership.userId === currentUserId &&
    schedulerMembership.schedulerId === schedulerId
  ) {
    const isCurrentUserManager = yield select(
      selectors.selectIsCurrentUserManagerForCurrentScheduler,
    );

    if (!isCurrentUserManager) {
      yield call(goToRoot);
    }
  }

  yield put(actions.handleSchedulerMembershipDelete(schedulerMembership));
}

export default {
  createSchedulerMembership,
  createMembershipInCurrentScheduler,
  handleSchedulerMembershipCreate,
  updateSchedulerMembership,
  handleSchedulerMembershipUpdate,
  deleteSchedulerMembership,
  handleSchedulerMembershipDelete,
};
