import latencyRow from './latency';
import { set } from 'lodash';
import { TestResults, TestWarnings } from '../../../types';

describe('the latencyRow', () => {
  describe('the getValue function', () => {
    it('should display the min, average, and max latency', () => {
      const testResults = set({}, 'results.preflight.stats.rtt', {
        min: 7.145,
        average: 12.56972,
        max: 30.98,
      }) as TestResults;
      expect(latencyRow.getValue(testResults)).toBe('7 / 13 / 31');
    });

    it('should return undefined when latency is not available', () => {
      const testResults = set({}, 'results', {}) as TestResults;
      expect(latencyRow.getValue(testResults)).toBeUndefined;
    });
  });
  describe('the getWarning function', () => {
    it('should return TestWarnings.none when there are no high-rtt warnings', () => {
      const testResults = set({}, 'results.preflight.warnings', []) as TestResults;
      expect(latencyRow.getWarning?.(testResults)).toBe(TestWarnings.none);
    });

    it('should return TestWarnings.warn when there are high-rtt warnings', () => {
      const testResults = set({}, 'results.preflight.warnings.[0].name', 'high-rtt') as TestResults;
      expect(latencyRow.getWarning?.(testResults)).toBe(TestWarnings.warn);
    });
  });
});
