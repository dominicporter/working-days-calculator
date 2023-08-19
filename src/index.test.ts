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
  ])(
    '$input.StartDate + $input.Increment -> $expected',
    ({ input, expected }) => {
      const inputJSON = JSON.stringify(input);

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
