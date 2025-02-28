import { connect } from 'react-redux';

import selectors from '../selectors';
import Fixed from '../components/Fixed';

const mapStateToProps = (state) => {
  const { schedulerId, projectId } = selectors.selectPath(state);
  const currentBoard = selectors.selectCurrentBoard(state);

  return {
    schedulerId,
    projectId,
    board: currentBoard,
  };
};

export default connect(mapStateToProps)(Fixed);
