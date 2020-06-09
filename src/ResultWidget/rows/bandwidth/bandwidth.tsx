import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Row, Typography } from '../shared';

const row: Row = {
  label: 'Bandwidth (kbps)',
  getValue: (testResults: TestResults) => testResults.results.preflight && testResults.results.bitrate?.averageBitrate,
  getWarning: (testResults: TestResults) => {
    if (!testResults.results.preflight) {
      return TestWarnings.none;
    }

    const bitrate = testResults.results.bitrate?.averageBitrate ?? 0;

    if (bitrate < 40) {
      return TestWarnings.error;
    }

    if (bitrate < 100) {
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
