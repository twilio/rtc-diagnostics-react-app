import { testBitrate, BitrateTest } from '@twilio/rtc-diagnostics';
import { Device, Connection } from 'twilio-client';
import { PreflightTest } from 'twilio-client/es5/twilio/preflight/preflight';
import { regionalizeIceUrls } from '../utils';
import { Region, TestKind, TestSuite } from '../types';

const preflightOptions: PreflightTest.Options = {
  codecPreferences: [Connection.Codec.Opus, Connection.Codec.PCMU],
  debug: false,
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
  return function start() {
    return new Promise((resolve, reject) => {
      const bitrateTest = testBitrate({ iceServers });

      bitrateTest.on(BitrateTest.Events.Bitrate, (bitrate) => {
        console.log('Bitrate Test - bitrate: ', bitrate);
      });

      bitrateTest.on(BitrateTest.Events.Error, (error) => {
        console.log('Bitrate Test - error: ', error);
        reject(error);
      });

      bitrateTest.on(BitrateTest.Events.End, (report) => {
        console.log('Bitrate Test - end: ', report);
        resolve(report);
      });

      setTimeout(() => {
        bitrateTest.stop();
      }, 8000);
    });
  };
}

export function createTestSuite(token: string, iceServers: RTCIceServer[], region?: Region) {
  const updatedIceServer = region ? regionalizeIceUrls(region, iceServers) : iceServers;

  const updatedPreflightOptions = {
    ...preflightOptions,
    edge: region ? region : 'roaming',
  };

  return {
    region: region ? region : 'global',
    tests: [
      {
        name: 'Bitrate Test',
        kind: TestKind.bitrate,
        start: bitrateTestRunner(updatedIceServer),
      },
      {
        name: 'Preflight Test',
        kind: TestKind.preflight,
        start: preflightTestRunner(token, updatedPreflightOptions),
      },
    ],
  } as TestSuite;
}
