import React from 'react';
import { Button, Typography } from '@material-ui/core';
import useTestRunner from './useTestRunner';
import RegionResult from './RegionResult';
import { Region } from '../types';

interface NetworkTestWidgetProps {
  token?: string;
  iceServers?: RTCIceServer[];
  onComplete: (results: any) => void;
}

const regions: Region[] = ['tokyo', 'ashburn', 'sydney'];

export default function NetworkTestWidget({ token, iceServers, onComplete }: NetworkTestWidgetProps) {
  const { isRunning, results, activeRegion, startTests } = useTestRunner();

  async function startTest() {
    const testResults = await startTests(token!, iceServers!, regions);
    onComplete(testResults);
  }
  const ready = Boolean(token && iceServers);

  return (
    <div>
      <Typography variant="h4" style={{ marginBottom: '0.5em' }}>
        Connectivity and Bandwidth Tests
      </Typography>
      {(isRunning || results.length > 0) && (
        <div>
          {regions.map((region, i) => (
            <RegionResult key={region} region={region} isActive={activeRegion === region} result={results[i]} />
          ))}
        </div>
      )}
      <Button onClick={startTest} variant="contained" color="secondary" disabled={!ready || isRunning}>
        Start
      </Button>
    </div>
  );
}
