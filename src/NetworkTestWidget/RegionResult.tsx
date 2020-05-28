import React from 'react';
import { Typography, LinearProgress, makeStyles, Tooltip } from '@material-ui/core';
import clsx from 'clsx';

import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';
import { getRegionName } from '../utils';

const useStyles = makeStyles({
  container: {
    border: '1px solid #ddd',
    borderRadius: '2px',
    display: 'flex',
    padding: '0.8em',
    background: '#eee',
    alignItems: 'center',
    margin: '0.5em',
    justifyContent: 'space-between',
  },
  progressContainer: {
    flex: 1,
    padding: '0 1em',
  },
  regionName: {
    width: '15%',
  },
  iconContainer: {
    width: '15%',
    display: 'flex',
    justifyContent: 'flex-end',
    '& svg': {
      margin: '0 0.3em',
    },
  },
  pendingTest: {
    opacity: 0.3,
  },
});

export default function RegionResult(props: any) {
  const { region, isActive, result } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.container, { [classes.pendingTest]: !isActive && !result })}>
      <Typography className={classes.regionName}>{getRegionName(region)}</Typography>
      <div className={classes.progressContainer}>
        {isActive && <LinearProgress variant="indeterminate" color="secondary" />}
      </div>
      <div className={classes.iconContainer}>
        {result && (
          <>
            <CheckIcon style={{ fill: '#0c0' }} />
            <Tooltip title="More information can be displayed here." placement="top">
              <InfoIcon />
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
}
