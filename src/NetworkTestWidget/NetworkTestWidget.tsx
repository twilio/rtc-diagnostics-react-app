import React, { useState } from 'react';
import { Button, LinearProgress, makeStyles, Typography, Grid } from '@material-ui/core';
import { createTestSuite } from './Tests';
import { replaceRegions, getRegionName, Region } from '../utils';

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
  onComplete: (results: any) => void;
}

const regions = ['tokyo', 'ashburn', 'sydney'];

export default function NetworkTestWidget({ token, iceServers, onComplete }: NetworkTestWidgetProps) {
  const classes = useStyles();

  const [isRunning, setIsRunning] = useState(false);
  const [activeTest, setActiveTest] = useState('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [activeRegion, setActiveRegion] = useState<Region>();

  async function startTest() {
    setIsRunning(true);
    const r: any[] = [];

    const testSuites = regions.map((region) => createTestSuite(token!, iceServers!, region));

    for (const suite of testSuites) {
      const testResults: any = {
        region: suite.region,
        results: {},
      };

      setActiveRegion(suite.region);

      for (const test of suite.tests) {
        setProgress(((suite.tests.indexOf(test) + 0.2) / suite.tests.length) * 100);
        setActiveTest(test.name);
        const result = await test.start();
        testResults.results[test.kind] = result;
        setProgress(((suite.tests.indexOf(test) + 1) / suite.tests.length) * 100);
      }

      r.push(testResults);
    }

    setActiveTest('');
    setActiveRegion(undefined);
    setIsRunning(false);
    setResults(r);
    onComplete(r);
  }

  console.log(results);
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
