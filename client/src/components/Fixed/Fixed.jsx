import React from 'react';
import PropTypes from 'prop-types';

import HeaderContainer from '../../containers/HeaderContainer';
import ProjectContainer from '../../containers/ProjectContainer';
import BoardActionsContainer from '../../containers/BoardActionsContainer';

import styles from './Fixed.module.scss';

import ServiceTypes from '../../constants/ServiceTypes';

function Fixed({ schedulerId, projectId, board }) {
  let currentService; // TODO* maybe there is a more beautifully way to do it
  if (schedulerId) {
    currentService = ServiceTypes.SCHEDULER;
  }

  if (projectId) {
    currentService = ServiceTypes.KANBAN;
  }

  return (
    <div className={styles.wrapper}>
      <HeaderContainer currentService={currentService} />
      {projectId && <ProjectContainer />}
      {board && !board.isFetching && <BoardActionsContainer />}
    </div>
  );
}

Fixed.propTypes = {
  schedulerId: PropTypes.string,
  projectId: PropTypes.string,
  board: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

Fixed.defaultProps = {
  schedulerId: undefined,
  projectId: undefined,
  board: undefined,
};

export default Fixed;
