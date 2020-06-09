import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Row, Typography } from '../shared';
import { Connection } from 'twilio-client';

const codecThresholds = {
  [Connection.Codec.PCMU]: 100,
  [Connection.Codec.Opus]: 40,
};

const row: Row = {
  label: 'Bandwidth (kbps)',
  getValue: (testResults: TestResults) => testResults.results.preflight && testResults.results.bitrate?.averageBitrate,
  getWarning: (testResults: TestResults) => {
    if (!testResults.results.preflight) {
      return TestWarnings.none;
    }

    const bitrate = testResults.results.bitrate?.averageBitrate ?? 0;
    const codec = testResults.results.preflight?.samples.slice(-1)[0].codecName as Connection.Codec;

    if (bitrate < codecThresholds[codec]) {
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
