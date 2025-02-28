import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import selectors from '../selectors';
import entryActions from '../entry-actions';
import ServiceSettingsModal from '../components/ServiceSettingsModal';
import ServiceTypes from '../constants/ServiceTypes';

const mapStateToProps = (state) => {
  const users = selectors.selectUsers(state);

  const { name, background, backgroundImage, isBackgroundImageUpdating } =
    selectors.selectCurrentScheduler(state);

  const managers = selectors.selectManagersForCurrentScheduler(state);

  const serviceType = ServiceTypes.SCHEDULER;

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
      onUpdate: entryActions.updateCurrentScheduler,
      onBackgroundImageUpdate: entryActions.updateCurrentSchedulerBackgroundImage,
      onDelete: entryActions.deleteCurrentScheduler,
      onManagerCreate: entryActions.createManagerInCurrentScheduler,
      onManagerDelete: entryActions.deleteSchedulerManager,
      onClose: entryActions.closeModal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ServiceSettingsModal);
