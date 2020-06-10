import mediaServersRow from './mediaServers';
import set from 'lodash.set';
import { TestResults, TestWarnings } from '../../../types';

describe('the mediaServers row', () => {
  describe('the getValue function', () => {
    it('return "No" when the error code is 31003', () => {
      const testResults = set({}, 'errors.preflight.code', 31003) as TestResults;
      expect(mediaServersRow.getValue(testResults)).toBe('No');
    });

    it('should return "Did not run" when there are no bytes received and no error', () => {
      let testResults = set({}, 'errors', {}) as TestResults;
      testResults = set(testResults, 'results.preflight.samples[1].bytesReceived', 0);
      expect(mediaServersRow.getValue(testResults)).toBe('Did not run');
    });

    it('should return "Yes" when there is an error, and the last sample has more than 0 bytesReceived', () => {
      let testResults = set({}, 'errors.preflight.latestSample.bytesReceived', 1) as TestResults;
      testResults = set(testResults, 'results.preflight', {});
      expect(mediaServersRow.getValue(testResults)).toBe('Yes');
    });

    it('should return "Yes (TURN)" when bytes are received and isTurnRequired is true', () => {
      let testResults = set({}, 'errors', {}) as TestResults;
      testResults = set(testResults, 'results.preflight.samples[1].bytesReceived', 1);
      testResults = set(testResults, 'results.preflight.isTurnRequired', true);
      expect(mediaServersRow.getValue(testResults)).toBe('Yes (TURN)');
    });

    it('should return "Yes (TURN UDP)" when bytes are received and isTurnRequired is true and relayProtocol is UDP', () => {
      let testResults = set({}, 'errors', {}) as TestResults;
      testResults = set(testResults, 'results.preflight.samples[1].bytesReceived', 1);
      testResults = set(testResults, 'results.preflight.isTurnRequired', true);
      testResults = set(testResults, 'results.preflight.selectedIceCandidatePair.localCandidate.relayProtocol', 'udp');
      expect(mediaServersRow.getValue(testResults)).toBe('Yes (TURN UDP)');
    });

    it('should return "Yes (TURN TCP)" when bytes are received and isTurnRequired is true and relayProtocol is TCP', () => {
      let testResults = set({}, 'errors', {}) as TestResults;
      testResults = set(testResults, 'results.preflight.samples[1].bytesReceived', 1);
      testResults = set(testResults, 'results.preflight.isTurnRequired', true);
      testResults = set(testResults, 'results.preflight.selectedIceCandidatePair.localCandidate.relayProtocol', 'tcp');
      expect(mediaServersRow.getValue(testResults)).toBe('Yes (TURN TCP)');
    });

    it('should return "Did not run" when there are no bytes received and the error is not 31003', () => {
      let testResults = set({}, 'errors.preflight.latestSample.bytesReceived', 0) as TestResults;
      testResults = set(testResults, 'results.preflight', {});
      testResults = set(testResults, 'errors.preflight.code', 30000);
      expect(mediaServersRow.getValue(testResults)).toBe('Did not run');
    });

    it('should return "Yes" when the last sample has more than 0 bytesReceived', () => {
      let testResults = set({}, 'errors', {}) as TestResults;
      testResults = set(testResults, 'results.preflight.samples[1].bytesReceived', 1);
      expect(mediaServersRow.getValue(testResults)).toBe('Yes');
    });
  });

  describe('getWarning function', () => {
    it('should return TestWarnings.error when the error code is 31003', () => {
      const testResults = set({}, 'errors.preflight.code', 31003) as TestResults;
      expect(mediaServersRow.getWarning?.(testResults)).toBe(TestWarnings.error);
    });

    it('should return TestWarning.none when bytes are received', () => {
      let testResults = set({}, 'errors', {}) as TestResults;
      testResults = set(testResults, 'results.preflight.samples[1].bytesReceived', 1);
      expect(mediaServersRow.getWarning?.(testResults)).toBe(TestWarnings.none);
    });

    it('should return TestWarnings.none when bytes are received and the error code is not 31003', () => {
      let testResults = set({}, 'errors.preflight.latestSample.bytesReceived', 1) as TestResults;
      testResults = set(testResults, 'results.preflight', {});
      testResults = set(testResults, 'errors.preflight.code', 30000);
      expect(mediaServersRow.getWarning?.(testResults)).toBe(TestWarnings.none);
    });

    it('should return TestWarnings.warnTurn when bytes are receved and isTurnRequired is true', () => {
      let testResults = set({}, 'errors', {}) as TestResults;
      testResults = set(testResults, 'results.preflight.samples[1].bytesReceived', 1);
      testResults = set(testResults, 'results.preflight.isTurnRequired', true);
      expect(mediaServersRow.getWarning?.(testResults)).toBe(TestWarnings.warnTurn);
    });

    it('should return TestWarnings.warnTurnUDP when bytes are received and isTurnRequired is true and relayProtocol is udp', () => {
      let testResults = set({}, 'errors', {}) as TestResults;
      testResults = set(testResults, 'results.preflight.samples[1].bytesReceived', 1);
      testResults = set(testResults, 'results.preflight.isTurnRequired', true);
      testResults = set(testResults, 'results.preflight.selectedIceCandidatePair.localCandidate.relayProtocol', 'udp');
      expect(mediaServersRow.getWarning?.(testResults)).toBe(TestWarnings.warnTurnUDP);
    });

    it('should return TestWarnings.warnTurnTCP when bytes are received and isTurnRequired is true and relayProtocol is tcp', () => {
      let testResults = set({}, 'errors', {}) as TestResults;
      testResults = set(testResults, 'results.preflight.samples[1].bytesReceived', 1);
      testResults = set(testResults, 'results.preflight.isTurnRequired', true);
      testResults = set(testResults, 'results.preflight.selectedIceCandidatePair.localCandidate.relayProtocol', 'tcp');
      expect(mediaServersRow.getWarning?.(testResults)).toBe(TestWarnings.warnTurnTCP);
    });

    it('should return TestWarnings.none when no bytes are received and there is no error', () => {
      let testResults = set({}, 'errors', {}) as TestResults;
      testResults = set(testResults, 'results.preflight.samples[1].bytesReceived', 0);
      expect(mediaServersRow.getWarning?.(testResults)).toBe(TestWarnings.none);
    });

    it('should return TestWarnings.none when no bytes are received and the error code is not 31003', () => {
      let testResults = set({}, 'errors.preflight.latestSample.bytesReceived', 0) as TestResults;
      testResults = set(testResults, 'results.preflight', {});
      testResults = set(testResults, 'results.preflightcode', 30000);
      expect(mediaServersRow.getWarning?.(testResults)).toBe(TestWarnings.none);
    });
  });
});
