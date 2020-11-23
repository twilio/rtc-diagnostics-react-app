import React from 'react';
import { Connection } from 'twilio-client';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, Tooltip } from '@material-ui/core';
import clsx from 'clsx';

import InfoIcon from '@material-ui/icons/Info';
import ProgressBar from '../ProgressBar/ProgressBar';
import { edgeNameMap } from '../../utils';

import { BITRATE_TEST_DURATION } from '../Tests/Tests';
import ResultIcon from '../../ResultWidget/ResultIcon/ResultIcon';
import getTooltipContent from './getTooltipContent';
import { NetworkTestName, Edge, TestResults } from '../../types';

const useStyles = makeStyles((theme: Theme) => ({
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
  edgeLabel: {
    minWidth: '170px',
    width: '15%',
    whiteSpace: 'nowrap',
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
    opacity: 0.5,
  },
}));

interface EdgeResultProps {
  codecPreferences: Connection.Codec[];
  edge: Edge;
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
    duration: BITRATE_TEST_DURATION / 1000,
  },
};

export default function EdgeResult(props: EdgeResultProps) {
  const { codecPreferences, edge, isActive, result, activeTest } = props;
  const classes = useStyles();

  const progressDuration = activeTest ? progressBarTimings[activeTest].duration : 0;
  const progressPosition = activeTest ? progressBarTimings[activeTest].position : 0;

  return (
    <div className={clsx(classes.container, { [classes.pendingTest]: !isActive && !result })}>
      <Typography className={classes.edgeLabel}>{`${edgeNameMap[edge]} (${codecPreferences.join(', ')})`}</Typography>
      <div className={classes.progressContainer}>
        {isActive && <ProgressBar position={progressPosition} duration={progressDuration} />}
      </div>
      {result && (
        <div className={classes.iconContainer}>
          <ResultIcon result={result} />
          <Tooltip title={getTooltipContent(result)} placement="top" interactive>
            <InfoIcon />
          </Tooltip>
        </div>
      )}
    </div>
  );
}
