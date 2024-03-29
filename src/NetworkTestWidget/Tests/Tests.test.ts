import { bitrateTestRunner, preflightTestRunner, BITRATE_TEST_DURATION } from './Tests';
import { Call, Device } from '@twilio/voice-sdk';
import { EventEmitter } from 'events';

class MockBitrateTest extends EventEmitter {
  stop = jest.fn();
}

const mockBitrateTest = new MockBitrateTest();

const mockPreflightTest = new EventEmitter();

const mockTurnServers: RTCIceServer[] = [{ url: '', urls: '' }];

jest.mock('@twilio/rtc-diagnostics', () => ({
  testMediaConnectionBitrate: jest.fn(() => mockBitrateTest),
  MediaConnectionBitrateTest: {
    Events: {
      Bitrate: 'Bitrate',
      Error: 'Error',
      End: 'End',
    },
  },
}));

jest.mock('@twilio/voice-sdk', () => ({
  Device: {
    runPreflight: jest.fn(() => mockPreflightTest),
    packageName: '@twilio/voice-sdk',
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
  Call: {
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
    jest.advanceTimersByTime(BITRATE_TEST_DURATION);
    expect(mockBitrateTest.stop).toHaveBeenCalled();
  });
});

describe('the preflightTestRunner function', () => {
  it('should be called with the correct options', () => {
    preflightTestRunner('ashburn', 'token', mockTurnServers, [Call.Codec.Opus]);
    return expect(Device.runPreflight).toHaveBeenCalledWith('token', {
      codecPreferences: ['opus'],
      edge: 'ashburn',
      fakeMicInput: true,
      iceServers: [{ url: '', urls: '' }],
      signalingTimeoutMs: 10000,
    });
  });

  it('should resolve on "Completed" event', () => {
    const preflightTest = preflightTestRunner('ashburn', 'token', mockTurnServers, [Call.Codec.Opus]);
    mockPreflightTest.emit('Completed', { report: 'testReport' });
    return expect(preflightTest).resolves.toEqual({ report: 'testReport' });
  });

  describe('"Failed" event', () => {
    it('should reject', () => {
      const preflightTest = preflightTestRunner('ashburn', 'token', mockTurnServers, [Call.Codec.Opus]);
      mockPreflightTest.emit('Failed', { report: 'testReport' });
      return expect(preflightTest).rejects.toEqual({
        report: 'testReport',
        hasConnected: false,
        latestSample: undefined,
      });
    });

    it('should reject with "hasConnected" set to true after "Connected" event', () => {
      const preflightTest = preflightTestRunner('ashburn', 'token', mockTurnServers, [Call.Codec.Opus]);
      mockPreflightTest.emit('Connected');
      mockPreflightTest.emit('Failed', { report: 'testReport' });
      return expect(preflightTest).rejects.toEqual({
        report: 'testReport',
        hasConnected: true,
        latestSample: undefined,
      });
    });

    it('should reject with "latestSample" populated with the latest sample', () => {
      const preflightTest = preflightTestRunner('ashburn', 'token', mockTurnServers, [Call.Codec.Opus]);
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
