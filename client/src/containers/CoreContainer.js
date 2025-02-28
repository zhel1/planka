import { connect } from 'react-redux';

import selectors from '../selectors';
import Core from '../components/Core';

const mapStateToProps = (state) => {
  const isInitializing = selectors.selectIsInitializing(state);
  const isSocketDisconnected = selectors.selectIsSocketDisconnected(state);
  const currentModal = selectors.selectCurrentModal(state);
  const currentProject = selectors.selectCurrentProject(state);
  const currentScheduler = selectors.selectCurrentScheduler(state);
  const currentBoard = selectors.selectCurrentBoard(state);

  return {
    isInitializing,
    isSocketDisconnected,
    currentModal,
    currentProject,
    currentScheduler,
    currentBoard,
  };
};

export default connect(mapStateToProps)(Core);
