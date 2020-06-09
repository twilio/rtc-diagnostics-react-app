import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { round } from '../../../utils';
import { Row, Typography } from '../shared';

const row: Row = {
  label: 'Jitter min/avg/max',
  getValue: (testResults: TestResults) => {
    const jitter = testResults.results.preflight?.stats?.jitter;

    if (jitter) {
      const { min, average, max } = jitter;
      return `${round(min)} / ${round(average)} / ${round(max)}`;
    }
  },
  getWarning: (testResults: TestResults) =>
    (testResults.results.preflight?.stats?.jitter?.average ?? 0) < 30 ? TestWarnings.none : TestWarnings.error,
  tooltipContent: {
    label: (
      <Typography>
        Jitter is a measure of incoming audio packets time variance. A high value for jitter results in deterioration of
        sound quality and may introduce unacceptable latency.
      </Typography>
    ),
  },
};

export default row;
