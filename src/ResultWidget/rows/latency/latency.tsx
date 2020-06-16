import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Row, Typography } from '../shared';

const row: Row = {
  label: 'Latency (ms)',
  getValue: (testResults: TestResults) => testResults.results.preflight?.stats?.rtt?.average,
  getWarning: (testResults: TestResults) =>
    testResults.results.preflight?.warnings.some((warning) => warning.name === 'high-rtt')
      ? TestWarnings.warn
      : TestWarnings.none,
  tooltipContent: {
    label: (
      <Typography>
        Latency is the time a packet of data takes from sender to receiver. High latency leads to poor user experience
        as speakers unknowingly begin to talk over each other. Latency is usually attributed to slow or overloaded
        networks
      </Typography>
    ),
  },
};

export default row;
