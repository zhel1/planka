import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import selectors from '../selectors';
import entryActions from '../entry-actions';
import { SchedulerMembershipRoles } from '../constants/Enums';
import SchedulerActions from '../components/SchedulerActions';

const mapStateToProps = (state) => {
  const allUsers = selectors.selectUsers(state);
  const isCurrentUserManager = selectors.selectIsCurrentUserManagerForCurrentScheduler(state);
  const memberships = selectors.selectMembershipsForCurrentScheduler(state);
  const labels = selectors.selectLabelsForCurrentScheduler(state);
  const filterUsers = selectors.selectFilterUsersForCurrentScheduler(state);
  const filterLabels = selectors.selectFilterSchedulerLabelsForCurrentScheduler(state);
  const currentUserMembership = selectors.selectCurrentUserMembershipForCurrentScheduler(state);

  const isCurrentUserEditor =
    !!currentUserMembership && currentUserMembership.role === SchedulerMembershipRoles.EDITOR;

  return {
    memberships,
    labels,
    filterUsers,
    filterLabels,
    allUsers,
    canEdit: isCurrentUserEditor,
    canEditMemberships: isCurrentUserManager,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onMembershipCreate: entryActions.createMembershipInCurrentScheduler,
      onMembershipUpdate: entryActions.updateSchedulerMembership,
      onMembershipDelete: entryActions.deleteSchedulerMembership,
      onUserToFilterAdd: entryActions.addUserToFilterInCurrentScheduler,
      onUserFromFilterRemove: entryActions.removeUserFromFilterInCurrentScheduler,
      onLabelToFilterAdd: entryActions.addLabelToFilterInCurrentScheduler,
      onLabelFromFilterRemove: entryActions.removeLabelFromFilterInCurrentScheduler,
      onLabelCreate: entryActions.createSchedulerLabelInCurrentScheduler, // TODO*
      onLabelUpdate: entryActions.updateSchedulerLabel, // TODO*
      onLabelMove: entryActions.moveSchedulerLabel, // TODO*
      onLabelDelete: entryActions.deleteSchedulerLabel, // TODO*
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerActions);
