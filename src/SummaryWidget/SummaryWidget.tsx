import React from 'react';
import expectedQualityRow from '../ResultWidget/rows/expectedQuality/expectedQuality';
import { getRegionName } from '../utils';
import { maxBy } from 'lodash';
import { TestResults } from '../types';
import { Typography } from '@material-ui/core';

export default function SummaryWidget({ results }: { results?: TestResults[] }) {
  if (!results) return null;

  const bestRegion = maxBy(results, (result) => result.results.preflight?.stats?.mos?.average);

  if (bestRegion) {
    const bestRegionQuality = expectedQualityRow.getValue(bestRegion);
    const bestRegionName = getRegionName(bestRegion);

    return (
      <div>
        <Typography variant="h6">Expected Call Quality: {bestRegionQuality}</Typography>
        <Typography variant="h6">Recommended Region: {bestRegionName}</Typography>
      </div>
    );
  } else {
    return null;
  }
}
