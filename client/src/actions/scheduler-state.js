import ActionTypes from '../constants/ActionTypes';

const updateSchedulerState = (data) => ({
  type: ActionTypes.SCHEDULER_STATE_UPDATE,
  payload: {
    data,
  },
});

export default {
  updateSchedulerState,
};
