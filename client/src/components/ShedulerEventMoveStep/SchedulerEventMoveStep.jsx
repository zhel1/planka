import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Form } from 'semantic-ui-react';
import { Popup } from '../../lib/custom-ui';

import { useForm } from '../../hooks';

import styles from './SchedulerEventMoveStep.module.scss';

const SchedulerEventMoveStep = React.memo(
  ({ schedulersToLists, defaultPath, onTransfer, onBack, onClose }) => {
    const [t] = useTranslation();

    const [path, handleFieldChange] = useForm(() => ({
      schedulerId: null,
      ...defaultPath,
    }));

    const selectedScheduler = useMemo(
      () => schedulersToLists.find((scheduler) => scheduler.id === path.schedulerId) || null,
      [schedulersToLists, path],
    );

    const handleSubmit = useCallback(() => {
      if (selectedScheduler.id !== defaultPath.schedulerId) {
        onTransfer(selectedScheduler.id);
      }

      onClose();
    }, [defaultPath, onClose, onTransfer, selectedScheduler]);

    return (
      <>
        <Popup.Header onBack={onBack}>
          {t('common.moveEvent', {
            context: 'title',
          })}
        </Popup.Header>
        <Popup.Content>
          <Form onSubmit={handleSubmit}>
            <div className={styles.text}>{t('common.scheduler')}</div>
            <Dropdown
              fluid
              selection
              name="schedulerId"
              options={schedulersToLists.map((scheduler) => ({
                text: scheduler.name,
                value: scheduler.id,
              }))}
              value={selectedScheduler && selectedScheduler.id}
              placeholder={
                schedulersToLists.length === 0
                  ? t('common.noSchedulers')
                  : t('common.selectScheduler')
              }
              disabled={schedulersToLists.length === 0}
              className={styles.field}
              onChange={handleFieldChange}
            />
            <Button positive content={t('action.move')} disabled={!selectedScheduler} />
          </Form>
        </Popup.Content>
      </>
    );
  },
);

SchedulerEventMoveStep.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  schedulersToLists: PropTypes.array.isRequired,
  defaultPath: PropTypes.object.isRequired,
  onTransfer: PropTypes.func.isRequired,
  onBack: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

SchedulerEventMoveStep.defaultProps = {
  onBack: undefined,
};

export default SchedulerEventMoveStep;
