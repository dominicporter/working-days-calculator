import { addDays, isAfter, isBefore, isSameDay, set } from 'date-fns';

export const isHoliday = (date: Date, holidays: any[]): boolean => {
  return holidays.some((holiday) =>
    isSameDay(date, new Date(holiday.Year, holiday.Month - 1, holiday.Day))
  );
};

export const isRecurringHoliday = (
  date: Date,
  recurringHolidays: any[]
): boolean => {
  return recurringHolidays.some(
    (holiday) =>
      date.getDate() === holiday.Day && date.getMonth() + 1 === holiday.Month
  );
};

export const adjustToWorkHours = (
  currentDate: Date,
  workdayStartHours: number,
  workdayStartMinutes: number,
  workdayStopHours: number,
  workdayStopMinutes: number,
  daysDirection: number
) => {
  const workStart = set(currentDate, {
    hours: workdayStartHours,
    minutes: workdayStartMinutes,
  });
  const workEnd = set(currentDate, {
    hours: workdayStopHours,
    minutes: workdayStopMinutes,
  });

  if (isBefore(currentDate, workStart)) {
    // console.debug('before');
    if (daysDirection < 0) {
      currentDate = addDays(workEnd, -1);
    } else {
      currentDate = workStart;
    }
  } else if (isAfter(currentDate, workEnd)) {
    // console.debug('after');
    if (daysDirection < 0) {
      currentDate = workEnd;
    } else {
      currentDate = addDays(workStart, 1);
    }
  }
  return currentDate;
};
