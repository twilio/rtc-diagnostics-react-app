import bandwidthRow from './bandwidth/bandwidth';
import callSidRow from './callSid/callSid';
import expectedQualityRow from './expectedQuality/expectedQuality';
import jitterRow from './jitter/jitter';
import latencyRow from './latency/latency';
import mediaServersRow from './mediaServers/mediaServers';
import packetLossRow from './packetLoss/packetLoss';
import signalingServersRow from './signallingServers/signallingServers';
import timeToConnectRow from './timeToConnect/timeToConnect';
import timeToMediaRow from './timeToMedia/timeToMedia';
import { Row } from './shared';

export const rows: Row[] = [
  signalingServersRow,
  mediaServersRow,
  // timeToConnectRow, // Remove for now - not implemented in SDK
  timeToMediaRow,
  jitterRow,
  latencyRow,
  packetLossRow,
  bandwidthRow,
  expectedQualityRow,
  callSidRow,
];
