# working-days-calculator

This project calculates the exact date in working days from a given start date, ignoring weekends and Holidays.

# Getting Started

```
npm i
npm test
```

Either install `ts-node` (eg. `npm i -g ts-node`) or use `npx` if you prefer.

Then you can try a few command line calls like this:

```
npx ts-node src/index.ts '{"WorkdayStart":{"Hours":8,"Minutes": 0},"WorkdayStop":{"Hours":16,"Minutes":0},"RecurringHolidays":[{"Month": 5,"Day":17}],"Holidays":[{"Year":2004,"Month":5,"Day": 27}],"StartDate":"24-05-2004 19:03","Increment":44.723656}'
```

```
ts-node src/index.ts '{"WorkdayStart":{"Hours":8,"Minutes": 0},"WorkdayStop":{"Hours":16,"Minutes":0},"RecurringHolidays":[{"Month": 5,"Day":17}],"Holidays":[{"Year":2004,"Month":5,"Day": 27}],"StartDate":"24-05-2004 07:03","Increment":8.276628}'
```
