import packetLossRow from './packetLoss';
import set from 'lodash.set';
import { TestResults, TestWarnings } from '../../../types';

describe('the packetLoss row', () => {
  describe('the getValue function', () => {
    it('should display the packet loss as a percentage', () => {
      const testResults = set({}, 'results.preflight.totals.packetsLostFraction', 0) as TestResults;
      expect(packetLossRow.getValue(testResults)).toBe('0%');
    });

    it('should round to two decimal points', () => {
      const testResults = set({}, 'results.preflight.totals.packetsLostFraction', 1.7264) as TestResults;
      expect(packetLossRow.getValue(testResults)).toBe('1.73%');
    });

    it('should return undefined when packetLossFraction is undefined', () => {
      const testResults = set({}, 'results.preflight.totals.packetsLostFraction', undefined) as TestResults;
      expect(packetLossRow.getValue(testResults)).toBe(undefined);
    });
  });

  describe('the getWarning function', () => {
    it('should return TestWarnings.none when there are no high-packet-loss warnings', () => {
      const testResults = set({}, 'results.preflight.warnings', []) as TestResults;
      expect(packetLossRow.getWarning?.(testResults)).toBe(TestWarnings.none);
    });

    it('should return TestWarnings.warn when there are high-packet-loss warnings', () => {
      const testResults = set({}, 'results.preflight.warnings.[0].name', 'high-packet-loss') as TestResults;
      expect(packetLossRow.getWarning?.(testResults)).toBe(TestWarnings.warn);
    });
  });
});
