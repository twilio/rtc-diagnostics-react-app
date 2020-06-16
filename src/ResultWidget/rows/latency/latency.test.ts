import latencyRow from './latency';
import set from 'lodash.set';
import { TestResults, TestWarnings } from '../../../types';

describe('the latencyRow', () => {
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
