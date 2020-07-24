import React from 'react';
import {
  Dialog,
  Grid,
  Paper,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Typography,
  Radio,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Region } from '../../types';

const useStyles = makeStyles({
  container: {
    padding: '2em',
    width: '500px',
  },
  innerContainer: {
    display: 'block',
    padding: '1em',
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

export default function SettingsModal({ isOpen, handleClose }: { isOpen: boolean; handleClose: () => void }) {
  const classes = useStyles();

  const [regionState, setRegionState] = React.useState(initialState);
  const [codecState, setCodecState] = React.useState<string>('Opus');

  const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegionState({ ...regionState, [event.target.name]: event.target.checked });
  };

  const handleCodecChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCodecState(event.target.name);
  };

  return (
    <Dialog open={isOpen}>
      <Grid container className={classes.container} spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <FormControl required error={false} component="fieldset" className={classes.innerContainer}>
              <Typography variant="subtitle2">Regions:</Typography>
              <FormGroup>
                <Grid container>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Checkbox checked={regionState.ashburn} onChange={handleRegionChange} name="ashburn" />}
                      label="Ashburn"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={regionState.dublin} onChange={handleRegionChange} name="dublin" />}
                      label="Dublin"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={regionState.frankfurt} onChange={handleRegionChange} name="frankfurt" />
                      }
                      label="Frankfurt"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={regionState.roaming} onChange={handleRegionChange} name="roaming" />}
                      label="Roaming"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={regionState['sao-paolo']} onChange={handleRegionChange} name="sao-paolo" />
                      }
                      label="Sao Paolo"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={regionState.singapore} onChange={handleRegionChange} name="singapore" />
                      }
                      label="Singapore"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={regionState.sydney} onChange={handleRegionChange} name="sydney" />}
                      label="Sydney"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container direction="column">
                      <FormControlLabel
                        control={<Checkbox checked={regionState.tokyo} onChange={handleRegionChange} name="tokyo" />}
                        label="Tokyo"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={regionState['ashburn-ix']}
                            onChange={handleRegionChange}
                            name="ashburn-ix"
                          />
                        }
                        label="Ashburn IX"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={regionState['london-ix']} onChange={handleRegionChange} name="london-ix" />
                        }
                        label="London IX"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={regionState['frankfurt-ix']}
                            onChange={handleRegionChange}
                            name="frankfurt-ix"
                          />
                        }
                        label="Frankfurt IX"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={regionState['san-jose-ix']}
                            onChange={handleRegionChange}
                            name="san-jose-ix"
                          />
                        }
                        label="San Jose IX"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={regionState['singapore-ix']}
                            onChange={handleRegionChange}
                            name="singapore-ix"
                          />
                        }
                        label="Singapore IX"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </FormGroup>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3}>
            <FormControl required error={false} component="fieldset" className={classes.innerContainer}>
              <Typography variant="subtitle2">Audio Codecs:</Typography>
              <FormGroup>
                <Grid container xs={12} justify="space-around">
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
          </Paper>
        </Grid>
        <Grid item>
          <Button color="secondary" variant="contained" onClick={handleClose}>
            Ok
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}
