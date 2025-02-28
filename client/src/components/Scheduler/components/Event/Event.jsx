import { format, isSameDay } from 'date-fns';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import Paths from '../../../../constants/Paths';
import globalStyles from '../../../../styles.module.scss';
import daysBetween from '../../../../utils/days-between';
import { createDateAsLocal } from '../../../../utils/time-convertor';
import User from '../../../User';
import styles from './Event.module.scss';

function disableSortAnimationStyles(style, snapshot) {
  if (!snapshot.isDragging) return {};
  if (!snapshot.isDropAnimating) {
    return style;
  }

  return {
    ...style,
    // cannot be 0, but make it super tiny
    // transitionDuration: `0.00001s`,
  };
}

const Event = React.memo(
  ({ event, user, index, duration, locationId, label, canEdit, noDuration }) => {
    const lasts = daysBetween(
      createDateAsLocal(event.apiEvent.startDate),
      event.apiEvent.duration * 1000,
    );

    return (
      <Draggable
        key={event.apiEvent.id}
        draggableId={`event:${event.apiEvent.id}:${event.startDate.toISOString()}:${index}:${event.level}:${locationId}`} // index and level is used to make more uniq id
        index={index}
        isDragDisabled={!canEdit}
      >
        {({ innerRef, draggableProps, dragHandleProps }, snapshot) => (
          <>
            <Link
              to={Paths.EVENTS.replace(':id', event.apiEvent.id)}
              className={styles.content}
              // onClick={handleClick}
            >
              <div
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...draggableProps}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...dragHandleProps}
                ref={innerRef}
                style={disableSortAnimationStyles(draggableProps.style, snapshot)}
                className={classNames(styles.event)}
              >
                {event.apiEvent.isAllDay ||
                !isSameDay(
                  createDateAsLocal(event.apiEvent.startDate),
                  createDateAsLocal(
                    new Date(event.apiEvent.startDate.getTime() + event.apiEvent.duration * 1000),
                  ),
                ) ? (
                  <div
                    className={classNames(
                      styles[
                        `day${
                          noDuration ? 1 : daysBetween(event.startDate, duration * 1000 - 1000) // TODO -1000 refactor
                        }`
                      ],
                      globalStyles[`background${upperFirst(camelCase(label.color))}`],
                    )}
                  >
                    <User name={user.name} size="nano" />
                    <span className={classNames(styles.eventName)}>
                      {event.apiEvent.name}
                      {lasts > 1 && ` [${lasts} days]`}
                    </span>
                  </div>
                ) : (
                  <div className={classNames(styles.day0)}>
                    <div
                      className={classNames(
                        styles.eventMarker,
                        globalStyles[`background${upperFirst(camelCase(label.color))}`],
                      )}
                    />
                    <User name={user.name} size="nano" />
                    <span className={classNames(styles.eventName)}>
                      {format(event.startDate, 'HH:mm')} {' - '}
                      {format(
                        new Date(event.startDate.getTime() + event.apiEvent.duration * 1000),
                        'HH:mm',
                      )}{' '}
                      {event.apiEvent.name}
                    </span>
                  </div>
                )}
              </div>
            </Link>
            {/* empty placeholder to escape reordering */}
            {snapshot.isDragging && <div style={{ height: '2rem' }} />}
          </>
        )}
      </Draggable>
    );
  },
);

Event.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  event: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  locationId: PropTypes.string.isRequired,
  label: PropTypes.object.isRequired,
  canEdit: PropTypes.bool.isRequired,
  noDuration: PropTypes.bool,
};

Event.defaultProps = {
  noDuration: false,
};

export default Event;
