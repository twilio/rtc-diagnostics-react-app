import packetLossRow from './packetLoss';
import set from 'lodash.set';
import { TestResults } from '../../../types';

describe('the packetLoss row', () => {
  describe('the getValue function', () => {
    it('should display the packet loss as a percentage', () => {
      const testResults = set({}, 'results.preflight.totals.packetsLostFraction', 0) as TestResults;
      expect(packetLossRow.getValue(testResults)).toBe('0%');
    });

    it('should display the packet loss as a percentage', () => {
      const testResults = set({}, 'results.preflight.totals.packetsLostFraction', 1.7264) as TestResults;
      expect(packetLossRow.getValue(testResults)).toBe('1.73%');
    });

    it('should return undefined when packetLossFraction is undefined', () => {
      const testResults = set({}, 'results.preflight.totals.packetsLostFraction', undefined) as TestResults;
      expect(packetLossRow.getValue(testResults)).toBe(undefined);
    });
  });
});
