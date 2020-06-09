import jitterRow from './jitter';
import set from 'lodash.set';
import { TestResults, TestWarnings } from '../../../types';

describe('the Jitter row', () => {
  describe('the getValue function', () => {
    it('should display the min, average, and max jitter', () => {
      const testResults = set({}, 'results.preflight.stats.jitter', {
        min: 0.492876,
        average: 3.2345,
        max: 12,
      }) as TestResults;
      expect(jitterRow.getValue(testResults)).toBe('0.49 / 3.23 / 12');
    });

    it('should return undefined when jitter is not available', () => {
      const testResults = set({}, 'results', {}) as TestResults;
      expect(jitterRow.getValue(testResults)).toBeUndefined;
    });
  });

  describe('the getWarning function', () => {
    it('should return none when jitter is below 30', () => {
      const testResults = set({}, 'results.preflight.stats.jitter.average', 29) as TestResults;
      expect(jitterRow.getWarning?.(testResults)).toBe(TestWarnings.none);
    });

    it('should return error when jitter is 30 or above', () => {
      const testResults = set({}, 'results.preflight.stats.jitter.average', 30) as TestResults;
      expect(jitterRow.getWarning?.(testResults)).toBe(TestWarnings.error);
    });
  });
});
