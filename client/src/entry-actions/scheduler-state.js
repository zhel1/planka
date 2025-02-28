import EntryActionTypes from '../constants/EntryActionTypes';

const updateSchedulerState = (data) => ({
  type: EntryActionTypes.SCHEDULER_STATE_UPDATE,
  payload: {
    data,
  },
});

export default {
  updateSchedulerState,
};
