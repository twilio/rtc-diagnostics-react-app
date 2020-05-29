import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Typography } from '@material-ui/core';
import { Row } from '../shared';

const row: Row = {
  label: 'Bandwidth (kbps)',
  getValue: (testResults: TestResults) => testResults?.results?.bitrate?.averageBitrate,
  getWarning: (testResults: TestResults) => {
    if ((testResults?.results?.bitrate?.averageBitrate ?? 0) < 40) {
      return TestWarnings.error;
    }
    if ((testResults?.results?.bitrate?.averageBitrate ?? 0) < 100) {
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
