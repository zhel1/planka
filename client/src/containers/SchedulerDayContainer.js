import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { SchedulerMembershipRoles } from '../constants/Enums';
import entryActions from '../entry-actions';
import { updateSchedulerState } from '../sagas/core/services/scheduler-state';
import selectors from '../selectors';
import Day from '../components/Scheduler/components/Day/Day';

const makeMapStateToProps = () => {
  const selectLabelsForCurrentScheduler = selectors.makeSelectLabelsForCurrentScheduler();

  return (state, { day, firstDayCurrentMonth, detailedEvents }) => {
    const allLabels = selectLabelsForCurrentScheduler(state);
    const currentUserMembership = selectors.selectCurrentUserMembershipForCurrentScheduler(state);
    const isCurrentUserEditor =
      !!currentUserMembership && currentUserMembership.role === SchedulerMembershipRoles.EDITOR;
    const { selectedDate } = state.ui.schedulerState.data;

    return {
      day,
      firstDayCurrentMonth,
      selectedDate,
      detailedEvents,
      allLabels,
      canEdit: isCurrentUserEditor,
    };
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onSchedulerStateUpdate: entryActions.updateSchedulerState,
      onLabelCreate: entryActions.createSchedulerLabelInCurrentScheduler,
      onLabelUpdate: entryActions.updateSchedulerLabel,
      onLabelMove: entryActions.moveSchedulerLabel,
      onLabelDelete: entryActions.deleteSchedulerLabel,
      onEventCreate: entryActions.createSchedulerEvent,
    },
    dispatch,
  );

export default connect(makeMapStateToProps, mapDispatchToProps)(Day);
