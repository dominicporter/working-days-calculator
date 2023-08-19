import yargs, { Argv } from 'yargs';
import { addDays, set, isWeekend, isBefore, isAfter, format } from 'date-fns';
import { parse } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

const WORK_START_HOUR = 8;
const WORK_END_HOUR = 16;
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
  // console.log(`id: ${inputDate}`);
  // const startDate = zonedTimeToUtc( inputDate, 'Europe/London');

  console.log(`sd: ${startDate}`);
  const increment = parseFloat(input.Increment);

  let currentDate = startDate;
  let daysToAdd = Math.abs(increment);
  console.log(daysToAdd);
  while (daysToAdd > 0) {
    currentDate = addDays(currentDate, increment < 0 ? -1 : 1);
    console.log(currentDate);

    // Skip weekends
    if (isWeekend(currentDate)) {
      continue;
    }

    const workStart = set(currentDate, { hours: WORK_START_HOUR, minutes: 0 });
    const workEnd = set(currentDate, { hours: WORK_END_HOUR, minutes: 0 });

    console.log(`ws: ${workStart}`);
    if (isBefore(currentDate, workStart)) {
      currentDate = workStart;
    } else if (isAfter(currentDate, workEnd)) {
      currentDate = addDays(workStart, 1);
    }

    daysToAdd--;
  }

  const formattedResult = format(currentDate, 'dd-MM-yyyy HH:mm');

  console.log(formattedResult);
} catch (error: any) {
  console.error('Error processing JSON:', error.message);
}
