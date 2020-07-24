import React, { useState } from 'react';
import { Button, Typography, IconButton, Grid } from '@material-ui/core';
import useTestRunner from './useTestRunner/useTestRunner';
import RegionResult from './RegionResult/RegionResult';
import { Region } from '../types';
import SettingsModal from './SettingsModal/SettingsModal';
import SettingsIcon from '@material-ui/icons/Settings';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  async function startTest() {
    const testResults = await runTests(getVoiceToken, getTURNCredentials, regions);
    onComplete(testResults);
  }

  return (
    <div>
      <Grid container alignItems="center" justify="space-between" style={{ marginBottom: '1em' }}>
        <Typography variant="h4">Connectivity and Bandwidth Tests</Typography>
        <IconButton onClick={() => setIsSettingsOpen(true)}>
          <SettingsIcon />
        </IconButton>
      </Grid>
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
      <SettingsModal isOpen={isSettingsOpen} handleClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
