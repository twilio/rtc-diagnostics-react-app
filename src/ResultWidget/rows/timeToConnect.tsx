import React from 'react';

import { TestResults, TestWarnings } from '../../types';
import { Typography } from '@material-ui/core';
import { Row } from './shared';

const row: Row = {
  label: 'Time To Connect',
  getValue: (testResults: TestResults) => 'N/A',
  getWarning: (testResults: TestResults) => TestWarnings.none,
  tooltipContent: {
    label: (
      <Typography>
        The time it takes for signalling to complete. The lower the better. A high value indicates latency issues in the
        connection between the endpoints.
      </Typography>
    ),
    [TestWarnings.warn]: (
      <Typography>
        High time to media results in a bad user experience when the call is first picked up. Run the test a few times
        to ensure this is not a glitch in the network
      </Typography>
    ),
  },
};

export default row;
