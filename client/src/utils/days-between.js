const daysBetween = (date, duration) => {
  const theBeginningOfTheStartDay = new Date(date);
  theBeginningOfTheStartDay.setHours(0);
  theBeginningOfTheStartDay.setMinutes(0);
  theBeginningOfTheStartDay.setSeconds(0);
  theBeginningOfTheStartDay.setMilliseconds(0);

  const theBeginningOfTheLastDay = new Date(date.getTime() + duration);
  theBeginningOfTheLastDay.setHours(0);
  theBeginningOfTheLastDay.setMinutes(0);
  theBeginningOfTheLastDay.setSeconds(0);
  theBeginningOfTheLastDay.setMilliseconds(0);

  const result =
    (theBeginningOfTheLastDay.getTime() - theBeginningOfTheStartDay.getTime()) /
    (24 * 60 * 60 * 1000);

  if (theBeginningOfTheLastDay.getTime() !== date.getTime() + duration) {
    return result + 1;
  }
  return result;
};

export default daysBetween;
