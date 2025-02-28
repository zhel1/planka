import EntryActionTypes from '../constants/EntryActionTypes';

const createSchedulerLabelInCurrentScheduler = (data) => ({
  type: EntryActionTypes.SCHEDULER_LABEL_IN_CURRENT_SCHEDULER_CREATE,
  payload: {
    data,
  },
});

const handleSchedulerLabelCreate = (schedulerLabel) => ({
  type: EntryActionTypes.SCHEDULER_LABEL_CREATE_HANDLE,
  payload: {
    schedulerLabel,
  },
});

const updateSchedulerLabel = (id, data) => ({
  type: EntryActionTypes.SCHEDULER_LABEL_UPDATE,
  payload: {
    id,
    data,
  },
});

const handleSchedulerLabelUpdate = (schedulerLabel) => ({
  type: EntryActionTypes.SCHEDULER_LABEL_UPDATE_HANDLE,
  payload: {
    schedulerLabel,
  },
});

const moveSchedulerLabel = (id, index) => ({
  type: EntryActionTypes.SCHEDULER_LABEL_MOVE,
  payload: {
    id,
    index,
  },
});

const deleteSchedulerLabel = (id) => ({
  type: EntryActionTypes.SCHEDULER_LABEL_DELETE,
  payload: {
    id,
  },
});

const handleSchedulerLabelDelete = (schedulerLabel) => ({
  type: EntryActionTypes.SCHEDULER_LABEL_DELETE_HANDLE,
  payload: {
    schedulerLabel,
  },
});

// const addLabelToCard = (id, cardId) => ({
//   type: EntryActionTypes.LABEL_TO_CARD_ADD,
//   payload: {
//     id,
//     cardId,
//   },
// });
//
// const addLabelToCurrentCard = (id) => ({
//   type: EntryActionTypes.LABEL_TO_CURRENT_CARD_ADD,
//   payload: {
//     id,
//   },
// });
//
// const handleLabelToCardAdd = (cardLabel) => ({
//   type: EntryActionTypes.LABEL_TO_CARD_ADD_HANDLE,
//   payload: {
//     cardLabel,
//   },
// });
//
// const removeLabelFromCard = (id, cardId) => ({
//   type: EntryActionTypes.LABEL_FROM_CARD_REMOVE,
//   payload: {
//     id,
//     cardId,
//   },
// });
//
// const removeLabelFromCurrentCard = (id) => ({
//   type: EntryActionTypes.LABEL_FROM_CURRENT_CARD_REMOVE,
//   payload: {
//     id,
//   },
// });
//
// const handleLabelFromCardRemove = (cardLabel) => ({
//   type: EntryActionTypes.LABEL_FROM_CARD_REMOVE_HANDLE,
//   payload: {
//     cardLabel,
//   },
// });

const addLabelToFilterInCurrentScheduler = (id) => ({
  type: EntryActionTypes.SCHEDULER_LABEL_TO_FILTER_IN_CURRENT_SCHEDULER_ADD,
  payload: {
    id,
  },
});

const removeLabelFromFilterInCurrentScheduler = (id) => ({
  type: EntryActionTypes.SCHEDULER_LABEL_FROM_FILTER_IN_CURRENT_SCHEDULER_REMOVE,
  payload: {
    id,
  },
});

export default {
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
  addLabelToFilterInCurrentScheduler,
  removeLabelFromFilterInCurrentScheduler,
};
