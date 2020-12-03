import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Button, Divider, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RecordIcon from '@material-ui/icons/FiberManualRecord';
import PlayIcon from '@material-ui/icons/PlayArrow';

import Alert from '../common/Alert/Alert';
import AudioDevice from './AudioDevice/AudioDevice';
import useTestRunner from './useTestRunner/useTestRunner';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: '#fff',
    marginRight: '1em',
    '&:hover':{
      backgroundColor: theme.palette.secondary.dark
    }
  },
  icon: {
    marginRight: '0.3em'
  },
  deviceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: '-30px',
  },
  busy: {
    backgroundColor: `${theme.palette.error.dark} !important`,
    color: '#fff !important',
  },
}));

export default function AudioDeviceTestWidget() {
  const classes = useStyles();
  const [inputDeviceId, setInputDeviceId] = useState('');
  const [outputDeviceId, setOutputDeviceId] = useState('');
  const previousInputDeviceIdRef = useRef('');

  const {
    error,
    warning,
    inputLevel,
    isRecording,
    isAudioInputTestRunning,
    isAudioOutputTestRunning,
    outputLevel,
    playAudio,
    playbackURI,
    readAudioInput,
    testEnded,
  } = useTestRunner();

  const disableAll = isRecording || isAudioOutputTestRunning || !!error;

  const handleRecordClick = () => {
    readAudioInput({ deviceId: inputDeviceId, enableRecording: true });
  };

  const handlePlayClick = () => {
    playAudio({ deviceId: outputDeviceId, testURI: playbackURI });
  };

  useEffect(() => {
    const newDeviceSelected = previousInputDeviceIdRef.current !== inputDeviceId;
    previousInputDeviceIdRef.current = inputDeviceId;

    // Restarts the test to continuously capture audio input
    if (!error && (newDeviceSelected || (!isRecording && !isAudioInputTestRunning))) {
      readAudioInput({ deviceId: inputDeviceId });
    }
  }, [error, inputDeviceId, isRecording, isAudioInputTestRunning, readAudioInput]);

  return (
    <div>
      <Typography variant="h4" paragraph>Audio Device Tests</Typography>

      {!!error && (
        <Alert variant="error">
          <Typography variant="body1">{error}</Typography>
        </Alert>
      )}

      {!!warning && (
        <Alert variant="warning">
          <Typography variant="body1">{warning}</Typography>
        </Alert>
      )}

      <Button
        disabled={disableAll}
        onClick={handleRecordClick}
        className={clsx(classes.button, { [classes.busy]: isRecording })}
        variant="contained"
      >
        <RecordIcon className={classes.icon}/>{'Record' + (isRecording ? 'ing...' : '')}
      </Button>

      <Button
        disabled={!playbackURI || disableAll}
        onClick={handlePlayClick}
        className={clsx(classes.button, { [classes.busy]: isAudioOutputTestRunning })}
        variant="contained"
      >
        <PlayIcon className={classes.icon}/>{'Play' + (isAudioOutputTestRunning ? 'ing...' : '')}
      </Button>

      <Divider style={{ margin: '1.5em 0' }} />

      {testEnded && !error && !warning && (
        <Alert variant="success">
          <Typography variant="body1">No issues detected</Typography>
        </Alert>
      )}

      <div className={classes.deviceContainer}>
        <AudioDevice disabled={disableAll} kind="audiooutput"
          level={outputLevel} onDeviceChange={setOutputDeviceId}/>
        <AudioDevice disabled={disableAll} kind="audioinput"
          level={inputLevel} onDeviceChange={setInputDeviceId}/>
      </div>
    </div>
  );
}
