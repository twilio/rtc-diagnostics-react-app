import React from 'react';
import {
  Dialog,
  Grid,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Typography,
  Radio,
  Button,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Region } from '../../types';

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
  ashburn: true,
  dublin: false,
  frankfurt: false,
  roaming: true,
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

export default function SettingsModal({ isOpen, handleClose }: { isOpen: boolean; handleClose: () => void }) {
  const classes = useStyles();

  const [regions, setRegions] = React.useState(initialState);
  const [codecState, setCodecState] = React.useState<string>('Opus');

  const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegions({ ...regions, [event.target.name]: event.target.checked });
  };

  const handleCodecChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCodecState(event.target.name);
  };

  return (
    <Dialog open={isOpen}>
      <Grid container className={classes.container}>
        <FormControl required error={false} className={classes.innerContainer}>
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
        </FormControl>

        <Divider style={{ width: '100%' }} />

        <FormControl required error={false} component="fieldset" className={classes.innerContainer}>
          <Typography gutterBottom>
            <strong>Audio Codecs:</strong>
          </Typography>
          <FormGroup>
            <Grid container direction="column">
              <FormControlLabel
                control={<Radio checked={codecState === 'Opus'} onChange={handleCodecChange} name="Opus" />}
                label="Opus"
              />
              <FormControlLabel
                control={<Radio checked={codecState === 'PCMU'} onChange={handleCodecChange} name="PCMU" />}
                label="PCMU"
              />
              <FormControlLabel
                control={<Radio checked={codecState === 'both'} onChange={handleCodecChange} name="Both" />}
                label="Both"
              />
            </Grid>
          </FormGroup>
        </FormControl>
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
