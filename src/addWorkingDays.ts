import { addDays, addMinutes, format, isWeekend, parse } from 'date-fns';
import { dateFormat } from './const';
import { adjustToWorkHours, isHoliday, isRecurringHoliday } from './utils';

export const addWorkingDays = (input: {
  StartDate: string;
  Increment: number;
  WorkdayStart: { Hours: number; Minutes: number };
  WorkdayStop: { Hours: number; Minutes: number };
  RecurringHolidays?: { Month: number; Day: number }[];
  Holidays?: { Year: number; Month: number; Day: number }[];
}) => {
  const startDate = parse(input.StartDate, dateFormat, new Date(), {
    useAdditionalWeekYearTokens: true,
  });

//   console.debug(`sd: ${startDate}`);
  const increment = input.Increment;
  const workdayStartHours = input.WorkdayStart.Hours;
  const workdayStartMinutes = input.WorkdayStart.Minutes;
  const workdayStopHours = input.WorkdayStop.Hours;
  const workdayStopMinutes = input.WorkdayStop.Minutes;
  const hoursInWorkDay = workdayStopHours - workdayStartHours;
  const daysDirection = increment < 0 ? -1 : 1;
  const holidays = input.Holidays || [];
  const recurringHolidays = input.RecurringHolidays || [];

  // If we are outside work hours, go forward to start of next day, or backward to end of previous day
  let currentDate = adjustToWorkHours(
    startDate,
    workdayStartHours,
    workdayStartMinutes,
    workdayStopHours,
    workdayStopMinutes,
    daysDirection
  );
//   console.debug(`adjusted: ${currentDate}`);
  let daysToAdd = Math.abs(increment);
  while (daysToAdd > 0) {
    // console.debug(`cd: ${currentDate}, daysToAdd: ${daysToAdd}`);
    const previousDate = currentDate;
    if (daysToAdd >= 1) {
      currentDate = addDays(currentDate, daysDirection);
    } else {
    //   console.debug(`partialDay: ${daysToAdd}`);
      const hoursToAdd = hoursInWorkDay * daysToAdd;
      const minutesToAdd = hoursToAdd * 60;

      currentDate = addMinutes(currentDate, minutesToAdd * daysDirection);

      daysToAdd = 0;
    }

    // Skip weekends and holidays
    if (
      isWeekend(previousDate) ||
      isHoliday(previousDate, holidays) ||
      isRecurringHoliday(previousDate, recurringHolidays)
    ) {
    //   console.debug(`skipping ${previousDate.getDate()}`);
      continue;
    }

    daysToAdd--;
  }

  const formattedResult = format(currentDate, 'dd-MM-yyyy HH:mm');

  console.log(formattedResult);
  return formattedResult;
};
