import bandwidthRow from './bandwidth';
import callSidRow from './callSid';
import expectedQualityRow from './expectedQuality';
import jitterRow from './jitter';
import latencyRow from './latency';
import mediaServersRow from './mediaServers';
import packetLossRow from './packetLoss';
import signalingServersRow from './signalingServers';
import timeToConnectRow from './timeToConnect';
import timeToMediaRow from './timeToMedia';
import { Row } from './shared';

export const rows: Row[] = [
  signalingServersRow,
  mediaServersRow,
  timeToConnectRow,
  timeToMediaRow,
  jitterRow,
  latencyRow,
  packetLossRow,
  bandwidthRow,
  expectedQualityRow,
  callSidRow,
];
