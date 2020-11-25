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
  },
  busy: {
    backgroundColor: `${theme.palette.error.dark} !important`,
    color: '#fff !important',
  },
}));

const styles = {
  audioDevice: {
    width: 'calc(50% - 1em)',
    minWidth: '300px',
  }
};

export default function AudioDeviceTestWidget() {
  const classes = useStyles();
  const [inputDeviceId, setInputDeviceId] = useState('');
  const [outputDeviceId, setOutputDeviceId] = useState('');
  const previousInputDeviceIdRef = useRef('');

  const {
    error,
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

  const recordBtnClasses = [classes.button];
  if (isRecording) {
    recordBtnClasses.push(classes.busy);
  }

  const playBtnClasses = [classes.button];
  if (isAudioOutputTestRunning) {
    playBtnClasses.push(classes.busy);
  }

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
  }, [inputDeviceId, isRecording, isAudioInputTestRunning]);

  return (
    <div>
      <Typography variant="h4" paragraph>Audio Device Tests</Typography>

      {!!error && (
        <Alert variant="error">
          <Typography variant="body1">{error}</Typography>
        </Alert>
      )}

      <Button
        disabled={disableAll}
        onClick={handleRecordClick}
        className={clsx(...recordBtnClasses)}
        variant="contained"
      >
        <RecordIcon className={classes.icon}/>{'Record' + (isRecording ? 'ing...' : '')}
      </Button>

      <Button
        disabled={!playbackURI || disableAll}
        onClick={handlePlayClick}
        className={clsx(...playBtnClasses)}
        variant="contained"
      >
        <PlayIcon className={classes.icon}/>{'Play' + (isAudioOutputTestRunning ? 'ing...' : '')}
      </Button>

      <Divider style={{ margin: '1.5em 0' }} />

      {testEnded && !error && (
        <Alert variant="success">
          <Typography variant="body1">No issues detected</Typography>
        </Alert>
      )}

      <div className={classes.deviceContainer}>
        <AudioDevice disabled={disableAll} kind="audiooutput" style={styles.audioDevice}
          level={outputLevel} onDeviceChange={setOutputDeviceId}/>
        <AudioDevice disabled={disableAll} kind="audioinput" style={styles.audioDevice}
          level={inputLevel} onDeviceChange={setInputDeviceId}/>
      </div>
    </div>
  );
}
