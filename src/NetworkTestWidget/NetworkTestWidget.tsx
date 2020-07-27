import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
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
      <Typography variant="h4" paragraph>
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
      <Button
        onClick={startTest}
        variant="contained"
        color="secondary"
        disabled={isRunning}
        style={{ marginRight: '1em' }}
      >
        Start
      </Button>
      <Button onClick={() => setIsSettingsOpen(true)} color="secondary" disabled={isRunning}>
        <SettingsIcon style={{ marginRight: '0.3em' }} />
        Settings
      </Button>
      <SettingsModal isOpen={isSettingsOpen} handleClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
