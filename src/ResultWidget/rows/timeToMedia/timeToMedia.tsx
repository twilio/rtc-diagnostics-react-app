import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Link, Row, Typography } from '../shared';

const row: Row = {
  label: 'Time to Media',
  getValue: (testResults: TestResults) => testResults.results.preflight?.networkTiming?.peerConnection?.duration,
  getWarning: (testResults: TestResults) =>
    (testResults.results.preflight?.networkTiming?.peerConnection?.duration ?? 0) < 1001
      ? TestWarnings.none
      : TestWarnings.warn,
  tooltipContent: {
    label: (
      <Typography>
        The time it takes for the media to flow between the caller and callee after the callee picks up. The lower the
        better. A high value indicates latency issues in the connection between the endpoints.
      </Typography>
    ),
    [TestWarnings.warn]: (
      <Typography>
        High time to media results in a bad user experience when the call is first picked up. Run the test a few times
        to ensure this is not a glitch in the network.
      </Typography>
    ),
  },
};

export default row;
