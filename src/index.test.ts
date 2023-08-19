import { spawnSync } from 'child_process';

describe('Date Calculation Script', () => {
  it.each([
    {
      input: {
        // over a weekend
        StartDate: '14-05-2004 12:05',
        Increment: 2,
      },
      expected: '18-05-2004 12:05',
    },
    {
      input: {
        StartDate: '24-05-2004 12:05',
        Increment: 2,
      },
      expected: '26-05-2004 12:05',
    },
    {
      input: {
        StartDate: '24-05-2004 10:05',
        Increment: 2.5,
      },
      expected: '26-05-2004 14:05',
    },
    {
      input: {
        StartDate: '26-05-2004 12:05',
        Increment: -2,
      },
      expected: '24-05-2004 12:05',
    },
    {
      input: {
        StartDate: '17-05-2004 12:05',
        Increment: -2,
      },
      expected: '13-05-2004 12:05',
    },
    {
      input: {
        StartDate: '26-05-2004 14:15',
        Increment: -2.5,
      },
      expected: '24-05-2004 10:15',
    },
    {
      input: {
        // Start after work hours
        StartDate: '24-05-2004 18:05',
        Increment: 2.5,
      },
      expected: '27-05-2004 12:00',
    },
    {
      input: {
        // Start before work hours
        StartDate: '24-05-2004 07:12',
        Increment: 2.5,
      },
      expected: '26-05-2004 12:00',
    },
    {
      input: {
        // Start after work hours
        StartDate: '20-05-2004 18:05',
        Increment: -2.5,
      },
      expected: '18-05-2004 12:00',
    },
    {
      input: {
        // Start before work hours
        StartDate: '20-05-2004 07:11',
        Increment: -2.5,
      },
      expected: '17-05-2004 12:00',
    },
    {
      input: {
        // Start before work hours
        StartDate: '24-05-2004 07:12',
        Increment: -5.5,
        Holidays: [{ Year: 2004, Month: 5, Day: 21 }],
      },
      expected: '13-05-2004 12:00',
    },
    {
      input: {
        // Start before work hours
        StartDate: '24-05-2004 07:13',
        Increment: -5.5,
        // 2 days holiday in range
        RecurringHolidays: [{ Month: 5, Day: 19 }],
        Holidays: [{ Year: 2004, Month: 5, Day: 21 }],
      },
      expected: '12-05-2004 12:00',
    },
    {
      input: {
        WorkdayStart: { Hours: 8, Minutes: 0 },
        WorkdayStop: { Hours: 16, Minutes: 0 },
        RecurringHolidays: [{ Month: 5, Day: 17 }],
        Holidays: [{ Year: 2004, Month: 5, Day: 27 }],
        StartDate: '24-05-2004 19:03',
        Increment: 44.723656,
      },
      expected: '27-07-2004 13:47',
    },
    {
      input: {
        WorkdayStart: { Hours: 8, Minutes: 0 },
        WorkdayStop: { Hours: 16, Minutes: 0 },
        RecurringHolidays: [{ Month: 5, Day: 17 }],
        Holidays: [{ Year: 2004, Month: 5, Day: 27 }],
        StartDate: '24-05-2004 18:03',
        Increment: -6.7470217,
      },
      expected: '13-05-2004 10:02',
    },
    {
      input: {
        WorkdayStart: { Hours: 8, Minutes: 0 },
        WorkdayStop: { Hours: 16, Minutes: 0 },
        RecurringHolidays: [{ Month: 5, Day: 17 }],
        Holidays: [{ Year: 2004, Month: 5, Day: 27 }],
        StartDate: '24-05-2004 08:03',
        Increment: 12.782709,
      },
      expected: '10-06-2004 14:18',
    },
    {
      input: {
        WorkdayStart: { Hours: 8, Minutes: 0 },
        WorkdayStop: { Hours: 16, Minutes: 0 },
        RecurringHolidays: [{ Month: 5, Day: 17 }],
        Holidays: [{ Year: 2004, Month: 5, Day: 27 }],
        StartDate: '24-05-2004 07:03',
        Increment: 8.276628,
      },
      expected: '04-06-2004 10:12',
    },
  ])(
    '$input.StartDate + $input.Increment -> $expected',
    ({ input, expected }) => {
      const inputJSON = JSON.stringify({
        ...input,
        WorkdayStart: { Hours: 8, Minutes: 0 },
        WorkdayStop: { Hours: 16, Minutes: 0 },
      });

      const result = spawnSync('npx', [
        'ts-node',
        'src/index.ts',
        '--json',
        inputJSON,
      ]);

      expect(result.stdout.toString().trim()).toContain(expected);
      expect(result.error).toBeFalsy();
    }
  );
});
