import { testBitrate, BitrateTest } from '@twilio/rtc-diagnostics';
import { Device, Connection, PreflightTest } from 'twilio-client';
import { regionalizeIceUrls } from '../utils';
import { Region, TestKind, TestSuite } from '../types';
import RTCSample from 'twilio-client/es5/twilio/rtc/sample';

const preflightOptions: PreflightTest.Options = {
  codecPreferences: [Connection.Codec.Opus, Connection.Codec.PCMU],
  debug: false,
  signalingTimeoutMs: 10000,
  fakeMicInput: true,
};

export const BITRATE_TEST_DURATION = 15000;

function preflightTestRunner(token: string, options = preflightOptions) {
  return function start() {
    return new Promise((resolve, reject) => {
      const preflightTest = Device.testPreflight(token, options);
      let hasConnected = false;
      let latestSample: RTCSample;

      preflightTest.on(PreflightTest.Events.Completed, (report: PreflightTest.Report) => {
        console.log('Preflight Test - report: ', report);
        resolve(report);
      });

      preflightTest.on(PreflightTest.Events.Connected, () => {
        console.log('Preflight Test - connected');
        hasConnected = true;
      });

      preflightTest.on(PreflightTest.Events.Sample, (sample: RTCSample) => {
        latestSample = sample;
      });

      preflightTest.on(PreflightTest.Events.Failed, (error) => {
        console.log('Preflight Test - failed: ', error);
        error.hasConnected = hasConnected;
        error.latestSample = latestSample;
        reject(error);
      });

      preflightTest.on(PreflightTest.Events.Warning, (warningName, warningData) => {
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
      }, BITRATE_TEST_DURATION);
    });
  };
}

export function createTestSuite(token: string, iceServers: RTCIceServer[], region: Region) {
  const updatedIceServer = regionalizeIceUrls(region, iceServers);

  const updatedPreflightOptions = {
    ...preflightOptions,
    edge: region,
  };

  return {
    region: region,
    tests: [
      {
        name: 'Preflight Test',
        kind: TestKind.preflight,
        start: preflightTestRunner(token, updatedPreflightOptions),
      },
      {
        name: 'Bitrate Test',
        kind: TestKind.bitrate,
        start: bitrateTestRunner(updatedIceServer),
      },
    ],
  } as TestSuite;
}
