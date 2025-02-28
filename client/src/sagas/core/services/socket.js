import { call, put, select } from 'redux-saga/effects';

import requests from '../requests';
import selectors from '../../../selectors';
import actions from '../../../actions';

export function* handleSocketDisconnect() {
  yield put(actions.handleSocketDisconnect());
}

export function* handleSocketReconnect() {
  const currentUserId = yield select(selectors.selectCurrentUserId);
  const { boardId } = yield select(selectors.selectPath);

  yield put(actions.handleSocketReconnect.fetchCore(currentUserId, boardId));

  let user;
  let board;
  let scheduler;
  let users;
  let schedulers;
  let schedulerManagers;
  let schedulerMemberships;
  let schedulerLabels;
  let projects;
  let projectManagers;
  let boards;
  let boardMemberships;
  let labels;
  let lists;
  let cards;
  let cardMemberships;
  let cardLabels;
  let tasks;
  let attachments;
  let activities;
  let notifications;

  try {
    ({
      user,
      board,
      scheduler,
      users,
      schedulers,
      schedulerManagers,
      schedulerMemberships,
      schedulerLabels,
      projects,
      projectManagers,
      boards,
      boardMemberships,
      labels,
      lists,
      cards,
      cardMemberships,
      cardLabels,
      tasks,
      attachments,
      activities,
      notifications,
    } = yield call(requests.fetchCore));
  } catch (error) {
    return;
  }

  yield put(
    actions.handleSocketReconnect(
      user,
      board,
      scheduler,
      users,
      schedulers,
      schedulerManagers,
      schedulerMemberships,
      schedulerLabels,
      projects,
      projectManagers,
      boards,
      boardMemberships,
      labels,
      lists,
      cards,
      cardMemberships,
      cardLabels,
      tasks,
      attachments,
      activities,
      notifications,
    ),
  );
}

export default {
  handleSocketDisconnect,
  handleSocketReconnect,
};
