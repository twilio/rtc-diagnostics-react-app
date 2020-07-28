import React, { useState } from 'react';
import {
  Dialog,
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Radio,
  Button,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Region } from '../../types';
import { Connection } from 'twilio-client';
import { DEFAULT_CODEC_PREFERENCES, DEFAULT_REGIONS } from '../../constants';

const useStyles = makeStyles({
  container: {
    padding: '1em',
    width: '400px',
  },
  innerContainer: {
    display: 'block',
    padding: '1em',
    width: '100%',
  },
});

type InitialState = {
  [key in Region]: boolean;
};

const initialState: InitialState = {
  ashburn: false,
  dublin: false,
  frankfurt: false,
  roaming: false,
  'sao-paolo': false,
  singapore: false,
  sydney: false,
  tokyo: false,
  'ashburn-ix': false,
  'london-ix': false,
  'frankfurt-ix': false,
  'san-jose-ix': false,
  'singapore-ix': false,
};

DEFAULT_REGIONS.forEach((region) => (initialState[region] = true));

const codecMap = {
  [Connection.Codec.Opus]: [Connection.Codec.Opus],
  [Connection.Codec.PCMU]: [Connection.Codec.PCMU],
  [Connection.Codec.Opus + Connection.Codec.PCMU]: [Connection.Codec.Opus, Connection.Codec.PCMU],
  [Connection.Codec.PCMU + Connection.Codec.Opus]: [Connection.Codec.PCMU, Connection.Codec.Opus],
};

export default function SettingsModal({
  isOpen,
  onSettingsChange,
}: {
  isOpen: boolean;
  onSettingsChange: (q: any) => void;
}) {
  const classes = useStyles();

  const [regions, setRegions] = useState(initialState);
  const [codec, setCodec] = useState<string>(DEFAULT_CODEC_PREFERENCES.join(''));

  const getRegionArray = (regionObj: InitialState) =>
    Object.entries(regionObj)
      .filter((e) => e[1])
      .map((e) => e[0]);

  const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regionName = event.target.name;
    const isChecked = event.target.checked;

    setRegions((prevRegions) => {
      const newRegions = { ...prevRegions, [regionName]: isChecked };
      const newRegionsArrayLength = getRegionArray(newRegions).length;

      if (newRegionsArrayLength > 0 && newRegionsArrayLength < 7) {
        return newRegions;
      } else {
        return prevRegions;
      }
    });
  };

  const handleCodecChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCodec(event.target.name);
  };

  const handleClose = () => {
    onSettingsChange({
      regions: getRegionArray(regions),
      codecPreferences: codecMap[codec],
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Grid container className={classes.container}>
        <form className={classes.innerContainer}>
          <Typography gutterBottom>
            <strong>Regions:</strong>
          </Typography>
          <FormGroup>
            <Grid container>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox checked={regions.ashburn} onChange={handleRegionChange} name="ashburn" />}
                  label="Ashburn"
                />
                <FormControlLabel
                  control={<Checkbox checked={regions.dublin} onChange={handleRegionChange} name="dublin" />}
                  label="Dublin"
                />
                <FormControlLabel
                  control={<Checkbox checked={regions.frankfurt} onChange={handleRegionChange} name="frankfurt" />}
                  label="Frankfurt"
                />
                <FormControlLabel
                  control={<Checkbox checked={regions.roaming} onChange={handleRegionChange} name="roaming" />}
                  label="Roaming"
                />
                <FormControlLabel
                  control={<Checkbox checked={regions['sao-paolo']} onChange={handleRegionChange} name="sao-paolo" />}
                  label="Sao Paolo"
                />
                <FormControlLabel
                  control={<Checkbox checked={regions.singapore} onChange={handleRegionChange} name="singapore" />}
                  label="Singapore"
                />
                <FormControlLabel
                  control={<Checkbox checked={regions.sydney} onChange={handleRegionChange} name="sydney" />}
                  label="Sydney"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox checked={regions.tokyo} onChange={handleRegionChange} name="tokyo" />}
                  label="Tokyo"
                />
                <FormControlLabel
                  control={<Checkbox checked={regions['ashburn-ix']} onChange={handleRegionChange} name="ashburn-ix" />}
                  label="Ashburn IX"
                />
                <FormControlLabel
                  control={<Checkbox checked={regions['london-ix']} onChange={handleRegionChange} name="london-ix" />}
                  label="London IX"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={regions['frankfurt-ix']} onChange={handleRegionChange} name="frankfurt-ix" />
                  }
                  label="Frankfurt IX"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={regions['san-jose-ix']} onChange={handleRegionChange} name="san-jose-ix" />
                  }
                  label="San Jose IX"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={regions['singapore-ix']} onChange={handleRegionChange} name="singapore-ix" />
                  }
                  label="Singapore IX"
                />
              </Grid>
            </Grid>
          </FormGroup>

          <Divider style={{ margin: '1em 0' }} />

          <Typography gutterBottom>
            <strong>Audio Codecs:</strong>
          </Typography>
          <FormGroup>
            <Grid container direction="column">
              <FormControlLabel
                control={
                  <Radio
                    checked={codec === Connection.Codec.Opus}
                    onChange={handleCodecChange}
                    name={Connection.Codec.Opus}
                  />
                }
                label="Opus"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={codec === Connection.Codec.PCMU}
                    onChange={handleCodecChange}
                    name={Connection.Codec.PCMU}
                  />
                }
                label="PCMU"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={codec === Connection.Codec.Opus + Connection.Codec.PCMU}
                    onChange={handleCodecChange}
                    name={Connection.Codec.Opus + Connection.Codec.PCMU}
                  />
                }
                label="Opus, PCMU"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={codec === Connection.Codec.PCMU + Connection.Codec.Opus}
                    onChange={handleCodecChange}
                    name={Connection.Codec.PCMU + Connection.Codec.Opus}
                  />
                }
                label="PCMU, Opus"
              />
            </Grid>
          </FormGroup>
        </form>
      </Grid>
      <Divider />
      <Grid container justify="flex-end">
        <Button color="secondary" onClick={handleClose} style={{ margin: '0.4em 0' }}>
          Apply
        </Button>
      </Grid>
    </Dialog>
  );
}
