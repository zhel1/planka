import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import selectors from '../selectors';
import entryActions from '../entry-actions';
import Schedulers from '../components/Schedulers';

const mapStateToProps = (state) => {
  const { isAdmin } = selectors.selectCurrentUser(state);
  const schedulers = selectors.selectSchedulersForCurrentUser(state);

  return {
    items: schedulers,
    canAdd: isAdmin,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onAdd: entryActions.openSchedulerAddModal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Schedulers);
