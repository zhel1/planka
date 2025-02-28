import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container, Grid, Header } from 'semantic-ui-react';

import Paths from '../../constants/Paths';
import { SchedulerBackgroundTypes } from '../../constants/Enums';
import { ReactComponent as PlusIcon } from '../../assets/images/plus-icon.svg';

import styles from './Schedulers.module.scss';
import globalStyles from '../../styles.module.scss';

const Schedulers = React.memo(({ items, canAdd, onAdd }) => {
  const [t] = useTranslation();

  return (
    <Container className={styles.cardsWrapper}>
      <Header inverted size="huge" className={styles.serviceTitle}>
        {t('common.schedulers')}
      </Header>
      <Grid className={styles.gridFix}>
        {items.map((item) => (
          <Grid.Column key={item.id} mobile={8} computer={4}>
            <Link to={Paths.SCHEDULERS.replace(':id', item.id)}>
              <div
                className={classNames(
                  styles.card,
                  styles.open,
                  item.background &&
                    item.background.type === SchedulerBackgroundTypes.GRADIENT &&
                    globalStyles[`background${upperFirst(camelCase(item.background.name))}`],
                )}
                style={{
                  background:
                    item.background &&
                    item.background.type === 'image' &&
                    `url("${item.backgroundImage.coverUrl}") center / cover`,
                }}
              >
                {item.notificationsTotal > 0 && (
                  <span className={styles.notification}>{item.notificationsTotal}</span>
                )}
                <div className={styles.cardOverlay} />
                <div className={styles.openTitle}>{item.name}</div>
              </div>
            </Link>
          </Grid.Column>
        ))}
        {canAdd && (
          <Grid.Column mobile={8} computer={4}>
            <button type="button" className={classNames(styles.card, styles.add)} onClick={onAdd}>
              <div className={styles.addTitleWrapper}>
                <div className={styles.addTitle}>
                  <PlusIcon className={styles.addGridIcon} />
                  {t('action.createScheduler')}
                </div>
              </div>
            </button>
          </Grid.Column>
        )}
      </Grid>
    </Container>
  );
});

Schedulers.propTypes = {
  items: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  canAdd: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default Schedulers;
