import { connect } from 'react-redux';

import selectors from '../selectors';
import Static from '../components/Static';

const mapStateToProps = (state) => {
  const { cardId, projectId, schedulerId } = selectors.selectPath(state);
  const currentBoard = selectors.selectCurrentBoard(state);

  return {
    schedulerId,
    projectId,
    cardId,
    board: currentBoard,
  };
};

export default connect(mapStateToProps)(Static);
