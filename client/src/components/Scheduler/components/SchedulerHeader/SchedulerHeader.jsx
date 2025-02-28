import { add, startOfMonth, startOfWeek } from 'date-fns';
import { t } from 'i18next';
import React, { useCallback } from 'react';

import PropTypes from 'prop-types';
import { Header, Button, Icon } from 'semantic-ui-react';
import { setSchedulerSideBarOpened } from '../../../../utils/scheduler-side-bar-state-storage';
import { createDateAsUTC } from '../../../../utils/time-convertor';
import styles from './SchedulerHeader.module.scss';

const SchedulerHeader = React.memo(
  ({ firstDayCurrentMonth, setIsSideBarOpened, onSchedulerStateUpdate }) => {
    const handleMonthChanged = useCallback(
      (index) => {
        const firstDayOfCurrentDisplayedMonth = add(firstDayCurrentMonth, { months: index });
        onSchedulerStateUpdate({
          firstDayOfCurrentDisplayedMonth,
          selectedDate: createDateAsUTC(startOfWeek(firstDayOfCurrentDisplayedMonth)),
        });
      },
      [firstDayCurrentMonth, onSchedulerStateUpdate],
    );

    const handleOpenSideBarButtonClicked = useCallback(() => {
      setIsSideBarOpened((prevState) => {
        setSchedulerSideBarOpened(!prevState);
        return !prevState;
      });
    }, [setIsSideBarOpened]);

    const handleTodayButtonClicked = useCallback(() => {
      onSchedulerStateUpdate({
        selectedDate: createDateAsUTC(startOfMonth(new Date())),
        firstDayOfCurrentDisplayedMonth: createDateAsUTC(startOfMonth(new Date())),
      });
    }, [onSchedulerStateUpdate]);

    return (
      <Header as="header" className={styles.scheduler_header}>
        <div>
          <Button className={styles.button} onClick={handleOpenSideBarButtonClicked}>
            <Icon name="bars" size="large" />
          </Button>
        </div>
        <div>
          <Button onClick={() => handleMonthChanged(-1)} className={styles.button}>
            <Icon fitted name="caret left" size="big" />
          </Button>
          <Header className={styles.text} as="span">
            {t('format:monthYear', {
              postProcess: 'formatDate',
              value: firstDayCurrentMonth,
            })}
          </Header>
          <Button onClick={() => handleMonthChanged(1)} className={styles.button}>
            <Icon fitted name="caret right" size="big" />
          </Button>
        </div>
        <div>
          <Button onClick={handleTodayButtonClicked}>{t('common.today')}</Button>
        </div>
      </Header>
    );
  },
);

SchedulerHeader.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  firstDayCurrentMonth: PropTypes.object.isRequired,
  setIsSideBarOpened: PropTypes.func.isRequired,
  onSchedulerStateUpdate: PropTypes.func.isRequired,
};

export default SchedulerHeader;
