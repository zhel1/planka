import { endOfMonth, endOfWeek, startOfWeek } from 'date-fns';
import { DateTime } from 'luxon';
import { RRule } from 'rrule';

function splitEventByWeek(event, startDate) {
  const htmlEvents = [];
  let durationRemains = event.duration * 1000;

  let tillTheEndOfTheWeek = endOfWeek(startDate).getTime() - startDate.getTime();
  if (tillTheEndOfTheWeek > 7 * 24 * 60 * 60 * 1000) {
    tillTheEndOfTheWeek %= 7 * 24 * 60 * 60 * 1000;
  }

  if (durationRemains > tillTheEndOfTheWeek) {
    let newStartDate = startDate;

    while (durationRemains > 0) {
      const htmlEvent = {
        apiEvent: event,
        startDate: newStartDate,
        duration: Math.min(tillTheEndOfTheWeek, durationRemains) / 1000,
      };
      htmlEvents.push(htmlEvent);

      durationRemains -= Math.min(tillTheEndOfTheWeek, durationRemains);
      newStartDate = new Date(newStartDate.getTime() + 1 + htmlEvent.duration * 1000); // 1 ms for to go next day
      tillTheEndOfTheWeek = 7 * 24 * 60 * 60 * 1000;
    }
  } else {
    const htmlEvent = {
      apiEvent: event,
      startDate: new Date(startDate),
      duration: event.duration,
    };
    htmlEvents.push(htmlEvent);
  }
  return htmlEvents;
}

const disperseEventOnMonthView = (events, firstDayCurrentMonth) => {
  const detailedEvents = [];

  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];
    if (event && event.isRecurring && event.recurrencePattern) {
      const rule = RRule.fromString(event.recurrencePattern);

      // we may have events, which started earlier, but continues at this time
      const dateToStartCalculateEventsFrom = new Date(
        startOfWeek(firstDayCurrentMonth).getTime() -
          (event.duration + (event.isAllDay ? 1 : 0)) * 1000,
      );

      rule
        .between(dateToStartCalculateEventsFrom, endOfWeek(endOfMonth(firstDayCurrentMonth))) // occurrences UTC
        .map((date) =>
          DateTime.fromJSDate(date).toUTC().setZone('local', { keepLocalTime: true }).toJSDate(),
        )
        .map((startDate) => detailedEvents.push(...splitEventByWeek(event, startDate)));
    } else {
      // detailedEvents.push(...splitEventByWeek(event, event.startDate));
      detailedEvents.push(
        ...splitEventByWeek(
          event,
          DateTime.fromJSDate(event.startDate)
            .toUTC()
            .setZone('local', { keepLocalTime: true })
            .toJSDate(),
        ),
      );
    }
  }

  return detailedEvents;
};

export default disperseEventOnMonthView;
