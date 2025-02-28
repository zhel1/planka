import ActionTypes from '../constants/ActionTypes';

const createSchedulerLabel = (schedulerLabel) => ({
  type: ActionTypes.SCHEDULER_LABEL_CREATE,
  payload: {
    schedulerLabel,
  },
});

createSchedulerLabel.success = (localId, schedulerLabel) => ({
  type: ActionTypes.SCHEDULER_LABEL_CREATE__SUCCESS,
  payload: {
    localId,
    schedulerLabel,
  },
});

createSchedulerLabel.failure = (localId, error) => ({
  type: ActionTypes.SCHEDULER_LABEL_CREATE__FAILURE,
  payload: {
    localId,
    error,
  },
});

const handleSchedulerLabelCreate = (schedulerLabel) => ({
  type: ActionTypes.SCHEDULER_LABEL_CREATE_HANDLE,
  payload: {
    schedulerLabel,
  },
});

const updateSchedulerLabel = (id, data) => ({
  type: ActionTypes.SCHEDULER_LABEL_UPDATE,
  payload: {
    id,
    data,
  },
});

updateSchedulerLabel.success = (schedulerLabel) => ({
  type: ActionTypes.SCHEDULER_LABEL_UPDATE__SUCCESS,
  payload: {
    schedulerLabel,
  },
});

updateSchedulerLabel.failure = (id, error) => ({
  type: ActionTypes.SCHEDULER_LABEL_UPDATE__FAILURE,
  payload: {
    id,
    error,
  },
});

const handleSchedulerLabelUpdate = (schedulerLabel) => ({
  type: ActionTypes.SCHEDULER_LABEL_UPDATE_HANDLE,
  payload: {
    schedulerLabel,
  },
});

const deleteSchedulerLabel = (id) => ({
  type: ActionTypes.SCHEDULER_LABEL_DELETE,
  payload: {
    id,
  },
});

deleteSchedulerLabel.success = (schedulerLabel) => ({
  type: ActionTypes.SCHEDULER_LABEL_DELETE__SUCCESS,
  payload: {
    schedulerLabel,
  },
});

deleteSchedulerLabel.failure = (id, error) => ({
  type: ActionTypes.SCHEDULER_LABEL_DELETE__FAILURE,
  payload: {
    id,
    error,
  },
});

const handleSchedulerLabelDelete = (schedulerLabel) => ({
  type: ActionTypes.SCHEDULER_LABEL_DELETE_HANDLE,
  payload: {
    schedulerLabel,
  },
});

// const addSchedulerLabelToCard = (id, cardId) => ({
//   type: ActionTypes.SCHEDULER_LABEL_TO_CARD_ADD,
//   payload: {
//     id,
//     cardId,
//   },
// });
//
// addSchedulerLabelToCard.success = (cardLabel) => ({
//   type: ActionTypes.SCHEDULER_LABEL_TO_CARD_ADD__SUCCESS,
//   payload: {
//     cardLabel,
//   },
// });
//
// addSchedulerLabelToCard.failure = (id, cardId, error) => ({
//   type: ActionTypes.SCHEDULER_LABEL_TO_CARD_ADD__FAILURE,
//   payload: {
//     id,
//     cardId,
//     error,
//   },
// });
//
// const handleSchedulerLabelToCardAdd = (cardLabel) => ({
//   type: ActionTypes.SCHEDULER_LABEL_TO_CARD_ADD_HANDLE,
//   payload: {
//     cardLabel,
//   },
// });
//
// const removeSchedulerLabelFromCard = (id, cardId) => ({
//   type: ActionTypes.SCHEDULER_LABEL_FROM_CARD_REMOVE,
//   payload: {
//     id,
//     cardId,
//   },
// });
//
// removeLabelSchedulerFromCard.success = (cardLabel) => ({
//   type: ActionTypes.SCHEDULER_LABEL_FROM_CARD_REMOVE__SUCCESS,
//   payload: {
//     cardLabel,
//   },
// });
//
// removeSchedulerLabelFromCard.failure = (id, cardId, error) => ({
//   type: ActionTypes.SCHEDULER_LABEL_FROM_CARD_REMOVE__FAILURE,
//   payload: {
//     id,
//     cardId,
//     error,
//   },
// });
//
// const handleSchedulerLabelFromCardRemove = (cardLabel) => ({
//   type: ActionTypes.SCHEDULER_LABEL_FROM_CARD_REMOVE_HANDLE,
//   payload: {
//     cardLabel,
//   },
// });

const addSchedulerLabelToSchedulerFilter = (id, schedulerId) => ({
  type: ActionTypes.SCHEDULER_LABEL_TO_SCHEDULER_FILTER_ADD,
  payload: {
    id,
    schedulerId,
  },
});

const removeSchedulerLabelFromSchedulerFilter = (id, schedulerId) => ({
  type: ActionTypes.SCHEDULER_LABEL_FROM_SCHEDULER_FILTER_REMOVE,
  payload: {
    id,
    schedulerId,
  },
});

export default {
  createSchedulerLabel,
  handleSchedulerLabelCreate,
  updateSchedulerLabel,
  handleSchedulerLabelUpdate,
  deleteSchedulerLabel,
  handleSchedulerLabelDelete,
  // addLabelToCard,
  // handleLabelToCardAdd,
  // removeLabelFromCard,
  // handleLabelFromCardRemove,
  addSchedulerLabelToSchedulerFilter,
  removeSchedulerLabelFromSchedulerFilter,
};
