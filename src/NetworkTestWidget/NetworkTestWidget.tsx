import React from 'react';
import { Button, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import { getRegionName, Region } from '../utils';
import useTestRunner from './useTestRunner';

const useStyles = makeStyles({
  progressContainer: {
    margin: '1em 0',
    '& > div': {
      margin: '1em 0',
    },
  },
});

interface NetworkTestWidgetProps {
  token?: string;
  iceServers?: RTCIceServer[];
  onResult: (results: any) => void;
}

const regions: Region[] = ['tokyo', 'ashburn', 'sydney'];

export default function NetworkTestWidget({ token, iceServers, onResult }: NetworkTestWidgetProps) {
  const { isRunning, activeTest, progress, results, activeRegion, startTests } = useTestRunner();

  async function startTest() {
    const testResults = await startTests(token!, iceServers!, regions);
    onResult(testResults);
  }

  const classes = useStyles();
  const ready = Boolean(token && iceServers);

  return (
    <div>
      <Typography variant="h4">Network Test</Typography>
      {isRunning && (
        <div className={classes.progressContainer}>
          <Typography>Active Test: {activeTest}</Typography>
          <Typography>Active Region: {getRegionName(activeRegion!)}</Typography>
          <LinearProgress variant="determinate" value={progress} />
        </div>
      )}
      <Button onClick={startTest} variant="contained" color="primary" disabled={!ready || isRunning}>
        Start
      </Button>
    </div>
  );
}
