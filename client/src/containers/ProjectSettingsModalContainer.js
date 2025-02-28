import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import selectors from '../selectors';
import entryActions from '../entry-actions';
import ServiceSettingsModal from '../components/ServiceSettingsModal';
import ServiceTypes from '../constants/ServiceTypes';

const mapStateToProps = (state) => {
  const users = selectors.selectUsers(state);

  const { name, background, backgroundImage, isBackgroundImageUpdating } =
    selectors.selectCurrentProject(state);

  const managers = selectors.selectManagersForCurrentProject(state);

  const serviceType = ServiceTypes.KANBAN;

  return {
    serviceType,
    name,
    background,
    backgroundImage,
    isBackgroundImageUpdating,
    managers,
    allUsers: users,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onUpdate: entryActions.updateCurrentProject,
      onBackgroundImageUpdate: entryActions.updateCurrentProjectBackgroundImage,
      onDelete: entryActions.deleteCurrentProject,
      onManagerCreate: entryActions.createManagerInCurrentProject,
      onManagerDelete: entryActions.deleteProjectManager,
      onClose: entryActions.closeModal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ServiceSettingsModal);
