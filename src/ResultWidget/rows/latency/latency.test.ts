import latencyRow from './latency';
import set from 'lodash.set';
import { TestResults, TestWarnings } from '../../../types';

describe('the latencyRow', () => {
  describe('the getWarning function', () => {
    it('should return none when the average rtt is less than 200', () => {
      const testResults = set({}, 'results.preflight.stats.rtt.average', 199) as TestResults;
      expect(latencyRow.getWarning?.(testResults)).toBe(TestWarnings.none);
    });

    it('should return none when the average rtt is 200 or more', () => {
      const testResults = set({}, 'results.preflight.stats.rtt.average', 200) as TestResults;
      expect(latencyRow.getWarning?.(testResults)).toBe(TestWarnings.warn);
    });
  });
});
