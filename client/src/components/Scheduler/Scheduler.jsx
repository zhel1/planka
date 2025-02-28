import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { RRule } from 'rrule';
import { Grid } from 'semantic-ui-react';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfWeek,
  isSameDay,
  parseISO,
  startOfMonth,
  startOfDay,
} from 'date-fns';
import EventModalContainer from '../../containers/EventModalContainer';
import SchedulerActionsContainer from '../../containers/SchedulerActionsContainer';
import SchedulerSideBarContainer from '../../containers/SchedulerSideBarContainer';
import daysBetween from '../../utils/days-between';
import disperseEventOnMonthView from '../../utils/disperse-event';
import { getSchedulerSideBarOpened } from '../../utils/scheduler-side-bar-state-storage';
import { createDateAsUTC } from '../../utils/time-convertor';
import Month from './components/Month/Month';
import SchedulerHeader from './components/SchedulerHeader/SchedulerHeader';

import styles from './Scheduler.module.scss';

const parseDndId = (dndId) => dndId.split(':')[1];
const parseDndDate = (dndId) => dndId.substr(dndId.indexOf(':') + 1);

const Scheduler = React.memo(
  ({
    events,
    firstDayOfCurrentDisplayedMonth,
    isEventModalOpened,
    onSchedulerStateUpdate,
    onEventUpdate,
  }) => {
    useEffect(() => {
      return () => {
        onSchedulerStateUpdate({
          selectedDate: createDateAsUTC(startOfDay(new Date())),
          firstDayOfCurrentDisplayedMonth: createDateAsUTC(startOfMonth(new Date())),
        });
      };
      // eslint-disable-next-line
    }, []);

    // TODO* use memo
    const days = eachDayOfInterval({
      start: startOfWeek(firstDayOfCurrentDisplayedMonth),
      end: endOfWeek(endOfMonth(firstDayOfCurrentDisplayedMonth)),
    });

    const detailedEvents = disperseEventOnMonthView(events, firstDayOfCurrentDisplayedMonth);

    if (detailedEvents) {
      for (let i = 0; i < days.length; i += 1) {
        const eventsForCurrentDay = detailedEvents
          .filter((evt) => isSameDay(evt.startDate, days[i]))
          .sort((e1, e2) => e2.duration - e1.duration);
        days[i].events = eventsForCurrentDay;
        eventsForCurrentDay.forEach((event, index) => {
          // calculate level
          let level = index;
          if (days[i].ocupiedLevels !== undefined) {
            // eslint-disable-next-line no-constant-condition
            while (true) {
              if (!days[i].ocupiedLevels.includes(level)) {
                break;
              }
              level += 1;
            }
          }

          // eslint-disable-next-line no-param-reassign
          event.level = level;

          // let durationsDays = Math.ceil(event.duration / (24 * 60 * 60));
          let durationsDays = daysBetween(event.startDate, event.duration * 1000 - 1000);
          if (durationsDays === 0) {
            durationsDays += 1;
          }

          for (let j = i; j < days.length && j < i + durationsDays; j += 1) {
            if (days[j].ocupiedLevels === undefined) {
              days[j].ocupiedLevels = [level];
              days[j].ongoingEvents = [event];
            } else {
              days[j].ocupiedLevels.push(level);
              days[j].ongoingEvents.push(event);
            }
          }
        });
      }
    }

    const handleDragEnd = useCallback(
      ({ draggableId, destination }) => {
        if (!destination) {
          return;
        }

        const event = detailedEvents.find((e) => e.apiEvent.id === parseDndId(draggableId));

        const newStartDate = parseISO(parseDndDate(destination.droppableId));
        newStartDate.setHours(event.startDate.getHours());
        newStartDate.setMinutes(event.startDate.getMinutes());
        newStartDate.setSeconds(event.startDate.getSeconds());

        const data = {
          startDate: createDateAsUTC(newStartDate),
        };

        if (event.apiEvent.isRecurring && event.apiEvent.recurrencePattern) {
          const options = RRule.parseString(event.apiEvent.recurrencePattern);
          options.dtstart = createDateAsUTC(newStartDate);
          data.recurrencePattern = new RRule(options).toString();
        }

        onEventUpdate(parseDndId(draggableId), data);
      },
      [detailedEvents, onEventUpdate],
    );

    const [isSideBarOpened, setIsSideBarOpened] = useState(getSchedulerSideBarOpened());

    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid celled className={styles.grid}>
          <SchedulerActionsContainer />
          <Grid.Row className={styles.header}>
            <SchedulerHeader
              firstDayCurrentMonth={firstDayOfCurrentDisplayedMonth}
              setIsSideBarOpened={setIsSideBarOpened}
              onSchedulerStateUpdate={onSchedulerStateUpdate}
            />
          </Grid.Row>
          <Grid.Row className={styles.body}>
            <SchedulerSideBarContainer
              visible={isSideBarOpened}
              firstDayCurrentMonth={firstDayOfCurrentDisplayedMonth}
              days={days}
            />
            <Month
              firstDayCurrentMonth={firstDayOfCurrentDisplayedMonth}
              days={days}
              detailedEvents={detailedEvents}
            />
          </Grid.Row>
        </Grid>
        {isEventModalOpened && <EventModalContainer />}
      </DragDropContext>
    );
  },
);

Scheduler.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  events: PropTypes.array.isRequired,
  firstDayOfCurrentDisplayedMonth: PropTypes.instanceOf(Date).isRequired,
  isEventModalOpened: PropTypes.bool.isRequired,
  onSchedulerStateUpdate: PropTypes.func.isRequired,
  onEventUpdate: PropTypes.func.isRequired,
};

Scheduler.defaultProps = {};

export default Scheduler;
