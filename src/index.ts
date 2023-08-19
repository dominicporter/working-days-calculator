import { addWorkingDays } from './addWorkingDays';
try {
  const input = JSON.parse(process.argv.slice(2)[0]);

  if (!input.StartDate || !input.Increment) {
    throw new Error('StartDate and Increment are required.');
  }

  addWorkingDays(input);
} catch (error: any) {
  console.error('Error:', error.message);
}
