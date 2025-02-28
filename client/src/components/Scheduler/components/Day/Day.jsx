import { format, isSameDay, isSameMonth, isToday } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import PropTypes from 'prop-types';

import { Button, Icon } from 'semantic-ui-react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import EventContainer from '../../../../containers/EventContainer';
import { usePopup } from '../../../../lib/popup';
import { createDateAsUTC } from '../../../../utils/time-convertor';
import AddStep from './AddStep';
import styles from './Day.module.scss';
import DroppableTypes from '../../../../constants/DroppableTypes';
import MoreStep from './MoreStep';

const Day = React.memo(
  ({
    day,
    firstDayCurrentMonth,
    selectedDate,
    detailedEvents,
    allLabels,
    canEdit,
    onSchedulerStateUpdate,
    onLabelCreate,
    onLabelUpdate,
    onLabelMove,
    onLabelDelete,
    onEventCreate,
  }) => {
    const [height, setHeight] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
      function updateHeight() {
        setHeight(ref.current.clientHeight);
      }
      window.addEventListener('resize', updateHeight);
      setHeight(ref.current.clientHeight);
      return () => {
        window.removeEventListener('resize', updateHeight);
      };
    }, [ref]);

    const events = detailedEvents
      .filter((evt) => isSameDay(evt.startDate, day))
      .sort((a, b) => b.duration - a.duration);

    const htmlEvents = [];
    let moreEvents = [];
    let currentLevel = 0;
    let eventsCount = 0;
    let maxOccupiedLevel = 0;
    let firstWindowLevel = 1;

    if (day.ocupiedLevels) {
      const sortedOccupiedLevels = day.ocupiedLevels.sort((a, b) => a - b);
      for (let i = 0; i < sortedOccupiedLevels.length; i += 1) {
        firstWindowLevel = sortedOccupiedLevels[i] + 1;
        if (firstWindowLevel !== sortedOccupiedLevels[i + 1]) {
          break;
        }
      }

      maxOccupiedLevel = day.ocupiedLevels.sort((a, b) => a - b)[day.ocupiedLevels.length - 1];
      for (currentLevel = 0; currentLevel <= maxOccupiedLevel; currentLevel += 1) {
        // ограничеие по высоте
        // TODO* 29 - height of event. Calculate it!!! TEMP SOLUTION
        if (currentLevel > Math.floor(height / 29) - 2) {
          break;
        }

        if (
          day.ocupiedLevels.includes(currentLevel) &&
          ((events[eventsCount] && events[eventsCount].level > currentLevel) ||
            (!events[eventsCount] && firstWindowLevel > currentLevel))
        ) {
          htmlEvents.push(
            <Draggable
              key={currentLevel}
              index={currentLevel}
              isDragDisabled
              draggableId={`event:${day.getDate()}${currentLevel}${currentLevel}${currentLevel}${htmlEvents.length}`}
            >
              {({ innerRef }) => <div ref={innerRef} className={classNames(styles.space)} />}
            </Draggable>,
          ); // fill empty space, Draggable for beautiful animation;
        } else if (eventsCount < events.length) {
          htmlEvents.push(
            <EventContainer
              key={currentLevel}
              event={events[eventsCount]}
              index={currentLevel}
              duration={events[eventsCount].duration}
              locationId="day"
            />,
          );
          eventsCount += 1;
        }
      }

      moreEvents = day.ongoingEvents
        .sort((a, b) => a.level - b.level)
        .filter((a) => a.level >= currentLevel);
    }

    const getCurrentDayClass = useCallback(() => {
      const today = isToday(day);
      const selected = isSameDay(day, selectedDate);
      if (today && selected) return styles.current_selected_day;
      if (today) return styles.current_day;
      if (selected) return styles.selected_day;
      return '';
    }, [day, selectedDate]);

    const getCurrentDayHeaderClass = useCallback(() => {
      return isToday(day) ? classNames(styles.current_day_header) : '';
    }, [day]);

    const getCurrentMonthClass = useCallback(() => {
      return isSameMonth(day, firstDayCurrentMonth) ? classNames(styles.day_of_current_month) : '';
    }, [day, firstDayCurrentMonth]);

    const handleHeaderClick = useCallback(() => {
      onSchedulerStateUpdate({ selectedDate: createDateAsUTC(day) });
    }, [day, onSchedulerStateUpdate]);

    const AddPopup = usePopup(AddStep);
    const MorePopup = usePopup(MoreStep);

    return (
      <div className={classNames(styles.day, getCurrentDayClass())}>
        <Button as="header" className={classNames(styles.header)} onClick={handleHeaderClick}>
          <p
            className={`${classNames(styles.day_header)} ${getCurrentDayHeaderClass()} ${getCurrentMonthClass()}`}
          >
            {format(day, 'd')}
          </p>
          {day.ongoingEvents && moreEvents.length > 0 && (
            <MorePopup
              events={[...day.ongoingEvents]
                .sort((a, b) => a.level - b.level)
                .filter((a) => a.level >= currentLevel)}
            >
              <Button className={classNames(styles.moreButton)}>{moreEvents.length} more</Button>
            </MorePopup>
          )}
          {canEdit && (
            <AddPopup
              day={day}
              allLabels={allLabels}
              onLabelCreate={onLabelCreate}
              onLabelUpdate={onLabelUpdate}
              onLabelMove={onLabelMove}
              onLabelDelete={onLabelDelete}
              onCreate={onEventCreate}
            >
              <Button className={classNames(styles.actionsButton, styles.target)}>
                <Icon fitted name="plus" size="small" />
              </Button>
            </AddPopup>
          )}
        </Button>
        <Droppable
          isCombineEnabled
          droppableId={`day:${day.toISOString()}`}
          type={DroppableTypes.EVENT}
        >
          {({ innerRef, droppableProps, placeholder }, snapshot) => {
            return (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <div
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...droppableProps}
                ref={innerRef}
                className={classNames(styles.day_body)}
                style={{ backgroundColor: snapshot.isDraggingOver ? '#cdcdff' : 'transparent' }}
              >
                {/* TODO* calculate margins in a good way. This is temp decision */}
                <div ref={ref} style={{ height: '100%' }}>
                  {htmlEvents}
                  {placeholder}
                </div>
              </div>
            );
          }}
        </Droppable>
      </div>
    );
  },
);

Day.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  day: PropTypes.instanceOf(Date).isRequired,
  firstDayCurrentMonth: PropTypes.object.isRequired,
  // eslint-disable-next-line react/require-default-props
  selectedDate: PropTypes.instanceOf(Date),
  detailedEvents: PropTypes.array.isRequired,
  allLabels: PropTypes.array.isRequired,
  canEdit: PropTypes.bool.isRequired,
  onSchedulerStateUpdate: PropTypes.func.isRequired,
  onLabelCreate: PropTypes.func.isRequired,
  onLabelUpdate: PropTypes.func.isRequired,
  onLabelMove: PropTypes.func.isRequired,
  onLabelDelete: PropTypes.func.isRequired,
  onEventCreate: PropTypes.func.isRequired,
};

export default Day;
