import { BitrateTest } from '@twilio/rtc-diagnostics';
import { Device, PreflightTest } from 'twilio-client';
import { DiagnosticError } from '@twilio/rtc-diagnostics/es5/lib/errors';
import RTCSample from 'twilio-client/es5/twilio/rtc/sample';

export type NetworkTestName = 'Bitrate Test' | 'Preflight Test';

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

export interface TestResults {
  edge: Edge;
  results: {
    bitrate?: BitrateTest.Report;
    preflight?: PreflightTest.Report;
  };
  errors: {
    bitrate?: DiagnosticError;
    preflight?: Device.Error;
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

export type Edge =
  | 'ashburn'
  | 'dublin'
  | 'frankfurt'
  | 'roaming'
  | 'sao-paolo'
  | 'singapore'
  | 'sydney'
  | 'tokyo'
  | 'ashburn-ix'
  | 'london-ix'
  | 'frankfurt-ix'
  | 'san-jose-ix'
  | 'singapore-ix';
