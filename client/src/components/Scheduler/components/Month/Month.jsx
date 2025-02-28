import { t } from 'i18next';
import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import SchedulerDayContainer from '../../../../containers/SchedulerDayContainer';

import styles from './Month.module.scss';

const Month = React.memo(({ firstDayCurrentMonth, days, detailedEvents }) => {
  return (
    <div className={styles.month}>
      <Header as="header" className={styles.month_header}>
        {days.slice(0, 7).map((day) => (
          <p key={day.toString()} className={styles.weekday}>
            {t('format:weekShort', {
              postProcess: 'formatDate',
              value: day,
            })}
          </p>
        ))}
      </Header>
      <div /* ref={ref} */ className={styles.month_body}>
        {days.map((day, i) => (
          <SchedulerDayContainer
            key={day.toString()}
            firstDayCurrentMonth={firstDayCurrentMonth}
            day={day}
            rowIdx={i}
            detailedEvents={detailedEvents}
          />
        ))}
      </div>
    </div>
  );
});

Month.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  firstDayCurrentMonth: PropTypes.object.isRequired,
  days: PropTypes.array.isRequired,
  detailedEvents: PropTypes.array.isRequired,
};

export default Month;
