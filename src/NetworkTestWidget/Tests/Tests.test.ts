import { bitrateTestRunner, preflightTestRunner, BITRATE_TEST_DURATION } from './Tests';
import { EventEmitter } from 'events';

class MockBitrateTest extends EventEmitter {
  stop = jest.fn();
}

const mockBitrateTest = new MockBitrateTest();

const mockPreflightTest = new EventEmitter();

const mockTurnServers: RTCIceServer[] = [{ url: '', urls: '' }];

jest.mock('@twilio/rtc-diagnostics', () => ({
  testBitrate: jest.fn(() => mockBitrateTest),
  BitrateTest: {
    Events: {
      Bitrate: 'Bitrate',
      Error: 'Error',
      End: 'End',
    },
  },
}));

jest.mock('twilio-client', () => ({
  Device: {
    testPreflight: jest.fn(() => mockPreflightTest),
  },
  PreflightTest: {
    Events: {
      Completed: 'Completed',
      Connected: 'Connected',
      Failed: 'Failed',
      Sample: 'Sample',
      Warning: 'Warning',
    },
  },
  Connection: {
    Codec: {
      Opus: 'opus',
      PCMU: 'pcmu',
    },
  },
}));

describe('the bitrateTestRunner function', () => {
  beforeEach(jest.clearAllMocks);

  it('should resolve on "End" event', () => {
    const bitrateTest = bitrateTestRunner('ashburn', mockTurnServers);
    mockBitrateTest.emit('End', { report: 'testReport' });
    return expect(bitrateTest).resolves.toEqual({ report: 'testReport' });
  });

  it('should reject on "Error" event', () => {
    const bitrateTest = bitrateTestRunner('ashburn', mockTurnServers);
    mockBitrateTest.emit('Error', { error: 'testError' });
    return expect(bitrateTest).rejects.toEqual({ error: 'testError' });
  });

  it('should call "stop" method after BITRATE_TEST_DURATION elapses', () => {
    jest.useFakeTimers();
    bitrateTestRunner('ashburn', mockTurnServers);
    expect(mockBitrateTest.stop).not.toHaveBeenCalled();
    jest.runTimersToTime(BITRATE_TEST_DURATION);
    expect(mockBitrateTest.stop).toHaveBeenCalled();
  });
});

describe('the preflightTestRunner function', () => {
  it('should resolve on "Completed" event', () => {
    const preflightTest = preflightTestRunner('ashburn', 'token', mockTurnServers);
    mockPreflightTest.emit('Completed', { report: 'testReport' });
    return expect(preflightTest).resolves.toEqual({ report: 'testReport' });
  });

  describe('"Failed" event', () => {
    it('should reject', () => {
      const preflightTest = preflightTestRunner('ashburn', 'token', mockTurnServers);
      mockPreflightTest.emit('Failed', { report: 'testReport' });
      return expect(preflightTest).rejects.toEqual({
        report: 'testReport',
        hasConnected: false,
        latestSample: undefined,
      });
    });

    it('should reject with "hasConnected" set to true after "Connected" event', () => {
      const preflightTest = preflightTestRunner('ashburn', 'token', mockTurnServers);
      mockPreflightTest.emit('Connected');
      mockPreflightTest.emit('Failed', { report: 'testReport' });
      return expect(preflightTest).rejects.toEqual({
        report: 'testReport',
        hasConnected: true,
        latestSample: undefined,
      });
    });

    it('should reject with "latestSample" populated with the latest sample', () => {
      const preflightTest = preflightTestRunner('ashburn', 'token', mockTurnServers);
      mockPreflightTest.emit('Connected');
      mockPreflightTest.emit('Sample', 'mockSample1');
      mockPreflightTest.emit('Sample', 'mockSample2');
      mockPreflightTest.emit('Failed', { report: 'testReport' });
      return expect(preflightTest).rejects.toEqual({
        report: 'testReport',
        hasConnected: true,
        latestSample: 'mockSample2',
      });
    });
  });
});
