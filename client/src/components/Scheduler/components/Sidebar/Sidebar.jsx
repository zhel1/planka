// eslint-disable-next-line import/no-extraneous-dependencies
import { SingleInputDateRangeField, LicenseInfo } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { endOfMonth, isSameDay, setHours, setMinutes, setSeconds, startOfDay } from 'date-fns';
import { t } from 'i18next';
import React, { useCallback, useMemo, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { Header, Menu } from 'semantic-ui-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import DroppableTypes from '../../../../constants/DroppableTypes';
import EventContainer from '../../../../containers/EventContainer';
import i18n from '../../../../i18n';
import statistic from '../../../../utils/scheduler-event-statistic';
import { createDateAsUTC } from '../../../../utils/time-convertor';
import Label from '../../../Label';
import User from '../../../User';
import styles from './Sidebar.module.scss';

LicenseInfo.setLicenseKey(
  'e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y',
);

const Sidebar = React.memo(
  ({ visible, firstDayCurrentMonth, selectedDate, days, events, allUsers, allLabels }) => {
    const [isMoreToolsOpen, setIsMoreToolsOpen] = useState(false);

    // TODO use hooks
    const eventsForSelectedDays = days.filter((d) => isSameDay(d, selectedDate))[0]?.ongoingEvents;
    const [statDateRange, setStatDateRange] = useState([
      firstDayCurrentMonth,
      endOfMonth(firstDayCurrentMonth),
    ]);

    const stat = useMemo(() => {
      if (!statDateRange[0] || !statDateRange[1]) {
        return null;
      }

      return statistic(
        events,
        createDateAsUTC(statDateRange[0]),
        createDateAsUTC(statDateRange[1]),
      );
    }, [events, statDateRange]);

    const handleToggleStat = useCallback(() => {
      setIsMoreToolsOpen(!isMoreToolsOpen);
    }, [isMoreToolsOpen]);

    const handleStatRangeChanged = useCallback((range) => {
      if (!range[0] || !range[1]) {
        return;
      }
      setStatDateRange([
        startOfDay(range[0]),
        setSeconds(setMinutes(setHours(range[1], 23), 59), 59),
      ]);
    }, []);

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={i18n.dateFns.getLocale()}>
        <div className={styles.sidebar} style={{ display: visible ? 'inline-block' : 'none' }}>
          <div className={styles.moduleWrapper}>
            <div className={styles.blockWrapper}>
              <Header>
                {t('common.allEventsFor')}{' '}
                {t('format:fullDate', {
                  postProcess: 'formatDate',
                  value: selectedDate,
                })}
                :
              </Header>
              {eventsForSelectedDays ? (
                <Droppable
                  isDropDisabled
                  isCombineEnabled
                  droppableId={`day:${101}`}
                  type={DroppableTypes.EVENT}
                >
                  {({ innerRef, droppableProps }) => (
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    <div {...droppableProps} ref={innerRef}>
                      {eventsForSelectedDays?.map((event, index) => (
                        <EventContainer
                          key={event.apiEvent.id + event.level}
                          event={event}
                          index={index}
                          duration={24 * 60 * 60}
                          locationId="sidebar"
                          noDuration
                        />
                      ))}
                    </div>
                  )}
                </Droppable>
              ) : (
                <Header as="h4">{t('common.noEventsForSelectedDate')}</Header>
              )}
            </div>
            <Menu text className={styles.moreToolsMenu}>
              <Menu.Item onClick={handleToggleStat} className={styles.moreToolsMenuHeader}>
                {t('common.moreTools')}
              </Menu.Item>
              {isMoreToolsOpen && (
                <>
                  <div className={styles.statHeader}>
                    <Header size="small" className={styles.headerText}>
                      {t('common.statisticFor')}:
                    </Header>
                    <DateRangePicker
                      defaultValue={statDateRange}
                      value={statDateRange}
                      slots={{ field: SingleInputDateRangeField }}
                      slotProps={{ textField: { size: 'small' } }}
                      sx={{ input: { padding: '5px' } }}
                      onChange={handleStatRangeChanged}
                    />
                  </div>
                  {stat && (
                    <>
                      {Object.keys(stat.statByUserId).map((userId) => (
                        <div className={styles.statUser} key={userId}>
                          <User name={allUsers.find((u) => u.id === userId).name} size="small" />
                          <div className={styles.statUserLabels}>
                            {Object.keys(stat.statByUserId[userId].statByLabelId).map((labelId) => (
                              <div key={labelId} className={styles.statUserItem}>
                                <Label
                                  name={allLabels.find((l) => l.id === labelId).name}
                                  color={allLabels.find((l) => l.id === labelId).color}
                                  size="tiny-auto"
                                />
                                <span className={styles.contentText}>
                                  {stat.statByUserId[userId].statByLabelId[labelId].eventCount}{' '}
                                  {t('common.events')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </Menu>
          </div>
        </div>
      </LocalizationProvider>
    );
  },
);

Sidebar.propTypes = {
  visible: PropTypes.bool,
  firstDayCurrentMonth: PropTypes.instanceOf(Date).isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  days: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  events: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  allUsers: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  allLabels: PropTypes.array.isRequired,
};

Sidebar.defaultProps = {
  visible: false,
};

export default Sidebar;
