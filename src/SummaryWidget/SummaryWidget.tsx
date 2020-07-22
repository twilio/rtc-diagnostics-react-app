import React from 'react';
import { Alert } from '@material-ui/lab';
import expectedQualityRow from '../ResultWidget/rows/expectedQuality/expectedQuality';
import { getRegionName } from '../utils';
import { makeStyles } from '@material-ui/core/styles';
import { maxBy } from 'lodash';
import { TestResults } from '../types';

const useStyles = makeStyles({
  container: {
    marginTop: '1em 1em 0',
    '& > div:not(:last-child)': {
      marginBottom: '0.7em',
    },
  },
});

export default function SummaryWidget({ results }: { results?: TestResults[] }) {
  const classes = useStyles();

  if (!results) return null;

  const bestRegion = maxBy(results, (result) => result.results.preflight?.stats?.mos?.average);

  if (bestRegion) {
    const bestRegionQuality = expectedQualityRow.getValue(bestRegion);
    const bestRegionName = getRegionName(bestRegion);

    return (
      <div className={classes.container}>
        <Alert severity="info">
          Expected Call Quality: <strong>{bestRegionQuality}</strong>
        </Alert>
        <Alert severity="info">
          Recommended Region: <strong>{bestRegionName}</strong>
        </Alert>
      </div>
    );
  } else {
    return null;
  }
}
