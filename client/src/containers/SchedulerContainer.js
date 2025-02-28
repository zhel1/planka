import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import Scheduler from '../components/Scheduler';
import selectors from '../selectors';
import entryActions from '../entry-actions';

const mapStateToProps = (state) => {
  const { schedulerEventId } = selectors.selectPath(state);

  const events = selectors.selectEventsForCurrentScheduler(state);
  const { firstDayOfCurrentDisplayedMonth } = state.ui.schedulerState.data;

  return {
    events,
    firstDayOfCurrentDisplayedMonth,
    isEventModalOpened: !!schedulerEventId,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onSchedulerStateUpdate: entryActions.updateSchedulerState,
      onEventUpdate: entryActions.updateSchedulerEvent,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
