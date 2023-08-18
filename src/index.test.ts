import { spawnSync } from 'child_process';

describe('Date Calculation Script', () => {
  it('should print out the parsed JSON', () => {
    const inputJSON = JSON.stringify({
      key: 'value',
    });

    const result = spawnSync('npx', [
      'ts-node',
      'src/index.ts',
      '--json',
      inputJSON,
    ]);

    expect(result.stdout.toString().trim()).toBe('{"key":"value"}');
    expect(result.error).toBeFalsy();
  });
});
