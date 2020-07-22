import signallingServersRow from './signallingServers';
import { set } from 'lodash';
import { TestResults, TestWarnings } from '../../../types';

describe('the signallingServers row', () => {
  describe('getValue function', () => {
    it('should return "No" when the error code is 31901', () => {
      const testResult = set({}, 'errors.preflight.code', 31901) as TestResults;
      expect(signallingServersRow.getValue(testResult)).toBe('No');
    });

    it('should return "No" when the error code is 31005', () => {
      const testResult = set({}, 'errors.preflight.code', 31005) as TestResults;
      expect(signallingServersRow.getValue(testResult)).toBe('No');
    });

    it('should return "No" when the error code is 31000', () => {
      const testResult = set({}, 'errors.preflight.code', 31000) as TestResults;
      expect(signallingServersRow.getValue(testResult)).toBe('No');
    });

    it('should return "Yes" if the preflight test completed successfully', () => {
      const testResult = set({}, 'results.preflight', {}) as TestResults;
      expect(signallingServersRow.getValue(testResult)).toBe('Yes');
    });

    it('should return "Yes" if the preflight test emits the "connected" event', () => {
      const baseResult = set({}, 'results', {});
      const testResult = set(baseResult, 'errors.preflight.hasConnected', true) as TestResults;
      expect(signallingServersRow.getValue(testResult)).toBe('Yes');
    });

    it('should return "Did not run" in all orhter cases', () => {
      const baseResult = set({}, 'results', {});
      const testResult = set(baseResult, 'errors', {}) as TestResults;
      expect(signallingServersRow.getValue(testResult)).toBe('Did not run');
    });
  });
  describe('the getWarning function', () => {
    it('should return TestWarnings.error when the error code is 31901', () => {
      const testResult = set({}, 'errors.preflight.code', 31901) as TestResults;
      expect(signallingServersRow.getWarning?.(testResult)).toBe(TestWarnings.error);
    });

    it('should return TestWarnings.error when the error code is 31005', () => {
      const testResult = set({}, 'errors.preflight.code', 31005) as TestResults;
      expect(signallingServersRow.getWarning?.(testResult)).toBe(TestWarnings.error);
    });

    it('should return TestWarnings.none in all other cases', () => {
      const testResult = set({}, 'results.preflight', {}) as TestResults;
      expect(signallingServersRow.getWarning?.(testResult)).toBe(TestWarnings.none);
    });
  });
});
