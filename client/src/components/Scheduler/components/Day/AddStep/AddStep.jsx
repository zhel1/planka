import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'semantic-ui-react';
import { Input, Popup } from '../../../../../lib/custom-ui';

import { useForm, useSteps } from '../../../../../hooks';
import { useDidUpdate, useToggle } from '../../../../../lib/hooks';
import { createDateAsUTC } from '../../../../../utils/time-convertor';
import Label from '../../../../Label';
import LabelsStep from '../../../../LabelsStep';

import styles from './AddStep.module.scss';

const StepTypes = {
  LABEL: 'LABEL',
};

const AddStep = React.memo(
  ({
    day,
    allLabels,
    onCreate,
    onClose,
    onLabelCreate,
    onLabelUpdate,
    onLabelMove,
    onLabelDelete,
  }) => {
    const [t] = useTranslation();

    const [data, handleFieldChange] = useForm({
      name: '',
      schedulerLabelId: null,
      startDate: createDateAsUTC(day),
      duration: 60 * 60 * 24 - 1,
      isAllDay: true,
      isRecurring: false,
    });

    const [step, openStep, handleBack] = useSteps();
    const [focusNameFieldState, focusNameField] = useToggle();

    const nameField = useRef(null);

    const [schedulerLabelId, setSchedulerLabelId] = useState(null);

    const handleLabelBack = useCallback(() => {
      handleBack();
      focusNameField();
    }, [handleBack, focusNameField]);

    const handleSubmit = useCallback(() => {
      const cleanData = {
        ...data,
        name: data.name.trim()
          ? data.name.trim()
          : allLabels.find((l) => l.id === schedulerLabelId).name,
        schedulerLabelId,
      };

      if (!cleanData.name || !schedulerLabelId) {
        nameField.current.select();
        return;
      }

      onCreate(cleanData);
      onClose();
    }, [data, allLabels, schedulerLabelId, onCreate, onClose]);

    const handleLabelClick = useCallback(() => {
      openStep(StepTypes.LABEL);
    }, [openStep]);

    useEffect(() => {
      nameField.current.focus({
        preventScroll: true,
      });
    }, []);

    useDidUpdate(() => {
      nameField.current.focus();
    }, [focusNameFieldState]);

    if (step && step.type === StepTypes.LABEL) {
      return (
        <LabelsStep
          items={allLabels}
          currentIds={setSchedulerLabelId ? [setSchedulerLabelId] : []}
          onSelect={(id) => {
            setSchedulerLabelId(id);
            handleLabelBack();
          }}
          onDeselect={() => {}}
          onCreate={onLabelCreate}
          onUpdate={onLabelUpdate}
          onMove={onLabelMove}
          onDelete={onLabelDelete}
          onBack={handleLabelBack}
        />
      );
    }

    return (
      <>
        <Popup.Header>
          {t('common.createEvent', {
            context: 'title',
          })}
        </Popup.Header>
        <Popup.Content>
          <Form onSubmit={handleSubmit}>
            <Input
              fluid
              ref={nameField}
              name="name"
              value={data.name}
              className={styles.field}
              onChange={handleFieldChange}
              placeholder={t('common.enterEventTitle')}
            />
            <div className={styles.field}>
              <span className={styles.labelTitle}>{`${t('common.label')}:`}</span>
              {/* eslint-disable-next-line react/button-has-type */}
              <button className={styles.labelButton} onClick={handleLabelClick}>
                {schedulerLabelId ? (
                  <span className={styles.labelItem}>
                    <Label
                      name={allLabels.find((l) => l.id === schedulerLabelId).name}
                      color={allLabels.find((l) => l.id === schedulerLabelId).color}
                      size="small"
                    />
                  </span>
                ) : (
                  <span className={styles.placeholderText}>{t('common.selectLabel')}</span>
                )}
              </button>
            </div>
            <Button
              disabled={
                !schedulerLabelId ||
                (data.name.trim() === '' &&
                  allLabels.find((l) => l.id === schedulerLabelId).name === '')
              }
              positive
              content={t('action.createEvent')}
              className={styles.createButton}
            />
          </Form>
        </Popup.Content>
      </>
    );
  },
);

AddStep.propTypes = {
  day: PropTypes.instanceOf(Date).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  allLabels: PropTypes.array.isRequired,
  onCreate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onLabelCreate: PropTypes.func.isRequired,
  onLabelUpdate: PropTypes.func.isRequired,
  onLabelMove: PropTypes.func.isRequired,
  onLabelDelete: PropTypes.func.isRequired,
};

export default AddStep;
