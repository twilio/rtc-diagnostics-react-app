import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ProgressBar from '../../common/ProgressBar/ProgressBar';
import { useDevices } from '../useDevices/useDevices';

const labels = {
  audioinput: {
    audioLevelText: 'Input level',
    deviceLabelHeader: 'Input device',
    headerText: 'Microphone',
  },
  audiooutput: {
    audioLevelText: 'Output level',
    deviceLabelHeader: 'Output device',
    headerText: 'Speaker',
  }
};

const useStyles = makeStyles(() => ({
  audioLevelContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  form: {
    margin: '1em 0',
    minWidth: 200,
  },
  deviceLabelContainer: {
    margin: '1em 0',
    '&> *': {
      marginBottom: '0.3em'
    }
  }
}));

interface AudioDeviceProps {
  disabled: boolean;
  level: number;
  kind: 'audioinput' | 'audiooutput';
  onDeviceChange: (value: string) => void;
}

export default function AudioDevice({ disabled, level, kind, onDeviceChange }: AudioDeviceProps) {
  const classes = useStyles();
  const devices = useDevices().filter(device => device.kind === kind);
  const [selectedDevice, setSelectedDevice] = useState('');

  const { audioLevelText, deviceLabelHeader, headerText } = labels[kind];
  const noAudioRedirect = !Audio.prototype.setSinkId && kind === 'audiooutput';

  const updateSelectedDevice = (value: string) => {
    if (value !== selectedDevice) {
      onDeviceChange(value);
      setSelectedDevice(value);
    }
  };

  useEffect(() => {
    if (devices.length) {
      updateSelectedDevice(selectedDevice || devices[0].deviceId);
    }
  }, [devices]);

  return (
    <div style={{ width: 'calc(50% - 1em)', minWidth: '300px', marginBottom: '30px' }}>
      <Typography variant="h5">{headerText}</Typography>

      {noAudioRedirect && (
        <div className={classes.deviceLabelContainer}>
          <Typography variant="subtitle2">{deviceLabelHeader}</Typography>
          <Typography>System Default Audio Output</Typography>
        </div>
      )}

      {!noAudioRedirect && (
        <FormControl disabled={disabled} variant="outlined" className={classes.form} fullWidth>
          <InputLabel>{deviceLabelHeader}</InputLabel>
          <Select
            label={deviceLabelHeader}
            value={selectedDevice}
            onChange={e => updateSelectedDevice(e.target.value as string)}
          >
            {devices.map((device) => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <div className={classes.audioLevelContainer}>
        <Typography variant="subtitle2" style={{ marginRight: '1em' }}>
          {audioLevelText}:
        </Typography>
        <ProgressBar
          position={level}
          duration={0.1}
          style={{ flex: '1', margin: '0' }}
        />
      </div>
    </div>
  );
}
