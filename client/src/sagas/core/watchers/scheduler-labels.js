import { all, takeEvery } from 'redux-saga/effects';

import services from '../services';
import EntryActionTypes from '../../../constants/EntryActionTypes';

export default function* labelsWatchers() {
  yield all([
    takeEvery(
      EntryActionTypes.SCHEDULER_LABEL_IN_CURRENT_SCHEDULER_CREATE,
      ({ payload: { data } }) => services.createSchedulerLabelInCurrentScheduler(data),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_LABEL_CREATE_HANDLE, ({ payload: { schedulerLabel } }) =>
      services.handleSchedulerLabelCreate(schedulerLabel),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_LABEL_UPDATE, ({ payload: { id, data } }) =>
      services.updateSchedulerLabel(id, data),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_LABEL_UPDATE_HANDLE, ({ payload: { schedulerLabel } }) =>
      services.handleSchedulerLabelUpdate(schedulerLabel),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_LABEL_MOVE, ({ payload: { id, index } }) =>
      services.moveSchedulerLabel(id, index),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_LABEL_DELETE, ({ payload: { id } }) =>
      services.deleteSchedulerLabel(id),
    ),
    takeEvery(EntryActionTypes.SCHEDULER_LABEL_DELETE_HANDLE, ({ payload: { schedulerLabel } }) =>
      services.handleSchedulerLabelDelete(schedulerLabel),
    ),
    // takeEvery(EntryActionTypes.SCHEDULER_LABEL_TO_CARD_ADD, ({ payload: { id, cardId } }) =>
    //   services.addLabelToCard(id, cardId),
    // ),
    // takeEvery(EntryActionTypes.SCHEDULER_LABEL_TO_CURRENT_CARD_ADD, ({ payload: { id } }) =>
    //   services.addLabelToCurrentCard(id),
    // ),
    // takeEvery(EntryActionTypes.SCHEDULER_LABEL_TO_CARD_ADD_HANDLE, ({ payload: { cardLabel } }) =>
    //   services.handleLabelToCardAdd(cardLabel),
    // ),
    // takeEvery(EntryActionTypes.SCHEDULER_LABEL_FROM_CARD_REMOVE, ({ payload: { id, cardId } }) =>
    //   services.removeLabelFromCard(id, cardId),
    // ),
    // takeEvery(EntryActionTypes.SCHEDULER_LABEL_FROM_CURRENT_CARD_REMOVE, ({ payload: { id } }) =>
    //   services.removeLabelFromCurrentCard(id),
    // ),
    // takeEvery(
    //   EntryActionTypes.SCHEDULER_LABEL_FROM_CARD_REMOVE_HANDLE,
    //   ({ payload: { cardLabel } }) => services.handleLabelFromCardRemove(cardLabel),
    // ),
    takeEvery(
      EntryActionTypes.SCHEDULER_LABEL_TO_FILTER_IN_CURRENT_SCHEDULER_ADD,
      ({ payload: { id } }) => services.addSchedulerLabelToFilterInCurrentScheduler(id),
    ),
    takeEvery(
      EntryActionTypes.SCHEDULER_LABEL_FROM_FILTER_IN_CURRENT_SCHEDULER_REMOVE,
      ({ payload: { id } }) => services.removeSchedulerLabelFromFilterInCurrentScheduler(id),
    ),
  ]);
}
