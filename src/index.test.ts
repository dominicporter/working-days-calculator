import { spawnSync } from 'child_process';

describe('Date Calculation Script', () => {
  it.each([{
    StartDate: '24-05-2004 12:05',
    Increment: 2,
  }])('should output the correct date', (input) => {
    const inputJSON = JSON.stringify(input);

    const result = spawnSync('npx', [
      'ts-node',
      'src/index.ts',
      '--json',
      inputJSON,
    ]);

    expect(result.stdout.toString().trim()).toContain('26-05-2004 12:05');
    expect(result.error).toBeFalsy();
  });
});
