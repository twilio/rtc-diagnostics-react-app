import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Row, Typography } from '../shared';
import { round } from '../../../utils';

const row: Row = {
  label: 'Packet Loss',
  getValue: (testResults: TestResults) => {
    const packetLoss = testResults.results.preflight?.totals?.packetsLostFraction;
    if (typeof packetLoss !== 'undefined') {
      return `${round(packetLoss)}%`;
    }
  },
  getWarning: (testResults: TestResults) =>
    testResults.results.preflight?.warnings.some((warning) => warning.name === 'high-packet-loss')
      ? TestWarnings.warn
      : TestWarnings.none,
  tooltipContent: {
    label: (
      <Typography>
        The percentage of packets lost. High packet loss results in missing audio fragments leading to unintelligible
        speech. Packet loss is usually caused by overloaded routers
      </Typography>
    ),
  },
};

export default row;
