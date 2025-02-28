import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import entryActions from '../entry-actions';
import SchedulerAddModal from '../components/SchedulerAddModal';

const mapStateToProps = ({
  ui: {
    schedulerCreateForm: { data: defaultData, isSubmitting },
  },
}) => ({
  defaultData,
  isSubmitting,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onCreate: entryActions.createScheduler,
      onClose: entryActions.closeModal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerAddModal);
