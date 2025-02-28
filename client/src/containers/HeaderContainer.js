import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import selectors from '../selectors';
import entryActions from '../entry-actions';
import Header from '../components/Header';
import ServiceTypes from '../constants/ServiceTypes';

const mapStateToProps = (state) => {
  const isLogouting = selectors.selectIsLogouting(state);
  const currentUser = selectors.selectCurrentUser(state);
  const notifications = selectors.selectNotificationsForCurrentUser(state);

  let service = selectors.selectCurrentScheduler(state);
  let canEditService;

  if (service) {
    canEditService = selectors.selectIsCurrentUserManagerForCurrentScheduler(state);
  } else {
    service = selectors.selectCurrentProject(state);
    canEditService = selectors.selectIsCurrentUserManagerForCurrentProject(state);
  }

  return {
    notifications,
    isLogouting,
    user: currentUser,
    canEditUsers: currentUser.isAdmin,
    service,
    canEditService,
  };
};

const mapDispatchToProps = (dispatch, { currentService }) => {
  let onServiceSettingsClick = entryActions.openProjectSettingsModal;
  switch (currentService) {
    case ServiceTypes.KANBAN:
      onServiceSettingsClick = entryActions.openProjectSettingsModal;
      break;
    case ServiceTypes.SCHEDULER:
      onServiceSettingsClick = entryActions.openSchedulerSettingsModal;
      break;
    default:
  }

  return bindActionCreators(
    {
      onServiceSettingsClick,
      onUsersClick: entryActions.openUsersModal,
      onNotificationDelete: entryActions.deleteNotification,
      onUserSettingsClick: entryActions.openUserSettingsModal,
      onLogout: entryActions.logout,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
