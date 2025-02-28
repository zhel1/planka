import { call, put, select } from 'redux-saga/effects';

import request from '../request';
import selectors from '../../../selectors';
import actions from '../../../actions';
import api from '../../../api';
import { createLocalId } from '../../../utils/local-id';

export function* createSchedulerLabel(schedulerId, data) {
  const nextData = {
    ...data,
    position: yield select(selectors.selectNextSchedulerLabelPosition, schedulerId),
  };

  const localId = yield call(createLocalId);

  yield put(
    actions.createSchedulerLabel({
      ...nextData,
      schedulerId,
      id: localId,
    }),
  );

  let label;
  try {
    ({ item: label } = yield call(request, api.createSchedulerLabel, schedulerId, nextData));
  } catch (error) {
    yield put(actions.createSchedulerLabel.failure(localId, error));
    return;
  }

  yield put(actions.createSchedulerLabel.success(localId, label));
}

export function* createSchedulerLabelInCurrentScheduler(data) {
  const { schedulerId } = yield select(selectors.selectPath);

  yield call(createSchedulerLabel, schedulerId, data);
}

export function* handleSchedulerLabelCreate(label) {
  yield put(actions.handleSchedulerLabelCreate(label));
}

export function* updateSchedulerLabel(id, data) {
  yield put(actions.updateSchedulerLabel(id, data));

  let label;
  try {
    ({ item: label } = yield call(request, api.updateSchedulerLabel, id, data));
  } catch (error) {
    yield put(actions.updateSchedulerLabel.failure(id, error));
    return;
  }

  yield put(actions.updateSchedulerLabel.success(label));
}

export function* handleSchedulerLabelUpdate(label) {
  yield put(actions.handleSchedulerLabelUpdate(label));
}

export function* moveSchedulerLabel(id, index) {
  const { schedulerId } = yield select(selectors.selectSchedulerLabelById, id);
  const position = yield select(selectors.selectNextSchedulerLabelPosition, schedulerId, index, id);

  yield call(updateSchedulerLabel, id, {
    position,
  });
}

export function* deleteSchedulerLabel(id) {
  yield put(actions.deleteSchedulerLabel(id));

  let label;
  try {
    ({ item: label } = yield call(request, api.deleteSchedulerLabel, id));
  } catch (error) {
    yield put(actions.deleteSchedulerLabel.failure(id, error));
    return;
  }

  yield put(actions.deleteSchedulerLabel.success(label));
}

export function* handleSchedulerLabelDelete(label) {
  yield put(actions.handleSchedulerLabelDelete(label));
}

// export function* addLabelToCard(id, cardId) {
//   yield put(actions.addLabelToCard(id, cardId));
//
//   let cardLabel;
//   try {
//     ({ item: cardLabel } = yield call(request, api.createCardLabel, cardId, {
//       labelId: id,
//     }));
//   } catch (error) {
//     yield put(actions.addLabelToCard.failure(id, cardId, error));
//     return;
//   }
//
//   yield put(actions.addLabelToCard.success(cardLabel));
// }
//
// export function* addLabelToCurrentCard(id) {
//   const { cardId } = yield select(selectors.selectPath);
//
//   yield call(addLabelToCard, id, cardId);
// }
//
// export function* handleLabelToCardAdd(cardLabel) {
//   yield put(actions.handleLabelToCardAdd(cardLabel));
// }
//
// export function* removeLabelFromCard(id, cardId) {
//   yield put(actions.removeLabelFromCard(id, cardId));
//
//   let cardLabel;
//   try {
//     ({ item: cardLabel } = yield call(request, api.deleteCardLabel, cardId, id));
//   } catch (error) {
//     yield put(actions.removeLabelFromCard.failure(id, cardId, error));
//     return;
//   }
//
//   yield put(actions.removeLabelFromCard.success(cardLabel));
// }
//
// export function* removeLabelFromCurrentCard(id) {
//   const { cardId } = yield select(selectors.selectPath);
//
//   yield call(removeLabelFromCard, id, cardId);
// }
//
// export function* handleLabelFromCardRemove(cardLabel) {
//   yield put(actions.handleLabelFromCardRemove(cardLabel));
// }

export function* addSchedulerLabelToSchedulerFilter(id, schedulerId) {
  yield put(actions.addSchedulerLabelToSchedulerFilter(id, schedulerId));
}

export function* addSchedulerLabelToFilterInCurrentScheduler(id) {
  const { schedulerId } = yield select(selectors.selectPath);

  yield call(addSchedulerLabelToSchedulerFilter, id, schedulerId);
}

export function* removeSchedulerLabelFromSchedulerFilter(id, schedulerId) {
  yield put(actions.removeSchedulerLabelFromSchedulerFilter(id, schedulerId));
}

export function* removeSchedulerLabelFromFilterInCurrentScheduler(id) {
  const { schedulerId } = yield select(selectors.selectPath);

  yield call(removeSchedulerLabelFromSchedulerFilter, id, schedulerId);
}

export default {
  createSchedulerLabel,
  createSchedulerLabelInCurrentScheduler,
  handleSchedulerLabelCreate,
  updateSchedulerLabel,
  handleSchedulerLabelUpdate,
  moveSchedulerLabel,
  deleteSchedulerLabel,
  handleSchedulerLabelDelete,
  // addLabelToCard,
  // addLabelToCurrentCard,
  // handleLabelToCardAdd,
  // removeLabelFromCard,
  // removeLabelFromCurrentCard,
  // handleLabelFromCardRemove,
  addSchedulerLabelToSchedulerFilter,
  addSchedulerLabelToFilterInCurrentScheduler,
  removeSchedulerLabelFromSchedulerFilter,
  removeSchedulerLabelFromFilterInCurrentScheduler,
};
