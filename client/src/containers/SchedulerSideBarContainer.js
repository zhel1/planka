import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import Sidebar from '../components/Scheduler/components/Sidebar/Sidebar';
import selectors from '../selectors';

const makeMapStateToProps = () => {
  const selectEventsForCurrentScheduler = selectors.makeSelectEventsForCurrentScheduler();
  const selectUsers = selectors.makeSelectUsers();
  const selectLabelsForCurrentScheduler = selectors.makeSelectLabelsForCurrentScheduler();

  return (state, { visible, firstDayCurrentMonth, days }) => {
    const events = selectEventsForCurrentScheduler(state);
    const allUsers = selectUsers(state);
    const allLabels = selectLabelsForCurrentScheduler(state);
    const { selectedDate } = state.ui.schedulerState.data;

    return {
      visible,
      firstDayCurrentMonth,
      selectedDate,
      days,
      events,
      allUsers,
      allLabels,
    };
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(makeMapStateToProps, mapDispatchToProps)(Sidebar);
