import { MediaConnectionBitrateTest } from '@twilio/rtc-diagnostics';
import { PreflightTest, TwilioError } from '@twilio/voice-sdk';
import { DiagnosticError } from '@twilio/rtc-diagnostics';
import RTCSample from '@twilio/voice-sdk/es5/twilio/rtc/sample';

export type NetworkTestName = 'Bitrate Test' | 'Preflight Test';

declare global {
  interface RTCIceServer {
    url: string;
  }
}

declare module '@twilio/voice-sdk' {
  // eslint-disable-next-line
  namespace TwilioError {
    interface TwilioError {
      hasConnected: boolean;
      latestSample: RTCSample;
    }
  }
}

export interface TestResults {
  edge: Edge;
  results: {
    bitrate?: MediaConnectionBitrateTest.Report;
    preflight?: PreflightTest.Report;
  };
  errors: {
    bitrate?: DiagnosticError;
    preflight?: TwilioError.TwilioError;
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
  | 'sao-paulo'
  | 'singapore'
  | 'sydney'
  | 'tokyo'
  | 'ashburn-ix'
  | 'london-ix'
  | 'frankfurt-ix'
  | 'san-jose-ix'
  | 'singapore-ix';
