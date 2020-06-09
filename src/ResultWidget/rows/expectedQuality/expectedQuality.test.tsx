import expectedQuality from './expectedQuality';
import set from 'lodash.set';
import { TestResults, TestWarnings } from '../../../types';

const runTest = (name: string, input: number, output: string) =>
  it(name, () => {
    const testResult = set({}, 'results.preflight.stats.mos.average', input) as TestResults;
    expect(expectedQuality.getValue(testResult)).toBe(output);
  });

const runWarningTest = (name: string, input: number, output: string) =>
  it(name, () => {
    const testResult = set({}, 'results.preflight.stats.mos.average', input) as TestResults;
    expect(expectedQuality.getWarning?.(testResult)).toBe(output);
  });

describe('the expectedQuality row', () => {
  describe('getValue function', () => {
    runTest('should round numbers to two decimal places', 3.6764, 'Good (3.68)');
    runTest('should report Excellent quality at 4 or above', 4, 'Excellent (4)');
    runTest('should report Good quality at 3.5 or above', 3.5, 'Good (3.5)');
    runTest('should report Degraded quality at 2.5 or above', 2.5, 'Degraded (2.5)');
    runTest('should report Unacceptable quality below 2.5', 2.4, 'Unacceptable (2.4)');
  });

  describe('getWarning function', () => {
    // @ts-ignore - cannot assign undefined to type 'number'
    runWarningTest('should return none the value is undefined', undefined, TestWarnings.none);
    runWarningTest('should return none when the value is 3.5', 3.5, TestWarnings.none);
    runWarningTest('should return none when the value is below 3.4', 3.4, TestWarnings.warn);
  });
});
