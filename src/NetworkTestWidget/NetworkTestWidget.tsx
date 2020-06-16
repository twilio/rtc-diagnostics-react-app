import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import useTestRunner from './useTestRunner';
import RegionResult from './RegionResult';
import { Region } from '../types';

interface NetworkTestWidgetProps {
  getCredentials: () => Promise<{ token: string; iceServers: RTCIceServer[] }>;
  token?: string;
  iceServers?: RTCIceServer[];
  onComplete: (results: any) => void;
  regions: Region[];
}

export default function NetworkTestWidget({ getCredentials, onComplete, regions }: NetworkTestWidgetProps) {
  const [isFecthingCredentials, setIsFetcingCredentials] = useState(false);
  const [error, setError] = useState<Error>();
  const { isRunning, results, activeRegion, startTests } = useTestRunner();

  async function startTest() {
    try {
      setIsFetcingCredentials(true);
      const { token, iceServers } = await getCredentials();
      setIsFetcingCredentials(false);
      const testResults = await startTests(token, iceServers, regions);
      onComplete(testResults);
    } catch (e) {
      setIsFetcingCredentials(false);
      setError(e);
    }
  }

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
      {error && (
        <Typography variant="body2" style={{ color: '#F00', marginBottom: '1em' }}>
          Error: {error.message}
        </Typography>
      )}
      <Button onClick={startTest} variant="contained" color="secondary" disabled={isFecthingCredentials || isRunning}>
        Start
      </Button>
    </div>
  );
}
