import React from 'react';
import { Button, Typography } from '@material-ui/core';
import useTestRunner from './useTestRunner';
import RegionResult from './RegionResult';
import { Region } from '../types';

interface NetworkTestWidgetProps {
  getTURNCredentials: () => Promise<RTCIceServer[]>;
  getVoiceToken: () => Promise<string>;
  token?: string;
  iceServers?: RTCIceServer[];
  onComplete: (results: any) => void;
  regions: Region[];
}

export default function NetworkTestWidget({
  getTURNCredentials,
  getVoiceToken,
  onComplete,
  regions,
}: NetworkTestWidgetProps) {
  const { isRunning, results, activeRegion, runTests, activeTest } = useTestRunner();

  async function startTest() {
    const testResults = await runTests(getVoiceToken, getTURNCredentials, regions);
    onComplete(testResults);
  }

  return (
    <div>
      <Typography variant="h4" style={{ marginBottom: '0.5em' }}>
        Connectivity and Bandwidth Tests
      </Typography>
      {(isRunning || results.length > 0) && (
        <div>
          {regions.map((region, i) => (
            <RegionResult
              key={region}
              region={region}
              isActive={activeRegion === region}
              result={results[i]}
              activeTest={activeTest}
            />
          ))}
        </div>
      )}
      <Button onClick={startTest} variant="contained" color="secondary" disabled={isRunning}>
        Start
      </Button>
    </div>
  );
}
