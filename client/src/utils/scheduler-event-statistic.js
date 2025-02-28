import { RRule } from 'rrule';

// TODO remove duplicated code
const statistic = (events, startDate, endDate) => {
  const stat = {
    statByUserId: {},
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const event of events) {
    if (event.isRecurring) {
      const occurrences = RRule.fromString(event.recurrencePattern).between(
        startDate,
        endDate,
        true,
      );

      // eslint-disable-next-line no-restricted-syntax
      for (const occur of occurrences) {
        const durationTillEndDate = Math.min(
          event.duration,
          (endDate.getTime() - occur.getTime()) / 1000,
          (occur.getTime() + event.duration * 1000 - startDate.getTime()) / 1000,
          (endDate.getTime() - startDate.getTime()) / 1000,
        );

        const { creatorUserId, schedulerLabelId } = event;
        stat.statByUserId[creatorUserId] = stat.statByUserId[creatorUserId] || {
          statByLabelId: {},
        };
        stat.statByUserId[creatorUserId].statByLabelId[schedulerLabelId] = stat.statByUserId[
          creatorUserId
        ].statByLabelId[schedulerLabelId] || {
          eventCount: 0,
        };

        const count = Math.ceil(durationTillEndDate / (24 * 60 * 60));
        stat.statByUserId[creatorUserId].statByLabelId[schedulerLabelId].eventCount += count;
      }
    } else if (
      event.startDate.getTime() <= endDate.getTime() &&
      event.startDate.getTime() + event.duration * 1000 >= startDate.getTime()
    ) {
      const durationTillEndDate = Math.min(
        event.duration,
        (endDate.getTime() - event.startDate.getTime()) / 1000,
        (event.startDate.getTime() + event.duration * 1000 - startDate.getTime()) / 1000,
        (endDate.getTime() - startDate.getTime()) / 1000,
      );

      const { creatorUserId, schedulerLabelId } = event;
      stat.statByUserId[creatorUserId] = stat.statByUserId[creatorUserId] || { statByLabelId: {} };
      stat.statByUserId[creatorUserId].statByLabelId[schedulerLabelId] = stat.statByUserId[
        creatorUserId
      ].statByLabelId[schedulerLabelId] || {
        eventCount: 0,
      };

      const count = Math.ceil(durationTillEndDate / (24 * 60 * 60));
      stat.statByUserId[creatorUserId].statByLabelId[schedulerLabelId].eventCount += count;
    }
  }

  return stat;
};

export default statistic;
