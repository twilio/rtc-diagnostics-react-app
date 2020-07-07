import { testBitrate, BitrateTest } from '@twilio/rtc-diagnostics';
import { Device, Connection, PreflightTest } from 'twilio-client';
import { regionalizeIceUrls } from '../../utils';
import { Region } from '../../types';
import RTCSample from 'twilio-client/es5/twilio/rtc/sample';

const preflightOptions: PreflightTest.Options = {
  codecPreferences: [Connection.Codec.Opus, Connection.Codec.PCMU],
  debug: false,
  signalingTimeoutMs: 10000,
  fakeMicInput: true,
};

export const BITRATE_TEST_DURATION = 15000;

export function preflightTestRunner(region: Region, token: string, iceServers: RTCIceServer[]) {
  return new Promise<PreflightTest.Report>((resolve, reject) => {
    const preflightTest = Device.testPreflight(token, { ...preflightOptions, edge: region, iceServers: iceServers });
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
}

export function bitrateTestRunner(region: Region, iceServers: BitrateTest.Options['iceServers']) {
  const updatedIceServers = regionalizeIceUrls(region, iceServers);

  return new Promise<BitrateTest.Report>((resolve, reject) => {
    const bitrateTest = testBitrate({ iceServers: updatedIceServers });

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
}
