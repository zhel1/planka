import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { SchedulerMembershipRoles } from '../constants/Enums';
import selectors from '../selectors';
import Event from '../components/Scheduler/components/Event/Event';

const makeMapStateToProps = () => {
  // const monthIndex = selectors.selectMonthIndex(state);

  const selectSchedulerLabelByEventId = selectors.makeSelectSchedulerLabelByEventId();
  const selectCreatorUserByEventId = selectors.makeSelectCreatorUserByEventId();

  // makeSelectSchedulerLabelByEventId(state)

  return (state, { event, index, duration, locationId }) => {
    const label = selectSchedulerLabelByEventId(state, event.apiEvent.id);
    const user = selectCreatorUserByEventId(state, event.apiEvent.id);

    const currentUserMembership = selectors.selectCurrentUserMembershipForCurrentScheduler(state);
    const isCurrentUserEditor =
      !!currentUserMembership && currentUserMembership.role === SchedulerMembershipRoles.EDITOR;

    return {
      event,
      user,
      index,
      duration,
      locationId,
      label,
      canEdit: isCurrentUserEditor,
    };
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      // onMonthChanged: entryActions.handleMonthIndexChange,
    },
    dispatch,
  );

export default connect(makeMapStateToProps, mapDispatchToProps)(Event);
