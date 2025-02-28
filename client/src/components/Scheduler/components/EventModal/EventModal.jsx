import { eachDayOfInterval, endOfWeek, format, parse, startOfWeek } from 'date-fns';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RRule } from 'rrule';
import { Weekday } from 'rrule/dist/esm/weekday';
import { Checkbox, Grid, Icon, Modal, Dropdown, Button, Radio, FormField } from 'semantic-ui-react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
// eslint-disable-next-line import/no-extraneous-dependencies
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DaysOfWeek } from '../../../../constants/Enums';
import i18n from '../../../../i18n';
import { useDidUpdate } from '../../../../lib/hooks';
import { usePopup } from '../../../../lib/popup';
import { createDateAsUTC } from '../../../../utils/time-convertor';
import BoardMembershipsStep from '../../../BoardMembershipsStep';
import DeleteStep from '../../../DeleteStep';
import Label from '../../../Label';
import LabelsStep from '../../../LabelsStep';
import NumberInput from '../../../NumberInput/NumberInput';
import SchedulerEventMoveStep from '../../../ShedulerEventMoveStep';
import User from '../../../User';
import styles from './EventModal.module.scss';
import NameField from '../../../CardModal/NameField';
import DescriptionEdit from '../../../CardModal/DescriptionEdit';
import { Markdown } from '../../../../lib/custom-ui';

function mapDateToRRuleDayOfTheWeek(dayOfTheWeekNumber) {
  const dictionary = {
    0: RRule.SU,
    1: RRule.MO,
    2: RRule.TU,
    3: RRule.WE,
    4: RRule.TH,
    5: RRule.FR,
    6: RRule.SA,
  };
  return dictionary[dayOfTheWeekNumber];
}

const getWeek = () => {
  return eachDayOfInterval({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date()),
  });
};

