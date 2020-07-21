import jitterRow from './jitter';
import { set } from 'lodash';
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
    it('should return TestWarnings.none when there are no high-jitter warnings', () => {
      const testResults = set({}, 'results.preflight.warnings', []) as TestResults;
      expect(jitterRow.getWarning?.(testResults)).toBe(TestWarnings.none);
    });

    it('should return TestWarnings.warn when there are high-jitter warnings', () => {
      const testResults = set({}, 'results.preflight.warnings.[0].name', 'high-jitter') as TestResults;
      expect(jitterRow.getWarning?.(testResults)).toBe(TestWarnings.warn);
    });
  });
});
