import { testBitrate, BitrateTest } from '@twilio/rtc-diagnostics';
import { Device, Connection } from 'twilio-client';
import { PreflightTest } from 'twilio-client/es5/twilio/preflight/preflight';
import { replaceRegions, Region } from '../utils';
import { DiagnosticError } from '@twilio/rtc-diagnostics/es5/lib/errors';

const preflightOptions: PreflightTest.Options = {
  codecPreferences: [Connection.Codec.PCMU, Connection.Codec.Opus],
  debug: false,
  edge: 'sydney',
  signalingTimeoutMs: 10000,
};

function preflightTestRunner(token: string, options = preflightOptions) {
  return function start() {
    return new Promise((resolve, reject) => {
      const preflightTest = Device.testPreflight(token, options);

      preflightTest.on('completed', (report) => {
        console.log('Preflight Test - report: ', report);
        resolve(report);
      });

      preflightTest.on('connected', () => {
        console.log('Preflight Test - connected: ');
      });

      preflightTest.on('failed', (error) => {
        console.log('Preflight Test - failed: ', error);
        reject(error);
      });

      preflightTest.on('warning', (warningName, warningData) => {
        console.log('Preflight Test - warning: ', warningName, warningData);
      });
    });
  };
}

function bitrateTestRunner(iceServers: BitrateTest.Options['iceServers']) {
  console.log(iceServers);
  return function start() {
    return new Promise((resolve, reject) => {
      const bitrateTest = testBitrate({ iceServers });

      bitrateTest.on(BitrateTest.Events.Bitrate, (bitrate) => {
        console.log('Bitrate Test - bitrate: ' + bitrate);
      });

      bitrateTest.on(BitrateTest.Events.Error, (error) => {
        console.log('Bitrate Test - error: ' + error);
        reject(error);
      });

      bitrateTest.on(BitrateTest.Events.End, (report) => {
        console.log('Bitrate Test - end: ' + report);
        resolve(report);
      });

      setTimeout(() => {
        bitrateTest.stop();
      }, 8000);
    });
  };
}

interface BitrateTestRunner {
  name: string;
  kind: 'bitrate';
  start(): Promise<BitrateTest.Report | DiagnosticError>;
}

interface PreflightTestRunner {
  name: string;
  kind: 'preflight';
  start(): Promise<any>;
}

interface TestSuite {
  region: Region;
  tests: [BitrateTestRunner, PreflightTestRunner];
}

export function createTestSuite(token: string, iceServers: RTCIceServer[], region?: string) {
  const updatedIceServer = region ? replaceRegions(region, iceServers) : iceServers;

  const updatedPreflightOptions = {
    ...preflightOptions,
    edge: region ? region : 'roaming',
  };

  return {
    region: region ? region : 'global',
    tests: [
      {
        name: 'Bitrate Test',
        kind: 'bitrate',
        start: bitrateTestRunner(updatedIceServer),
      },
      {
        name: 'Preflight Test',
        kind: 'preflight',
        start: preflightTestRunner(token, updatedPreflightOptions),
      },
    ],
  } as TestSuite;
}
