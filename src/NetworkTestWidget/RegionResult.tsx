import React from 'react';
import { makeStyles, Typography, Tooltip } from '@material-ui/core';
import clsx from 'clsx';

import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';
import ProgressBar from './ProgressBar/ProgressBar';
import { regionNameMap } from '../utils';
import { NetworkTestName, Region, TestResults } from '../types';

import { rows } from '../ResultWidget/rows';

const useStyles = makeStyles({
  container: {
    border: '1px solid #ddd',
    borderRadius: '3px',
    display: 'flex',
    padding: '0.8em',
    background: '#eee',
    alignItems: 'center',
    margin: '1em',
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

interface RegionResultProps {
  region: Region;
  isActive: boolean;
  result?: TestResults;
  activeTest?: NetworkTestName;
}
const progressBarTimings = {
  'Preflight Test': {
    position: 62.5,
    duration: 25,
  },
  'Bitrate Test': {
    position: 100,
    duration: 15,
  },
};

export default function RegionResult(props: RegionResultProps) {
  const { region, isActive, result, activeTest } = props;
  const classes = useStyles();

  const hasError = Object.values(result?.errors ?? {}).length > 0;
  const hasWarning = result && rows.some((row) => row.getWarning?.(result));

  const progressDuration = activeTest ? progressBarTimings[activeTest].duration : 100;
  const progressPosition = activeTest ? progressBarTimings[activeTest].position : 0;

  return (
    <div className={clsx(classes.container, { [classes.pendingTest]: !isActive && !result })}>
      <Typography className={classes.regionName}>{regionNameMap[region]}</Typography>
      <div className={classes.progressContainer}>
        {isActive && <ProgressBar position={progressPosition} duration={progressDuration} />}
      </div>
      <div className={classes.iconContainer}>
        {result && (
          <>
            {hasError && <CloseIcon style={{ fill: '#d00' }} />}
            {!hasError && hasWarning && <WarningIcon style={{ fill: '#ff0', stroke: '#555' }} />}
            {!hasError && !hasWarning && <CheckIcon style={{ fill: '#090' }} />}
            <Tooltip title="More information can be displayed here." placement="top">
              <InfoIcon />
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
}
