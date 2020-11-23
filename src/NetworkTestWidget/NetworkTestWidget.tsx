import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import useTestRunner from './useTestRunner/useTestRunner';
import EdgeResult from './EdgeResult/EdgeResult';
import SettingsModal from './SettingsModal/SettingsModal';
import SettingsIcon from '@material-ui/icons/Settings';
import { DEFAULT_EDGES, DEFAULT_CODEC_PREFERENCES } from '../constants';

interface NetworkTestWidgetProps {
  getTURNCredentials: () => Promise<RTCIceServer[]>;
  getVoiceToken: () => Promise<string>;
  token?: string;
  iceServers?: RTCIceServer[];
  onComplete: (results: any) => void;
}

const initialSettings = {
  edges: DEFAULT_EDGES,
  codecPreferences: DEFAULT_CODEC_PREFERENCES,
};

export default function NetworkTestWidget({ getTURNCredentials, getVoiceToken, onComplete }: NetworkTestWidgetProps) {
  const { isRunning, results, activeEdge, runTests, activeTest } = useTestRunner();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(initialSettings);

  async function startTest() {
    const testResults = await runTests(getVoiceToken, getTURNCredentials, settings.edges, settings.codecPreferences);
    onComplete(testResults);
  }

  return (
    <div>
      <Typography variant="h4" paragraph>
        Connectivity and Bandwidth Tests
      </Typography>
      <div>
        {settings.edges.map((edge, i) => (
          <EdgeResult
            key={edge}
            codecPreferences={settings.codecPreferences}
            edge={edge}
            isActive={activeEdge === edge}
            result={results[i]}
            activeTest={activeTest}
          />
        ))}
      </div>
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
      <SettingsModal
        isOpen={isSettingsOpen}
        onSettingsChange={(settings) => {
          setIsSettingsOpen(false);
          setSettings(settings);
        }}
      />
    </div>
  );
}