const EventModal = React.memo(
  ({
    name,
    description,
    startDate,
    untilDate,
    isAllDay,
    isRecurring,
    duration,
    schedulerId,
    creatorUser,
    schedulerLabel,
    // test
    recurrenceInterval,
    repeatOptionDrop,
    daysOfTheWeekOptionCheckBoxes,
    repeatOptionInMonthRadio,
    dayOfMonthOptionInMonthSpin,
    orderOptionInMonthDrop,
    dayOfTheWeekOptionInMonthDrop,
    repeatOptionInYearRadio,
    dayOfMonthOptionInYearSpin,
    monthOptionInYearDrop1,
    monthOptionInYearDrop2,
    orderOptionInYearDrop,
    dayOfTheWeekOptionInYearDrop,
    endRepeatOptionRadio,
    endRepeatCountSpin,
    // end test
    allSchedulersToLists,
    allSchedulerMemberships,
    allLabels,
    canEdit,
    canEditCommentActivities,
    canEditAllCommentActivities,
    onUpdate,
    onDelete,
    onTransfer,
    onLabelCreate,
    onLabelUpdate,
    onLabelMove,
    onLabelDelete,
    onClose,
  }) => {
    // common fields
    const handleNameUpdate = useCallback(
      (newName) => {
        onUpdate({
          name: newName,
        });
      },
      [onUpdate],
    );

    const handleDescriptionUpdate = useCallback(
      (newDescription) => {
        onUpdate({
          description: newDescription,
        });
      },
      [onUpdate],
    );

    const handleIsAllDayUpdate = useCallback(
      (e, data) => {
        onUpdate({
          isAllDay: data.checked,
        });
      },
      [onUpdate],
    );

    const handleLabelUpdate = useCallback(
      (id) => {
        onUpdate({
          schedulerLabelId: id,
        });
      },
      [onUpdate],
    );

    const handleUserUpdate = useCallback(
      (id) => {
        onUpdate({
          creatorUserId: id,
        });
      },
      [onUpdate],
    );

    const [isRecurringSt, setIsRecurring] = useState(isRecurring ?? false);

    // handle date and time change
    const [startDateSt, setStartDateSt] = useState(startDate);
    const [endDateSt, setEndDateSt] = useState(new Date(startDate.getTime() + duration * 1000));

    // recurrence fields
    const [recurrenceIntervalSt, setRecurrenceIntervalSt] = useState(recurrenceInterval ?? 1);
    const [repeatOptionDropSt, setRepeatOptionDropSt] = useState(repeatOptionDrop ?? RRule.DAILY);

    // week
    const [daysOfTheWeekOptionCheckBoxesSt, setDaysOfTheWeekOptionCheckBoxesSt] = useState(
      daysOfTheWeekOptionCheckBoxes ?? [],
    );

    // month
    const [repeatOptionInMonthRadioSt, setRepeatOptionInMonthRadioSt] = useState(
      repeatOptionInMonthRadio ?? 0,
    );
    const [dayOfMonthOptionInMonthSpinSt, setDayOfMonthOptionInMonthSpinSt] = useState(
      dayOfMonthOptionInMonthSpin ?? 1,
    );
    const [orderOptionInMonthDropSt, setOrderOptionInMonthDropSt] = useState(
      orderOptionInMonthDrop ?? 1,
    );
    const [dayOfTheWeekOptionInMonthDropSt, setDayOfTheWeekOptionInMonthDropSt] = useState(
      dayOfTheWeekOptionInMonthDrop ?? DaysOfWeek.DAY,
    );

    // year
    const [repeatOptionInYearRadioSt, setRepeatOptionInYearRadioSt] = useState(
      repeatOptionInYearRadio ?? 0,
    );
    const [dayOfMonthOptionInYearSpinSt, setDayOfMonthOptionInYearSpinSt] = useState(
      dayOfMonthOptionInYearSpin ?? 1,
    );
    const [monthOptionInYearDrop1St, setMonthOptionInYearDrop1St] = useState(
      monthOptionInYearDrop1 ?? 1,
    );
    const [orderOptionInYearDropSt, setOrderOptionInYearDropSt] = useState(
      orderOptionInYearDrop ?? 1,
    );
    const [dayOfTheWeekOptionInYearDropSt, setDayOfTheWeekOptionInYearDropSt] = useState(
      dayOfTheWeekOptionInYearDrop ?? DaysOfWeek.DAY,
    );
    const [monthOptionInYearDrop2St, setMonthOptionInYearDrop2St] = useState(
      monthOptionInYearDrop2 ?? 1,
    );

    // end repeat
    const [endRepeatOptionRadioSt, setEndRepeatOptionRadioSt] = useState(endRepeatOptionRadio ?? 0);
    const [endRepeatCountSpinSt, setEndRepeatCountSpinSt] = useState(endRepeatCountSpin ?? 1);
    const [untilDateSt, setUntilDateSt] = useState(untilDate ?? new Date());

    const shouldDisableStartDate = useCallback((date) => {
      return !date || date.getTime() < 0;
    }, []);

    const shouldDisableEndDate = useCallback(
      (date) => {
        return !date || date.getTime() < 0 || date.getTime() < startDateSt.getTime();
      },
      [startDateSt],
    );

    useDidUpdate(() => {
      const options = {
        interval: recurrenceIntervalSt,
        freq: repeatOptionDropSt,
      };

      if (startDateSt) {
        options.dtstart = createDateAsUTC(startDateSt);
      }

      switch (repeatOptionDropSt) {
        case RRule.DAILY:
          break;
        case RRule.WEEKLY:
          options.byweekday = daysOfTheWeekOptionCheckBoxesSt;
          break;
        case RRule.MONTHLY:
          switch (repeatOptionInMonthRadioSt) {
            case 0: // Day of month
              options.bymonthday = [dayOfMonthOptionInMonthSpinSt];
              break;
            case 1: // The [first, second] [day, weekday weekend, monday ...]
              switch (dayOfTheWeekOptionInMonthDropSt) {
                case DaysOfWeek.DAY:
                  options.bymonthday = [orderOptionInMonthDropSt];
                  break;
                case DaysOfWeek.WEEKEND_DAY:
                  options.byweekday = [RRule.SA, RRule.SU]; // TODO* depends on locale
                  options.bysetpos = [orderOptionInMonthDropSt];
                  break;
                case DaysOfWeek.WEEKDAY:
                  options.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR]; // TODO* depends on locale
                  options.bysetpos = [orderOptionInMonthDropSt];
                  break;
                default:
                  options.byweekday = [Weekday.fromStr(dayOfTheWeekOptionInMonthDropSt)];
                  options.bysetpos = [orderOptionInMonthDropSt];
              }
              break;
            default:
          }
          break;
        case RRule.YEARLY:
          switch (repeatOptionInYearRadioSt) {
            case 0: // Day of month
              options.bymonthday = [dayOfMonthOptionInYearSpinSt];
              options.bymonth = [monthOptionInYearDrop1St];
              break;
            case 1: // The [first, second] [day, weekday weekend, monday ...]of every[jun, feb, mar, ...]
              options.bymonth = [monthOptionInYearDrop2St];
              switch (dayOfTheWeekOptionInYearDropSt) {
                case DaysOfWeek.DAY: // TODO* use constants
                  options.bymonthday = [orderOptionInYearDropSt];
                  break;
                case DaysOfWeek.WEEKEND_DAY:
                  options.byweekday = [RRule.SA, RRule.SU];
                  options.bysetpos = [orderOptionInYearDropSt];
                  break;
                case DaysOfWeek.WEEKDAY:
                  options.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR];
                  options.bysetpos = [orderOptionInYearDropSt];
                  break;
                default:
                  options.byweekday = [Weekday.fromStr(dayOfTheWeekOptionInYearDropSt)];
                  options.bysetpos = [orderOptionInYearDropSt];
              }
              break;
            default:
          }
          break;
        default:
      }

      switch (endRepeatOptionRadioSt) {
        case 0:
          break;
        case 1:
          if (untilDateSt) {
            options.until = new Date(untilDateSt.getTime()); // copy
          }
          break;
        case 2:
          options.count = endRepeatCountSpinSt;
          break;
        default:
      }

      const rrule = new RRule(options);

      const dur = (() => {
        return Math.max(
          (endDateSt.getTime() - startDateSt.getTime()) / 1000 - (isAllDay ? 1 : 0), // minus 1 sec not to go through 00:00
          0,
        );
      })();

      onUpdate({
        recurrencePattern: isRecurringSt ? rrule.toString() : '',
        startDate: createDateAsUTC(startDateSt), // TODO check if does not changed
        // startDate: !isAllDay ? convertDateToUTC(startDateSt) : createDateAsUTC(startDateSt),
        // duration: isAllDay
        //   ? Math.max((1 + daysBetween(endDateSt, startDateSt)) * 86400, 0)
        //   : Math.max((endDateSt.getTime() - startDateSt.getTime()) / 1000, 0), // TODO check if does not changed
        // duration: Math.max(
        //   (endDateSt.getTime() - startDateSt.getTime()) / 1000 - (isAllDay ? 1 : 0), // minus 1 sec not to go through 00:00
        //   0,
        // ), // TODO check if does not changed
        duration: dur,
        untilDate: endRepeatOptionRadioSt === 1 ? untilDateSt : null,
        isRecurring: isRecurringSt, // TODO check if does not changed
      });
    }, [
      isRecurringSt,
      startDateSt,
      endDateSt,
      recurrenceIntervalSt,
      repeatOptionDropSt,
      daysOfTheWeekOptionCheckBoxesSt,
      repeatOptionInMonthRadioSt,
      dayOfMonthOptionInMonthSpinSt,
      dayOfTheWeekOptionInMonthDropSt,
      orderOptionInMonthDropSt,
      repeatOptionInYearRadioSt,
      dayOfMonthOptionInYearSpinSt,
      monthOptionInYearDrop1St,
      monthOptionInYearDrop2St,
      dayOfTheWeekOptionInYearDropSt,
      orderOptionInYearDropSt,
      endRepeatOptionRadioSt,
      untilDateSt,
      endRepeatCountSpinSt,
      onUpdate,
    ]);

    const [t] = useTranslation();

    // TODO* create constants, use memo
    const repeatOptions = [
      { key: 'day', value: RRule.DAILY, text: t('common.day') },
      { key: 'week', value: RRule.WEEKLY, text: t('common.week') },
      { key: 'month', value: RRule.MONTHLY, text: t('common.month') },
      { key: 'year', value: RRule.YEARLY, text: t('common.year') },
    ];

    const orderOptions = [
      { key: 'first', value: 1, text: t('common.first') },
      { key: 'second', value: 2, text: t('common.second') },
      { key: 'third', value: 3, text: t('common.third') },
      { key: 'fourth', value: 4, text: t('common.fourth') },
      { key: 'last', value: -1, text: t('common.last') },
    ];

    const dayOfTheWeekOptions = [
      { key: 'day', value: DaysOfWeek.DAY, text: t('common.day') },
      { key: 'weekend day', value: DaysOfWeek.WEEKEND_DAY, text: t('common.weekendDay') },
      { key: 'weekday', value: DaysOfWeek.WEEKDAY, text: t('common.weekDay') },
    ];

    const getMonthsOptions = () => {
      return [...Array(12).keys()].map((m, index) => {
        const month = t('format:ofMonth', {
          postProcess: 'formatDate',
          value: Date.UTC(new Date().getUTCFullYear(), m),
        });

        return {
          key: index + 1,
          value: index + 1,
          text: month,
        };
      });
    };

    const monthsOptions = getMonthsOptions();

    // eslint-disable-next-line no-restricted-syntax
    for (const value of getWeek()) {
      const wd = format(value, 'iiii');
      dayOfTheWeekOptions.push({
        key: wd,
        value: mapDateToRRuleDayOfTheWeek(value.getDay()).toString(),
        text: wd,
      });
    }

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    const BoardMembershipsPopup = usePopup(BoardMembershipsStep); // TODO* port to scheduler
    const LabelsPopup = usePopup(LabelsStep);
    const DeletePopup = usePopup(DeleteStep); // TODO* port to scheduler
    const SchedulerEventMovePopup = usePopup(SchedulerEventMoveStep);

    const contentNode = (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={i18n.dateFns.getLocale()}>
        <Grid className={styles.grid}>
          <Grid.Row className={styles.headerPadding}>
            <Grid.Column width={16} className={styles.headerPadding}>
              <div className={styles.headerWrapper}>
                <Icon name="list alternate outline" className={styles.moduleIcon} />
                <div className={styles.headerTitleWrapper}>
                  {canEdit ? (
                    <NameField defaultValue={name} onUpdate={handleNameUpdate} />
                  ) : (
                    <div className={styles.headerTitle}>{name}</div>
                  )}
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className={styles.modalPadding}>
            <Grid.Column width={canEdit ? 12 : 16} className={styles.contentPadding}>
              <div className={styles.moduleWrapper}>
                <div className={styles.attachments}>
                  <div className={styles.text}>
                    {t('common.members', {
                      context: 'title',
                    })}
                  </div>
                  <span key={creatorUser.id} className={styles.attachment}>
                    {canEdit ? (
                      <BoardMembershipsPopup
                        items={allSchedulerMemberships}
                        currentUserIds={[creatorUser.id]}
                        onUserSelect={handleUserUpdate}
                        onUserDeselect={() => {}}
                      >
                        <User name={creatorUser.name} avatarUrl={creatorUser.avatarUrl} />
                      </BoardMembershipsPopup>
                    ) : (
                      <User name={creatorUser.name} avatarUrl={creatorUser.avatarUrl} />
                    )}
                  </span>
                </div>
                <div className={styles.attachments}>
                  <div className={styles.text}>
                    {t('common.labels', {
                      context: 'title',
                    })}
                  </div>
                  <span key={schedulerLabel.id} className={styles.attachment}>
                    {canEdit ? (
                      <LabelsPopup
                        key={schedulerLabel.id}
                        items={allLabels}
                        currentIds={[schedulerLabel.id]}
                        onSelect={handleLabelUpdate}
                        onDeselect={() => {}}
                        onCreate={onLabelCreate}
                        onUpdate={onLabelUpdate}
                        onMove={onLabelMove}
                        onDelete={onLabelDelete}
                      >
                        <Label name={schedulerLabel.name} color={schedulerLabel.color} />
                      </LabelsPopup>
                    ) : (
                      <Label name={schedulerLabel.name} color={schedulerLabel.color} />
                    )}
                  </span>
                </div>
              </div>
              {(description || canEdit) && (
                <div className={styles.contentModule}>
                  <div className={styles.moduleWrapper}>
                    <Icon name="align justify" className={styles.moduleIcon} />
                    <div className={styles.moduleHeader}>{t('common.description')}</div>
                    {canEdit ? (
                      <DescriptionEdit
                        defaultValue={description}
                        onUpdate={handleDescriptionUpdate}
                      >
                        {description ? (
                          <button
                            type="button"
                            className={classNames(styles.descriptionText, styles.cursorPointer)}
                          >
                            <Markdown linkStopPropagation linkTarget="_blank">
                              {description}
                            </Markdown>
                          </button>
                        ) : (
                          <button type="button" className={styles.descriptionButton}>
                            <span className={styles.descriptionButtonText}>
                              {t('action.addMoreDetailedDescription')}
                            </span>
                          </button>
                        )}
                      </DescriptionEdit>
                    ) : (
                      <div className={styles.descriptionText}>
                        <Markdown linkStopPropagation linkTarget="_blank">
                          {description}
                        </Markdown>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className={styles.contentModule}>
                <div className={styles.moduleWrapper}>
                  <Icon name="calendar alternate" className={styles.moduleIcon} />
                  <div className={styles.moduleHeader}>{t('common.start')}</div>
                  <DatePicker
                    disabled={!canEdit}
                    defaultValue={startDate}
                    value={startDateSt}
                    format="dd.MM.yyyy"
                    onChange={setStartDateSt}
                    minDate={parse('01.01.2000', 'dd.MM.yyyy', new Date())}
                    shouldDisableDate={shouldDisableStartDate}
                  />
                  <TimePicker
                    disabled={!canEdit || isAllDay}
                    defaultValue={startDateSt}
                    value={startDateSt}
                    onChange={setStartDateSt}
                    ampm={false}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                  />
                </div>
              </div>
              <div className={styles.contentModule}>
                <div className={styles.moduleWrapper}>
                  <Icon name="calendar alternate" className={styles.moduleIcon} />
                  <div className={styles.moduleHeader}>{t('common.end')}</div>
                  <DatePicker
                    disabled={!canEdit}
                    defaultValue={endDateSt}
                    value={endDateSt}
                    format="dd.MM.yyyy"
                    shouldDisableDate={shouldDisableEndDate}
                    minDate={startDate}
                    onChange={setEndDateSt}
                  />
                  <TimePicker
                    disabled={!canEdit || isAllDay}
                    defaultValue={endDateSt}
                    value={endDateSt}
                    onChange={setEndDateSt}
                    ampm={false}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                  />
                </div>
              </div>
              <div className={styles.contentModule}>
                <div className={styles.moduleWrapper}>
                  <Checkbox
                    className={styles.moduleCheckbox}
                    defaultChecked={isAllDay}
                    disabled={!canEdit}
                    onChange={handleIsAllDayUpdate}
                  />
                  <div className={styles.moduleHeader}>{t('common.allDay')}</div>
                </div>
              </div>
              <div className={styles.contentModule}>
                <div className={styles.moduleWrapper}>
                  <Checkbox
                    className={styles.moduleCheckbox}
                    defaultChecked={isRecurringSt}
                    disabled={!canEdit}
                    onChange={(e, data) => setIsRecurring(data.checked)}
                  />
                  <div className={styles.moduleHeader}>{t('common.repeatThisEvent')}</div>
                </div>
              </div>
              {isRecurring && (
                <>
                  <div className={styles.contentModule}>
                    <div className={styles.moduleWrapper}>
                      <Icon name="repeat" className={styles.moduleIcon} />
                      <div className={styles.moduleHeader}>
                        <div className={styles.contentText}>{t('common.repeatEvery')}</div>
                        <NumberInput
                          disabled={!canEdit}
                          min={1}
                          value={recurrenceIntervalSt}
                          onChange={(event, val) => setRecurrenceIntervalSt(val)}
                        />
                        <Dropdown
                          disabled={!canEdit}
                          placeholder="Select repeat option"
                          selection
                          options={repeatOptions}
                          defaultValue={repeatOptionDropSt}
                          onChange={(e, { value }) => setRepeatOptionDropSt(value)}
                        />
                        {repeatOptionDrop === RRule.WEEKLY && (
                          <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginRight: '10px',
                              }}
                            >
                              {t('common.on')}
                            </div>
                            {getWeek().map((day) => (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  marginRight: '10px',
                                }}
                                key={day.getDay()}
                              >
                                <span>{format(day, 'EEEEEE')}</span>
                                <Checkbox
                                  key={day.getDay()}
                                  value={day.getDay()}
                                  disabled={!canEdit}
                                  defaultChecked={daysOfTheWeekOptionCheckBoxesSt?.includes(
                                    mapDateToRRuleDayOfTheWeek(day.getDay()),
                                  )}
                                  onChange={(e, props) => {
                                    e.preventDefault();
                                    // eslint-disable-next-line react/prop-types
                                    if (props.checked) {
                                      const newState = daysOfTheWeekOptionCheckBoxes
                                        ? [...daysOfTheWeekOptionCheckBoxes]
                                        : [];
                                      // eslint-disable-next-line react/prop-types
                                      newState.push(mapDateToRRuleDayOfTheWeek(props.value));
                                      setDaysOfTheWeekOptionCheckBoxesSt(newState);
                                    } else {
                                      const newState = daysOfTheWeekOptionCheckBoxes
                                        ? [...daysOfTheWeekOptionCheckBoxes]
                                        : [];
                                      setDaysOfTheWeekOptionCheckBoxesSt(
                                        newState.filter(
                                          // eslint-disable-next-line react/prop-types
                                          (item) =>
                                            // eslint-disable-next-line react/prop-types
                                            item !== mapDateToRRuleDayOfTheWeek(props.value),
                                        ),
                                      );
                                    }
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {repeatOptionDrop === RRule.MONTHLY && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <FormField disabled={!canEdit}>
                              <Radio
                                disabled={!canEdit}
                                name="RadioGroup"
                                value="0"
                                checked={repeatOptionInMonthRadioSt === 0}
                                onChange={(e, { value }) => {
                                  e.preventDefault();
                                  setRepeatOptionInMonthRadioSt(Number(value));
                                }}
                              />
                              {t('common.dayOfMonth')}
                              <NumberInput
                                disabled={!canEdit || repeatOptionInMonthRadioSt !== 0}
                                min={1}
                                max={31}
                                value={dayOfMonthOptionInMonthSpinSt}
                                onChange={(event, val) => setDayOfMonthOptionInMonthSpinSt(val)}
                              />
                            </FormField>
                            <FormField disabled={!canEdit}>
                              <Radio
                                disabled={!canEdit}
                                name="RadioGroup"
                                value="1"
                                checked={repeatOptionInMonthRadioSt === 1}
                                onChange={(e, { value }) => {
                                  e.preventDefault();
                                  setRepeatOptionInMonthRadioSt(Number(value));
                                }}
                              />
                              {t('common.the')}
                              <Dropdown
                                disabled={!canEdit || repeatOptionInMonthRadioSt !== 1}
                                placeholder="Select order option"
                                selection
                                options={orderOptions}
                                value={orderOptionInMonthDropSt}
                                onChange={(e, { value }) => setOrderOptionInMonthDropSt(value)}
                              />
                              <Dropdown
                                disabled={!canEdit || repeatOptionInMonthRadioSt !== 1}
                                placeholder="Select week option"
                                selection
                                options={dayOfTheWeekOptions}
                                value={dayOfTheWeekOptionInMonthDropSt}
                                onChange={(e, { value }) => {
                                  setDayOfTheWeekOptionInMonthDropSt(value);
                                }}
                              />
                            </FormField>
                          </div>
                        )}
                        {repeatOptionDrop === RRule.YEARLY && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <FormField disabled={!canEdit}>
                              <Radio
                                disabled={!canEdit}
                                name="RadioGroup"
                                value="0"
                                checked={repeatOptionInYearRadioSt === 0}
                                onChange={(e, { value }) => {
                                  e.preventDefault();
                                  setRepeatOptionInYearRadioSt(Number(value));
                                }}
                              />
                              {t('common.onThe')}
                              <NumberInput
                                disabled={!canEdit || repeatOptionInYearRadioSt !== 0}
                                min={1}
                                max={31}
                                value={dayOfMonthOptionInYearSpinSt}
                                onChange={(event, val) => setDayOfMonthOptionInYearSpinSt(val)}
                              />
                              {t('common.ofThe')}
                              <Dropdown
                                disabled={!canEdit || repeatOptionInYearRadioSt !== 0}
                                placeholder="Select month"
                                selection
                                options={monthsOptions}
                                value={monthOptionInYearDrop1St}
                                onChange={(e, { value }) => setMonthOptionInYearDrop1St(value)}
                              />
                            </FormField>
                            <FormField disabled={!canEdit}>
                              <Radio
                                disabled={!canEdit}
                                name="RadioGroup"
                                value="1"
                                checked={repeatOptionInYearRadioSt === 1}
                                onChange={(e, { value }) => {
                                  e.preventDefault();
                                  setRepeatOptionInYearRadioSt(Number(value));
                                }}
                              />
                              {t('common.the')}
                              <Dropdown
                                disabled={!canEdit || repeatOptionInYearRadioSt !== 1}
                                placeholder="Select day option"
                                selection
                                options={orderOptions}
                                value={orderOptionInYearDropSt}
                                onChange={(e, { value }) => setOrderOptionInYearDropSt(value)}
                              />
                              <Dropdown
                                disabled={!canEdit || repeatOptionInYearRadioSt !== 1}
                                placeholder="Select week option"
                                selection
                                options={dayOfTheWeekOptions}
                                value={dayOfTheWeekOptionInYearDropSt}
                                onChange={(e, { value }) =>
                                  setDayOfTheWeekOptionInYearDropSt(value)
                                }
                              />
                              {t('common.ofEvery')}
                              <Dropdown
                                disabled={!canEdit || repeatOptionInYearRadioSt !== 1}
                                placeholder="Select month"
                                selection
                                options={monthsOptions}
                                value={monthOptionInYearDrop2St}
                                onChange={(e, { value }) => setMonthOptionInYearDrop2St(value)}
                              />
                            </FormField>
                          </div>
                        )}
                        {/* t('common.description') */}
                      </div>
                    </div>
                  </div>
                  <div className={styles.contentModule}>
                    <div className={styles.moduleWrapper}>
                      <div className={styles.moduleHeader}>{t('common.endRepeat')}</div>
                      <Icon name="stop circle" className={styles.moduleIcon} />
                      <div className={styles.moduleHeader}>
                        <FormField>
                          <Radio
                            disabled={!canEdit}
                            name="EndRepeatRadioGroup"
                            value="0"
                            checked={endRepeatOptionRadioSt === 0}
                            onChange={(e, { value }) => {
                              e.preventDefault();
                              setEndRepeatOptionRadioSt(Number(value));
                            }}
                          />
                          {t('common.never')}
                        </FormField>
                        <FormField>
                          <Radio
                            disabled={!canEdit}
                            name="EndRepeatRadioGroup"
                            value="1"
                            checked={endRepeatOptionRadioSt === 1}
                            onChange={(e, { value }) => {
                              e.preventDefault();
                              setEndRepeatOptionRadioSt(Number(value));
                            }}
                          />
                          {t('common.date')}
                          {untilDate && (
                            <DatePicker
                              disabled={!canEdit || endRepeatOptionRadioSt !== 1}
                              label=""
                              name="startDate"
                              format="dd.MM.yyyy"
                              defaultValue={untilDateSt}
                              onChange={setUntilDateSt}
                            />
                          )}
                        </FormField>
                        <FormField>
                          <Radio
                            disabled={!canEdit}
                            name="EndRepeatRadioGroup"
                            value="2"
                            checked={endRepeatOptionRadioSt === 2}
                            onChange={(e, { value }) => {
                              e.preventDefault();
                              setEndRepeatOptionRadioSt(Number(value));
                            }}
                          />
                          {t('common.afterSeveralOccurrences')}
                          {endRepeatCountSpin && (
                            <NumberInput
                              disabled={!canEdit || endRepeatOptionRadioSt !== 2}
                              min={1}
                              max={31}
                              value={endRepeatCountSpinSt}
                              onChange={(event, val) => setEndRepeatCountSpinSt(val)}
                            />
                          )}
                        </FormField>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Grid.Column>
            {canEdit && (
              <Grid.Column width={4} className={styles.sidebarPadding}>
                <div className={styles.actions}>
                  <span className={styles.actionsTitle}>{t('action.addToCard')}</span>
                  <BoardMembershipsPopup
                    items={allSchedulerMemberships}
                    currentUserIds={[creatorUser.id]}
                    onUserSelect={handleUserUpdate}
                    onUserDeselect={() => {}}
                  >
                    <Button fluid className={styles.actionButton}>
                      <Icon name="user outline" className={styles.actionIcon} />
                      {t('common.members')}
                    </Button>
                  </BoardMembershipsPopup>
                  <LabelsPopup
                    items={allLabels}
                    currentIds={[schedulerLabel.id]}
                    onSelect={handleLabelUpdate}
                    onDeselect={() => {}}
                    onCreate={onLabelCreate}
                    onUpdate={onLabelUpdate}
                    onMove={onLabelMove}
                    onDelete={onLabelDelete}
                  >
                    <Button fluid className={styles.actionButton}>
                      <Icon name="bookmark outline" className={styles.actionIcon} />
                      {t('common.labels')}
                    </Button>
                  </LabelsPopup>
                  {/* <DueDateEditPopup defaultValue={dueDate} onUpdate={handleDueDateUpdate}> */}
                  {/*   <Button fluid className={styles.actionButton}> */}
                  {/*     <Icon name="calendar check outline" className={styles.actionIcon} /> */}
                  {/*     {t('common.dueDate', { */}
                  {/*       context: 'title', */}
                  {/*     })} */}
                  {/*   </Button> */}
                  {/* </DueDateEditPopup> */}
                  {/* <StopwatchEditPopup defaultValue={stopwatch} onUpdate={handleStopwatchUpdate}> */}
                  {/*   <Button fluid className={styles.actionButton}> */}
                  {/*     <Icon name="clock outline" className={styles.actionIcon} /> */}
                  {/*     {t('common.stopwatch')} */}
                  {/*   </Button> */}
                  {/* </StopwatchEditPopup> */}
                  {/* <AttachmentAddPopup onCreate={onAttachmentCreate}> */}
                  {/*   <Button fluid className={styles.actionButton}> */}
                  {/*     <Icon name="attach" className={styles.actionIcon} /> */}
                  {/*     {t('common.attachment')} */}
                  {/*   </Button> */}
                  {/* </AttachmentAddPopup> */}
                </div>
                <div className={styles.actions}>
                  <span className={styles.actionsTitle}>{t('common.actions')}</span>
                  {/* <Button */}
                  {/*   fluid */}
                  {/*   className={styles.actionButton} */}
                  {/*   onClick={handleToggleSubscriptionClick} */}
                  {/* > */}
                  {/*   <Icon name="paper plane outline" className={styles.actionIcon} /> */}
                  {/*   {isSubscribed ? t('action.unsubscribe') : t('action.subscribe')} */}
                  {/* </Button> */}
                  <SchedulerEventMovePopup
                    schedulersToLists={allSchedulersToLists} // TODO* port to scheduler
                    defaultPath={{
                      schedulerId,
                    }}
                    // onMove={onMove}
                    onTransfer={onTransfer}
                    // onBoardFetch={onBoardFetch}
                  >
                    <Button
                      fluid
                      className={styles.actionButton}
                      // onClick={handleToggleSubscriptionClick}
                    >
                      <Icon name="share square outline" className={styles.actionIcon} />
                      {t('action.move')}
                    </Button>
                  </SchedulerEventMovePopup>
                  <DeletePopup
                    title="common.deleteCard"
                    content="common.areYouSureYouWantToDeleteThisCard"
                    buttonContent="action.deleteCard"
                    onConfirm={onDelete}
                  >
                    <Button fluid className={styles.actionButton}>
                      <Icon name="trash alternate outline" className={styles.actionIcon} />
                      {t('action.delete')}
                    </Button>
                  </DeletePopup>
                </div>
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
      </LocalizationProvider>
    );

    return (
      <Modal open closeIcon centered={false} onClose={handleClose} className={styles.wrapper}>
        {contentNode}
      </Modal>
    );
  },
);

EventModal.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  startDate: PropTypes.instanceOf(Date).isRequired,
  untilDate: PropTypes.instanceOf(Date),
  isAllDay: PropTypes.bool.isRequired,
  isRecurring: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
  schedulerId: PropTypes.string.isRequired,
  // test
  recurrenceInterval: PropTypes.number,
  repeatOptionDrop: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  daysOfTheWeekOptionCheckBoxes: PropTypes.array.isRequired,
  repeatOptionInMonthRadio: PropTypes.number,
  dayOfMonthOptionInMonthSpin: PropTypes.number,
  orderOptionInMonthDrop: PropTypes.number,
  dayOfTheWeekOptionInMonthDrop: PropTypes.string,
  repeatOptionInYearRadio: PropTypes.number,
  dayOfMonthOptionInYearSpin: PropTypes.number,
  monthOptionInYearDrop1: PropTypes.number,
  monthOptionInYearDrop2: PropTypes.number,
  orderOptionInYearDrop: PropTypes.number,
  dayOfTheWeekOptionInYearDrop: PropTypes.string,
  endRepeatOptionRadio: PropTypes.number,
  endRepeatCountSpin: PropTypes.number,
  // end test
  // eslint-disable-next-line react/forbid-prop-types
  creatorUser: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  schedulerLabel: PropTypes.object.isRequired,
  /* eslint-disable react/forbid-prop-types */
  allSchedulersToLists: PropTypes.array.isRequired,
  allSchedulerMemberships: PropTypes.array.isRequired,
  allLabels: PropTypes.array.isRequired,
  canEdit: PropTypes.bool.isRequired,
  canEditCommentActivities: PropTypes.bool.isRequired,
  canEditAllCommentActivities: PropTypes.bool.isRequired,

  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onTransfer: PropTypes.func.isRequired,
  onLabelCreate: PropTypes.func.isRequired,
  onLabelUpdate: PropTypes.func.isRequired,
  onLabelMove: PropTypes.func.isRequired,
  onLabelDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

EventModal.defaultProps = {
  description: undefined,
  untilDate: undefined,
  recurrenceInterval: 1,
  // eslint-disable-next-line react/default-props-match-prop-types
  repeatOptionDrop: RRule.DAILY,
  repeatOptionInMonthRadio: 0,
  dayOfMonthOptionInMonthSpin: 1,
  orderOptionInMonthDrop: 1,
  dayOfTheWeekOptionInMonthDrop: DaysOfWeek.DAY,
  repeatOptionInYearRadio: 0,
  dayOfMonthOptionInYearSpin: 1,
  monthOptionInYearDrop1: 1,
  monthOptionInYearDrop2: 1,
  orderOptionInYearDrop: 1,
  dayOfTheWeekOptionInYearDrop: DaysOfWeek.DAY,
  endRepeatOptionRadio: 0,
  endRepeatCountSpin: 1,
};

export default EventModal;
