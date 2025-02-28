import { startOfDay, startOfMonth } from 'date-fns';
import ActionTypes from '../../constants/ActionTypes';
import { createDateAsUTC } from '../../utils/time-convertor';

const initialState = {
  data: {
    selectedDate: createDateAsUTC(startOfDay(new Date())),
    firstDayOfCurrentDisplayedMonth: createDateAsUTC(startOfMonth(new Date())),
  },
};

// eslint-disable-next-line default-param-last
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SCHEDULER_STATE_UPDATE:
      return {
        ...state,
        data: {
          ...state.data,
          ...payload.data,
        },
      };

    default:
      return state;
  }
};
