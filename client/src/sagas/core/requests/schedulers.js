import { call, select } from 'redux-saga/effects';

import request from '../request';
import selectors from '../../../selectors';
import api from '../../../api';
import Paths from '../../../constants/Paths';

export function* fetchSchedulerByCurrentPath() {
  const pathsMatch = yield select(selectors.selectPathsMatch);

  let scheduler;
  let schedulerEvent;
  let schedulerLabels;
  let users;
  let schedulerManagers;
  let schedulerMemberships;
  let schedulerEvents;
  // let board;
  // let card;
  // let projects;
  // let boardMemberships;
  // let labels;
  // let lists;
  // let cards;
  // let cardMemberships;
  // let cardLabels;
  // let tasks;
  // let attachments;

  if (pathsMatch) {
    let schedulerId;
    if (pathsMatch.pattern.path === Paths.SCHEDULERS) {
      schedulerId = pathsMatch.params.id;
    } else if (pathsMatch.pattern.path === Paths.EVENTS) {
      ({
        item: schedulerEvent,
        item: { schedulerId },
      } = yield call(request, api.getSchedulerEvent, pathsMatch.params.id));
    }

    if (schedulerId) {
      ({
        item: scheduler,
        included: {
          users,
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
      } = yield call(request, api.getScheduler, schedulerId));
    }
  }

  return {
    users,
    scheduler,
    schedulerEvent,
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
  };
}

export default {
  fetchSchedulerByCurrentPath,
};
