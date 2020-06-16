import { BitrateTest } from '@twilio/rtc-diagnostics';
import { PreflightTest } from 'twilio-client/es5/twilio/preflight/preflight';
import { Device } from 'twilio-client';
import { DiagnosticError } from '@twilio/rtc-diagnostics/es5/lib/errors';
import RTCSample from 'twilio-client/es5/twilio/rtc/sample';

export enum TestKind {
  bitrate = 'bitrate',
  preflight = 'preflight',
}

export type NetworkTestName = 'Bitrate Test' | 'Preflight Test';

export interface BitrateTestRunner {
  name: NetworkTestName;
  kind: TestKind.bitrate;
  start(): Promise<BitrateTest.Report>;
}

export interface PreflightTestRunner {
  name: NetworkTestName;
  kind: TestKind.preflight;
  start(): Promise<PreflightTest.Report>;
}

declare global {
  interface RTCIceServer {
    url: string;
  }
}

declare module 'twilio-client' {
  namespace Device {
    interface Error {
      hasConnected: boolean;
      latestSample: RTCSample;
    }
  }
}

export interface TestSuite {
  region: Region;
  tests: [PreflightTestRunner, BitrateTestRunner];
}

export interface TestResults {
  region: Region;
  results: {
    [TestKind.bitrate]?: BitrateTest.Report;
    [TestKind.preflight]?: PreflightTest.Report;
  };
  errors: {
    [TestKind.bitrate]?: DiagnosticError;
    [TestKind.preflight]?: Device.Error;
  };
}

export enum TestWarnings {
  none = '',
  warn = 'warn',
  error = 'error',
  warnTurn = 'warnTurn',
  warnTurnTCP = 'warnTurnTCP',
  warnTurnUDP = 'warnTurnUDP',
}

export type Region =
  | 'sydney'
  | 'sao-paolo'
  | 'dublin'
  | 'frankfurt'
  | 'tokyo'
  | 'singapore'
  | 'ashburn'
  | 'roaming'
  | 'ashburn-ix'
  | 'san-jose-ix'
  | 'london-ix'
  | 'frankfurt-ix'
  | 'singapore-ix';
