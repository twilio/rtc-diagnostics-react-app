import bandwidth from './bandwidth';
import set from 'lodash.set';
import { TestResults, TestWarnings } from '../../../types';

describe('the bandwidth row', () => {
  describe('the getValue function', () => {
    it('should return undefined when preflight tests results are not available', () => {
      const testResult = set({}, 'results.bitrate.averageBitrate', 1000) as TestResults;
      expect(bandwidth.getValue(testResult)).toBe(undefined);
    });

    it('should return the averageBitrate when preflight tests results are available', () => {
      let testResult = set({}, 'results.bitrate.averageBitrate', 1000) as TestResults;
      testResult = set(testResult, 'results.preflight', {});
      expect(bandwidth.getValue(testResult)).toBe(1000);
    });
  });

  describe('the getWarning function', () => {
    it('should return none when there are no preflight results', () => {
      const testResult = set({}, 'results.bitrate.averageBitrate', 1000) as TestResults;
      expect(bandwidth.getWarning?.(testResult)).toBe(TestWarnings.none);
    });

    it('should return none when the bitrate is 100', () => {
      let testResult = set({}, 'results.bitrate.averageBitrate', 1000) as TestResults;
      testResult = set(testResult, 'results.preflight', {});
      expect(bandwidth.getWarning?.(testResult)).toBe(TestWarnings.none);
    });

    it('should return none when the bitrate is below 100', () => {
      let testResult = set({}, 'results.bitrate.averageBitrate', 99) as TestResults;
      testResult = set(testResult, 'results.preflight', {});
      expect(bandwidth.getWarning?.(testResult)).toBe(TestWarnings.warn);
    });

    it('should return none when the bitrate is below 40', () => {
      let testResult = set({}, 'results.bitrate.averageBitrate', 39) as TestResults;
      testResult = set(testResult, 'results.preflight', {});
      expect(bandwidth.getWarning?.(testResult)).toBe(TestWarnings.error);
    });
  });
});
