import React from 'react';
import { darken, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import expectedQualityRow from '../ResultWidget/rows/expectedQuality/expectedQuality';
import { getEdgeName } from '../utils';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { maxBy } from 'lodash';
import { TestResults } from '../types';

const useStyles = makeStyles((theme: Theme) => {
  const getBackgroundColor = theme.palette.type === 'light' ? lighten : darken;

  return {
    container: {
      margin: '1em 1em 0',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.85em',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: getBackgroundColor(theme.palette.info.main, 0.9),
      '&:not(:last-child)': {
        marginBottom: '0.8em',
      },
      '& svg': {
        fill: theme.palette.info.main,
        margin: '0 0.6em 0 0.3em',
        padding: '1px',
      },
    },
  };
});

export default function SummaryWidget({ results }: { results?: TestResults[] }) {
  const classes = useStyles();

  if (!results) return null;

  const bestEdge = maxBy(results, (result) => result.results.preflight?.stats?.mos?.average);

  if (bestEdge) {
    const bestEdgeQuality = expectedQualityRow.getValue(bestEdge);
    const bestEdgeName = getEdgeName(bestEdge);

    return (
      <div className={classes.container}>
        <div className={classes.item}>
          <InfoIcon />
          <span>
            Expected Call Quality: <strong>{bestEdgeQuality}</strong>
          </span>
        </div>
        <div className={classes.item}>
          <InfoIcon />
          <span>
            Recommended Edge: <strong>{bestEdgeName}</strong>
          </span>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
