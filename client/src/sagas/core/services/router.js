import { call, put, select, take } from 'redux-saga/effects';
import { push } from '../../../lib/redux-router';

import { logout } from './core';
import request from '../request';
import selectors from '../../../selectors';
import actions from '../../../actions';
import api from '../../../api';
import { getAccessToken } from '../../../utils/access-token-storage';
import ActionTypes from '../../../constants/ActionTypes';
import Paths from '../../../constants/Paths';
import mergeRecords from '../../../utils/merge-records';

export function* goToRoot() {
  yield put(push(Paths.ROOT));
}

export function* goToProject(projectId) {
  yield put(push(Paths.PROJECTS.replace(':id', projectId)));
}

export function* goToBoard(boardId) {
  yield put(push(Paths.BOARDS.replace(':id', boardId)));
}

export function* goToCard(cardId) {
  yield put(push(Paths.CARDS.replace(':id', cardId)));
}

export function* goToScheduler(schedulerId) {
  yield put(push(Paths.SCHEDULERS.replace(':id', schedulerId)));
}

export function* goToEvent(eventId) {
  yield put(push(Paths.EVENTS.replace(':id', eventId)));
}

export function* handleLocationChange() {
  const accessToken = yield call(getAccessToken);

  if (!accessToken) {
    yield call(logout, false);
    return;
  }

  const pathsMatch = yield select(selectors.selectPathsMatch);

  if (!pathsMatch) {
    return;
  }

  switch (pathsMatch.pattern.path) {
    case Paths.LOGIN:
    case Paths.OIDC_CALLBACK:
      yield call(goToRoot);

      return;
    default:
  }

  const isInitializing = yield select(selectors.selectIsInitializing);

  if (isInitializing) {
    yield take(ActionTypes.CORE_INITIALIZE);
  }

  let board;
  let users1;
  let projects;
  let boardMemberships;
  let labels;
  let lists;
  let cards;
  let cardMemberships;
  let cardLabels;
  let tasks;
  let attachments;
  let deletedNotifications;

  let scheduler;
  let users2;
  let schedulerManagers;
  let schedulerMemberships;
  let schedulerLabels;
  let schedulerEvents;

  switch (pathsMatch.pattern.path) {
    case Paths.BOARDS:
    case Paths.CARDS: {
      const currentBoard = yield select(selectors.selectCurrentBoard);

      if (currentBoard && currentBoard.isFetching === null) {
        yield put(actions.handleLocationChange.fetchBoard(currentBoard.id));

        try {
          ({
            item: board,
            included: {
              users1,
              projects,
              boardMemberships,
              labels,
              lists,
              cards,
              cardMemberships,
              cardLabels,
              tasks,
              attachments,
            },
          } = yield call(request, api.getBoard, currentBoard.id, true));
        } catch (error) {} // eslint-disable-line no-empty
      }

      if (pathsMatch.pattern.path === Paths.CARDS) {
        const notificationIds = yield select(selectors.selectNotificationIdsForCurrentCard);

        if (notificationIds && notificationIds.length > 0) {
          try {
            ({ items: deletedNotifications } = yield call(
              request,
              api.updateNotifications,
              notificationIds,
              {
                isRead: true,
              },
            ));
          } catch (error) {} // eslint-disable-line no-empty
        }
      }

      break;
    }
    case Paths.SCHEDULERS: {
      const currentScheduler = yield select(selectors.selectCurrentScheduler);
      // TODO* check isFetching
      if (currentScheduler && currentScheduler.isFetching === null) {
        yield put(actions.handleLocationChange.fetchScheduler(currentScheduler.id));

        try {
          ({
            item: scheduler,
            included: {
              users2,
              schedulerManagers,
              schedulerMemberships,
              schedulerLabels,
              schedulerEvents,
              // lists,
              // cards,
              // cardMemberships,
              // cardLabels,
              // tasks,
              // attachments,
            },
          } = yield call(request, api.getScheduler, currentScheduler.id));
        } catch (error) {
          console.log('SHEDULER-API', error);
        } // eslint-disable-line no-empty
      }
      break;
    }
    default:
  }

  yield put(
    actions.handleLocationChange(
      scheduler,
      schedulerManagers,
      schedulerMemberships,
      schedulerLabels,
      schedulerEvents,
      board,
      mergeRecords(users1, users2),
      projects,
      boardMemberships,
      labels,
      lists,
      cards,
      cardMemberships,
      cardLabels,
      tasks,
      attachments,
      deletedNotifications,
    ),
  );
}

export default {
  goToRoot,
  goToProject,
  goToBoard,
  goToCard,
  goToScheduler,
  handleLocationChange,
};
