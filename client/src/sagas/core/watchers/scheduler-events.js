import { all, takeEvery } from 'redux-saga/effects';

import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* eventsWatchers() {
  yield all([
    takeEvery(EntryActionTypes.SCHEDULER_EVENT_CREATE, ({ payload: { data, autoOpen } }) =>
      services.createSchedulerEvent(data, autoOpen),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_EVENT_CREATE_HANDLE, ({ payload: { schedulerEvent } }) =>
      services.handleSchedulerEventCreate(schedulerEvent),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_EVENT_UPDATE, ({ payload: { id, data } }) =>
      services.updateSchedulerEvent(id, data),
    ),
    takeEvery(EntryActionTypes.CURRENT_SCHEDULER_EVENT_UPDATE, ({ payload: { data } }) =>
      services.updateCurrentSchedulerEvent(data),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_EVENT_UPDATE_HANDLE, ({ payload: { schedulerEvent } }) =>
      services.handleSchedulerEventUpdate(schedulerEvent),
    ),
    // takeEvery(EntryActionTypes.CARD_MOVE, ({ payload: { id, listId, index } }) =>
    //   services.moveCard(id, listId, index),
    // ),
    // takeEvery(EntryActionTypes.CURRENT_CARD_MOVE, ({ payload: { listId, index } }) =>
    //   services.moveCurrentCard(listId, index),
    // ),
    takeEvery(EntryActionTypes.SCHEDULER_EVENT_TRANSFER, ({ payload: { id, schedulerId } }) =>
      services.transferSchedulerEvent(id, schedulerId),
    ),
    takeEvery(EntryActionTypes.CURRENT_SCHEDULER_EVENT_TRANSFER, ({ payload: { schedulerId } }) =>
      services.transferCurrentSchedulerEvent(schedulerId),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_EVENT_DELETE, ({ payload: { id } }) =>
      services.deleteSchedulerEvent(id),
    ),
    takeEvery(EntryActionTypes.CURRENT_SCHEDULER_EVENT_DELETE, () =>
      services.deleteCurrentSchedulerEvent(),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_EVENT_DELETE_HANDLE, ({ payload: { schedulerEvent } }) =>
      services.handleSchedulerEventDelete(schedulerEvent),
    ),
  ]);
}
