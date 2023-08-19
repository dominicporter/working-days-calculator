import yargs from 'yargs';
import {
  addDays,
  set,
  isWeekend,
  isBefore,
  isAfter,
  format,
  addHours,
  isSameDay,
} from 'date-fns';
import { parse } from 'date-fns';

const WORK_WEEKDAYS = [1, 2, 3, 4, 5]; // Monday to Friday

const argv = yargs(process.argv.slice(2)).options({
  json: {
    demandOption: true,
    describe: 'Input JSON object',
    type: 'string',
  },
}).argv as { json: string };

try {
  const input = JSON.parse(argv.json);

  if (!input.StartDate || !input.Increment) {
    throw new Error('StartDate and Increment are required.');
  }

  const dateFormat = 'dd-MM-yyyy HH:mm'; // Define the format of the input date string

  const startDate = parse(input.StartDate, dateFormat, new Date(), {
    useAdditionalWeekYearTokens: true,
  });

  console.log(`sd: ${startDate}`);
  const increment = parseFloat(input.Increment);
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
  console.log(`adjusted: ${currentDate}`);
  let daysToAdd = Math.abs(increment);
  while (daysToAdd > 0) {
    console.log(`cd: ${currentDate}, daysToAdd: ${daysToAdd}`);
    const previousDate = currentDate;
    if (daysToAdd >= 1) {
      currentDate = addDays(currentDate, daysDirection);
    } else {
      console.log(`partialDay: ${daysToAdd}`);
      const hoursToAdd = Math.round(hoursInWorkDay * daysToAdd);
      currentDate = addHours(currentDate, hoursToAdd * daysDirection);

      daysToAdd = 0;
    }

    // Skip weekends and holidays
    if (
      isWeekend(previousDate) ||
      isHoliday(previousDate, holidays) ||
      isRecurringHoliday(previousDate, recurringHolidays)
    ) {
      console.log(`skipping ${previousDate.getDate()}`);
      continue;
    }

    daysToAdd--;
  }

  const formattedResult = format(currentDate, 'dd-MM-yyyy HH:mm');

  console.log(formattedResult);
} catch (error: any) {
  console.error('Error processing JSON:', error.message);
}

function adjustToWorkHours(
  currentDate: any,
  workdayStartHours: any,
  workdayStartMinutes: any,
  workdayStopHours: any,
  workdayStopMinutes: any,
  daysDirection: number
) {
  const workStart = set(currentDate, {
    hours: workdayStartHours,
    minutes: workdayStartMinutes,
  });
  const workEnd = set(currentDate, {
    hours: workdayStopHours,
    minutes: workdayStopMinutes,
  });

  console.log(`ws: ${workStart}`);
  if (isBefore(currentDate, workStart)) {
    console.log('before');
    if (daysDirection < 0) {
      currentDate = addDays(workEnd, -1);
    } else {
      currentDate = workStart;
    }
  } else if (isAfter(currentDate, workEnd)) {
    console.log('after');
    if (daysDirection < 0) {
      currentDate = workEnd;
    } else {
      currentDate = addDays(workStart, 1);
    }
  }
  return currentDate;
}

function isHoliday(date: Date, holidays: any[]): boolean {
  return holidays.some((holiday) =>
    isSameDay(date, new Date(holiday.Year, holiday.Month - 1, holiday.Day))
  );
}

function isRecurringHoliday(date: Date, recurringHolidays: any[]): boolean {
  return recurringHolidays.some(
    (holiday) =>
      date.getDate() === holiday.Day && date.getMonth() + 1 === holiday.Month
  );
}
