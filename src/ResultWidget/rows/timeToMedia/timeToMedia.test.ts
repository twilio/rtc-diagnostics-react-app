import timeToMediaRow from './timeToMedia';
import set from 'lodash.set';
import { TestResults, TestWarnings } from '../../../types';

describe('the timeToMedia row', () => {
  describe('the getWarning function', () => {
    it('should return none when the duration is less than 1800', () => {
      const TestResults = set({}, 'results.preflight.networkTiming.peerConnection.duration', 1799) as TestResults;
      expect(timeToMediaRow.getWarning?.(TestResults)).toBe(TestWarnings.none);
    });

    it('should return warn when the duration is 1800 or more', () => {
      const TestResults = set({}, 'results.preflight.networkTiming.peerConnection.duration', 1800) as TestResults;
      expect(timeToMediaRow.getWarning?.(TestResults)).toBe(TestWarnings.warn);
    });
  });
});
