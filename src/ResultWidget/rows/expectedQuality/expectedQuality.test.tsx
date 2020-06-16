import expectedQuality from './expectedQuality';
import set from 'lodash.set';
import { TestResults, TestWarnings } from '../../../types';

describe('the expectedQuality row', () => {
  describe('getValue function', () => {
    it('should display the call quality and average mos', () => {
      let testResults = set({}, 'results.preflight.callQuality', 'excellent') as TestResults;
      testResults = set(testResults, 'results.preflight.stats.mos.average', 4.2365) as TestResults;
      expect(expectedQuality.getValue?.(testResults)).toBe('Excellent (4.24)');
    });
  });

  describe('getWarning function', () => {
    it('should return TestWarnings.none when there are no low-mos warnings', () => {
      const testResults = set({}, 'results.preflight.warnings', []) as TestResults;
      expect(expectedQuality.getWarning?.(testResults)).toBe(TestWarnings.none);
    });

    it('should return TestWarnings.warn when there are low-mos warnings', () => {
      const testResults = set({}, 'results.preflight.warnings.[0].name', 'low-mos') as TestResults;
      expect(expectedQuality.getWarning?.(testResults)).toBe(TestWarnings.warn);
    });
  });
});
