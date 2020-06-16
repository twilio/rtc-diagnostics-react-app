import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Row, Typography } from '../shared';
import { round } from '../../../utils';

const capitalize = (word: string) => word[0].toUpperCase() + word.slice(1);

const row: Row = {
  label: 'Expected Audio Quality (MOS)',
  getValue: (testResults: TestResults) => {
    const quality = testResults.results.preflight?.callQuality;
    const mos = testResults.results.preflight?.stats?.mos?.average;
    if (quality && mos) {
      return `${capitalize(quality)} (${round(mos)})`;
    }
  },
  getWarning: (testResults: TestResults) =>
    testResults.results.preflight?.warnings.some((warning) => warning.name === 'low-mos')
      ? TestWarnings.warn
      : TestWarnings.none,
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
