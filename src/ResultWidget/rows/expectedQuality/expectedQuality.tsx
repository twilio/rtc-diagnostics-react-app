import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Typography } from '@material-ui/core';
import { Row } from '../shared';
import { round } from '../../../utils';

function getMOSDescription(mos?: number) {
  if (typeof mos === 'undefined') return '';

  let descriptor = '';
  switch (true) {
    case mos >= 4:
      descriptor = 'Excellent';
      break;
    case mos >= 3.5:
      descriptor = 'Good';
      break;
    case mos >= 2.5:
      descriptor = 'Degraded';
      break;
    default:
      descriptor = 'Unacceptable';
  }

  return `${descriptor} (${round(mos)})`;
}

const row: Row = {
  label: 'Expected Audio Quality (MOS)',
  getValue: (testResults: TestResults) => getMOSDescription(testResults.results.preflight?.stats?.mos?.average),
  getWarning: (testResults: TestResults) => {
    const average = testResults.results.preflight?.stats?.mos?.average;
    if (typeof average !== 'undefined') {
      return average < 3.5 ? TestWarnings.warn : TestWarnings.none;
    }
    return TestWarnings.none;
  },
  tooltipContent: {
    label: (
      <Typography>
        Expected audio quality is calculated from jitter, latency, and packet loss measured. A measure of 3.5 and above
        is needed for good user experience.
      </Typography>
    ),
  },
};

export default row;
