import { connect } from 'react-redux';
import omit from 'lodash/omit';
import { bindActionCreators } from 'redux';
import { RRule } from 'rrule';
import { BoardMembershipRoles, DaysOfWeek } from '../constants/Enums';
import { push } from '../lib/redux-router';

import Paths from '../constants/Paths';
import entryActions from '../entry-actions';
import selectors from '../selectors';
import EventModal from '../components/Scheduler/components/EventModal/EventModal';
import { createDateAsLocal } from '../utils/time-convertor';

const mapStateToProps = (state) => {
  const allSchedulersToLists = selectors.selectSchedulersToListsForCurrentUser(state);
  const isCurrentUserManager = selectors.selectIsCurrentUserManagerForCurrentScheduler(state);
  const allSchedulerMemberships = selectors.selectMembershipsForCurrentScheduler(state);
  const allLabels = selectors.selectLabelsForCurrentScheduler(state);
  const currentUserMembership = selectors.selectCurrentUserMembershipForCurrentScheduler(state);

  const {
    name,
    description,
    startDate,
    untilDate, // TODO DRY
    isAllDay,
    isRecurring,
    duration,
    recurrencePattern,
    schedulerId,
  } = selectors.selectCurrentSchedulerEvent(state);

  const creatorUser = selectors.selectCreatorUserForCurrentSchedulerEvent(state);
  const schedulerLabel = selectors.selectLabelForCurrentSchedulerEvent(state);

  let isCurrentUserEditor = false;
  let isCurrentUserEditorOrCanComment = false;

  if (currentUserMembership) {
    isCurrentUserEditor = currentUserMembership.role === BoardMembershipRoles.EDITOR;
    isCurrentUserEditorOrCanComment = isCurrentUserEditor || currentUserMembership.canComment;
  }

  // test
  let recurrenceInterval;
  let repeatOptionDrop;
  let daysOfTheWeekOptionCheckBoxes = [];
  let repeatOptionInMonthRadio;
  let dayOfMonthOptionInMonthSpin;
  let orderOptionInMonthDrop;
  let dayOfTheWeekOptionInMonthDrop;
  let repeatOptionInYearRadio;
  let dayOfMonthOptionInYearSpin;
  let monthOptionInYearDrop1;
  let monthOptionInYearDrop2;
  let orderOptionInYearDrop;
  let dayOfTheWeekOptionInYearDrop;
  let endRepeatOptionRadio;
  let endRepeatCountSpin;
  // let untilDate1; // TODO DRY

  if (isRecurring) {
    const rrule = RRule.parseString(recurrencePattern);
    recurrenceInterval = rrule.interval;
    repeatOptionDrop = rrule.freq;

    switch (rrule.freq) {
      case RRule.DAILY:
        break;
      case RRule.WEEKLY:
        daysOfTheWeekOptionCheckBoxes = rrule.byweekday ?? [];
        break;
      case RRule.MONTHLY:
        if (rrule.bymonthday !== undefined && rrule.bymonthday > 0) {
          repeatOptionInMonthRadio = 0;
          dayOfMonthOptionInMonthSpin = rrule.bymonthday;
        } else {
          repeatOptionInMonthRadio = 1;
          orderOptionInMonthDrop = rrule.bysetpos;

          if (rrule.byweekday === undefined) {
            break;
          }

          // TODO* depends on locale
          if (
            rrule.byweekday.length === 2 &&
            rrule.byweekday.includes(RRule.SA) &&
            rrule.byweekday.includes(RRule.SU)
          ) {
            dayOfTheWeekOptionInMonthDrop = DaysOfWeek.WEEKEND_DAY;
          } else if (
            rrule.byweekday.length === 5 &&
            rrule.byweekday.includes(RRule.MO) &&
            rrule.byweekday.includes(RRule.TU) &&
            rrule.byweekday.includes(RRule.WE) &&
            rrule.byweekday.includes(RRule.TH) &&
            rrule.byweekday.includes(RRule.FR)
          ) {
            dayOfTheWeekOptionInMonthDrop = DaysOfWeek.WEEKDAY;
          } else {
            // eslint-disable-next-line prefer-destructuring
            dayOfTheWeekOptionInMonthDrop = rrule.byweekday[0];
          }
        }
        break;
      case RRule.YEARLY:
        if (rrule.bymonthday !== undefined && rrule.bymonthday > 0) {
          repeatOptionInYearRadio = 0;
          dayOfMonthOptionInYearSpin = rrule.bymonthday;
          monthOptionInYearDrop1 = rrule.bymonth;
        } else {
          repeatOptionInYearRadio = 1;
          monthOptionInYearDrop2 = rrule.bymonth;

          orderOptionInYearDrop = rrule.bymonthday;

          if (rrule.byweekday === undefined) {
            break;
          }

          // TODO* depends on locale
          if (
            rrule.byweekday.length === 2 &&
            rrule.byweekday.includes(RRule.SA) &&
            rrule.byweekday.includes(RRule.SU)
          ) {
            dayOfTheWeekOptionInYearDrop = DaysOfWeek.WEEKEND_DAY;
          } else if (
            rrule.byweekday.length === 5 &&
            rrule.byweekday.includes(RRule.MO) &&
            rrule.byweekday.includes(RRule.TU) &&
            rrule.byweekday.includes(RRule.WE) &&
            rrule.byweekday.includes(RRule.TH) &&
            rrule.byweekday.includes(RRule.FR)
          ) {
            dayOfTheWeekOptionInYearDrop = DaysOfWeek.WEEKDAY;
          } else {
            // eslint-disable-next-line prefer-destructuring
            dayOfTheWeekOptionInYearDrop = rrule.byweekday[0];
          }
        }
        break;
      default:
    }

    if (rrule.until === undefined && rrule.count === undefined) {
      endRepeatOptionRadio = 0;
    } else if (rrule.until) {
      endRepeatOptionRadio = 1;
      // untilDate1 = rrule.until; // TODO* DRY
    } else if (rrule.count) {
      endRepeatOptionRadio = 2;
      endRepeatCountSpin = rrule.count;
    }
  }

  // end test

  return {
    name,
    description,
    startDate: createDateAsLocal(startDate),
    untilDate, // TODO DRY
    isAllDay,
    isRecurring,
    duration,
    recurrencePattern,
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
    // test

    allSchedulersToLists,
    allSchedulerMemberships,
    allLabels,
    canEdit: isCurrentUserEditor,
    canEditCommentActivities: isCurrentUserEditorOrCanComment,
    canEditAllCommentActivities: isCurrentUserManager,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onUpdate: entryActions.updateCurrentSchedulerEvent,
      onDelete: entryActions.deleteCurrentSchedulerEvent,
      onTransfer: entryActions.transferCurrentSchedulerEvent,
      onLabelCreate: entryActions.createSchedulerLabelInCurrentScheduler,
      onLabelUpdate: entryActions.updateSchedulerLabel,
      onLabelMove: entryActions.moveSchedulerLabel,
      onLabelDelete: entryActions.deleteSchedulerLabel,
      push,
    },
    dispatch,
  );

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...omit(dispatchProps, 'push'),
  onClose: () => dispatchProps.push(Paths.SCHEDULERS.replace(':id', stateProps.schedulerId)),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(EventModal);
