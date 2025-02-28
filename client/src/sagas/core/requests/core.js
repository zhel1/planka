import { call } from 'redux-saga/effects';

import { fetchBoardByCurrentPath } from './boards';
import { fetchSchedulerByCurrentPath } from './schedulers';
import request from '../request';
import api from '../../../api';
import mergeRecords from '../../../utils/merge-records';

export function* fetchCore() {
  const { item: user } = yield call(request, api.getCurrentUser, true);
  const { items: users1 } = yield call(request, api.getUsers);

  const {
    items: projects1,
    included: { projectManagers, boards, boardMemberships: boardMemberships1 },
  } = yield call(request, api.getProjects);

  let board;
  let card;
  let users2;
  let projects2;
  let boardMemberships2;
  let labels;
  let lists;
  let cards1;
  let cardMemberships;
  let cardLabels;
  let tasks;
  let attachments;

  try {
    ({
      board,
      card,
      users: users2,
      projects: projects2,
      boardMemberships: boardMemberships2,
      labels,
      lists,
      cards: cards1,
      cardMemberships,
      cardLabels,
      tasks,
      attachments,
    } = yield call(fetchBoardByCurrentPath));
  } catch {} // eslint-disable-line no-empty

  const {
    items: schedulers,
    included: { schedulerManagers, schedulerMemberships /* , schedulerLabels */ }, // TODO* remove schedulerLabels
  } = yield call(request, api.getSchedulers);

  let users3;
  let scheduler;
  let schedulerManagers2;
  let schedulerMemberships2;
  let schedulerLabels;
  let schedulerEvents;

  try {
    ({
      users3,
      scheduler,
      schedulerManagers2,
      schedulerMemberships2,
      schedulerLabels,
      schedulerEvents,
      users: users3,
    } = yield call(fetchSchedulerByCurrentPath));
  } catch {} // eslint-disable-line no-empty

  const body = yield call(request, api.getNotifications);

  let { items: notifications } = body;

  const {
    included: { users: users4, cards: cards2, activities },
  } = body;

  if (card) {
    const notificationIds = notifications.flatMap((notification) =>
      notification.cardId === card.id ? [notification.id] : [],
    );

    if (notificationIds.length > 0) {
      yield call(request, api.updateNotifications, notificationIds, {
        isRead: true,
      });

      notifications = notifications.filter(
        (notification) => !notificationIds.includes(notification.id),
      );
    }
  }

  return {
    user,
    board,
    scheduler,
    projectManagers,
    boards,
    labels,
    lists,
    cardMemberships,
    cardLabels,
    tasks,
    attachments,
    activities,
    notifications,
    schedulers,
    schedulerManagers: mergeRecords(schedulerManagers, schedulerManagers2),
    schedulerMemberships: mergeRecords(schedulerMemberships, schedulerMemberships2),
    schedulerLabels,
    schedulerEvents,
    users: mergeRecords(users1, users2, users3, users4),
    projects: mergeRecords(projects1, projects2),
    boardMemberships: mergeRecords(boardMemberships1, boardMemberships2),
    cards: mergeRecords(cards1, cards2),
  };
}

export default {
  fetchCore,
};
