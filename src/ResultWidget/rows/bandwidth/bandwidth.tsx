import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Row, Typography } from '../shared';
import { Connection } from 'twilio-client';
import { round } from '../../../utils';

// These audio codecs require different amounts of bandwidth to perform well.
// The bandwidth warning that is displayed to the user will have a different
// threshold based on the audio codec that is chosen for the test.
const codecBandwidthThresholds = {
  [Connection.Codec.PCMU]: 100,
  [Connection.Codec.Opus]: 40,
};

const row: Row = {
  label: 'Bandwidth (kbps)',
  getValue: (testResults: TestResults) => {
    const value = testResults.results.preflight && testResults.results.bitrate?.averageBitrate;
    return typeof value === 'number' ? round(value, 0) : value;
  },
  getWarning: (testResults: TestResults) => {
    if (!testResults.results.preflight) {
      return TestWarnings.none;
    }

    const bitrate = testResults.results.bitrate?.averageBitrate ?? 0;
    const codec = testResults.results.preflight?.samples.slice(-1)[0].codecName as Connection.Codec;

    if (bitrate < codecBandwidthThresholds[codec]) {
      return TestWarnings.warn;
    }

    return TestWarnings.none;
  },
  tooltipContent: {
    label: (
      <Typography>
        The bandwidth test performs a symmetrical bandwidth test using a loopback loop through a TURN server.
      </Typography>
    ),
  },
};

export default row;
