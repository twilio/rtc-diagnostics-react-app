import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Typography } from '@material-ui/core';
import { Row } from '../shared';

const row: Row = {
  label: 'Packet Loss',
  getValue: (testResults: TestResults) => {
    const packetLoss = testResults.results.preflight?.totals?.packetsLostFraction;
    if (typeof packetLoss !== 'undefined') {
      return `${packetLoss}%`;
    }
  },
  getWarning: (testResults: TestResults) =>
    (testResults.results.preflight?.totals?.packetsLostFraction ?? 0) < 3 ? TestWarnings.none : TestWarnings.warn,
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
