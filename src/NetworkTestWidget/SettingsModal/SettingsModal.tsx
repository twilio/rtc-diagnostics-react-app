import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  Typography,
} from '@material-ui/core';
import { Call } from '@twilio/voice-sdk';
import { DEFAULT_CODEC_PREFERENCES, DEFAULT_EDGES, MAX_SELECTED_EDGES, MIN_SELECTED_EDGES } from '../../constants';
import { makeStyles } from '@material-ui/core/styles';
import { Edge } from '../../types';

const { PCMU, Opus } = Call.Codec;

const useStyles = makeStyles({
  container: {
    padding: '1em',
    maxWidth: '400px',
  },
  innerContainer: {
    display: 'block',
    padding: '1em',
    width: '100%',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

type InitialState = {
  [key in Edge]: boolean;
};

const initialState: InitialState = {
  ashburn: false,
  dublin: false,
  frankfurt: false,
  roaming: false,
  'sao-paulo': false,
  singapore: false,
  sydney: false,
  tokyo: false,
  'ashburn-ix': false,
  'london-ix': false,
  'frankfurt-ix': false,
  'san-jose-ix': false,
  'singapore-ix': false,
};

DEFAULT_EDGES.forEach((edge) => (initialState[edge] = true));

const codecMap = {
  [Opus]: [Opus],
  [PCMU]: [PCMU],
  [Opus + PCMU]: [Opus, PCMU],
  [PCMU + Opus]: [PCMU, Opus],
};

const getEdgeArray = (edgeObj: InitialState) =>
  Object.entries(edgeObj)
    .filter((e) => e[1])
    .map((e) => e[0]);

export default function SettingsModal({
  isOpen,
  onSettingsChange,
}: {
  isOpen: boolean;
  onSettingsChange: (q: any) => void;
}) {
  const classes = useStyles();

  const [edges, setEdges] = useState(initialState);
  const [codec, setCodec] = useState<string>(DEFAULT_CODEC_PREFERENCES.join(''));
  const selectedEdges = Object.values(edges).filter((isSelected) => isSelected).length;

  const handleEdgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const edgeName = event.target.name;
    const isChecked = event.target.checked;

    setEdges((prevEdges) => {
      const newEdges = { ...prevEdges, [edgeName]: isChecked };
      const newEdgesArrayLength = getEdgeArray(newEdges).length;

      if (newEdgesArrayLength >= MIN_SELECTED_EDGES && newEdgesArrayLength <= MAX_SELECTED_EDGES) {
        return newEdges;
      } else {
        return prevEdges;
      }
    });
  };

  const handleCodecChange = (event: React.ChangeEvent<HTMLInputElement>) => setCodec(event.target.name);

  const handleClose = () =>
    onSettingsChange({
      edges: getEdgeArray(edges),
      codecPreferences: codecMap[codec],
    });

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Grid container className={classes.container}>
        <form className={classes.innerContainer}>
          <div className={classes.headerContainer}>
            <Typography gutterBottom>
              <strong>Edge Locations:</strong>
            </Typography>
            <Typography>{`${selectedEdges} of ${MAX_SELECTED_EDGES}`}</Typography>
          </div>
          <FormGroup>
            <Grid container>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox checked={edges.ashburn} onChange={handleEdgeChange} name="ashburn" />}
                  label="Ashburn"
                />
                <FormControlLabel
                  control={<Checkbox checked={edges.dublin} onChange={handleEdgeChange} name="dublin" />}
                  label="Dublin"
                />
                <FormControlLabel
                  control={<Checkbox checked={edges.frankfurt} onChange={handleEdgeChange} name="frankfurt" />}
                  label="Frankfurt"
                />
                <FormControlLabel
                  control={<Checkbox checked={edges.roaming} onChange={handleEdgeChange} name="roaming" />}
                  label="Roaming"
                />
                <FormControlLabel
                  control={<Checkbox checked={edges['sao-paulo']} onChange={handleEdgeChange} name="sao-paulo" />}
                  label="Sao Paulo"
                />
                <FormControlLabel
                  control={<Checkbox checked={edges.singapore} onChange={handleEdgeChange} name="singapore" />}
                  label="Singapore"
                />
                <FormControlLabel
                  control={<Checkbox checked={edges.sydney} onChange={handleEdgeChange} name="sydney" />}
                  label="Sydney"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox checked={edges.tokyo} onChange={handleEdgeChange} name="tokyo" />}
                  label="Tokyo"
                />
                <FormControlLabel
                  control={<Checkbox checked={edges['ashburn-ix']} onChange={handleEdgeChange} name="ashburn-ix" />}
                  label="Ashburn IX"
                />
                <FormControlLabel
                  control={<Checkbox checked={edges['london-ix']} onChange={handleEdgeChange} name="london-ix" />}
                  label="London IX"
                />
                <FormControlLabel
                  control={<Checkbox checked={edges['frankfurt-ix']} onChange={handleEdgeChange} name="frankfurt-ix" />}
                  label="Frankfurt IX"
                />
                <FormControlLabel
                  control={<Checkbox checked={edges['san-jose-ix']} onChange={handleEdgeChange} name="san-jose-ix" />}
                  label="San Jose IX"
                />
                <FormControlLabel
                  control={<Checkbox checked={edges['singapore-ix']} onChange={handleEdgeChange} name="singapore-ix" />}
                  label="Singapore IX"
                />
              </Grid>
            </Grid>
          </FormGroup>

          <Divider style={{ margin: '1em 0' }} />

          <Typography gutterBottom>
            <strong>Codec Preferences:</strong>
          </Typography>
          <FormGroup>
            <Grid container direction="column">
              <FormControlLabel
                control={<Radio checked={codec === Opus} onChange={handleCodecChange} name={Opus} />}
                label="Opus"
              />
              <FormControlLabel
                control={<Radio checked={codec === PCMU} onChange={handleCodecChange} name={PCMU} />}
                label="PCMU"
              />
              <FormControlLabel
                control={<Radio checked={codec === Opus + PCMU} onChange={handleCodecChange} name={Opus + PCMU} />}
                label="Opus, PCMU"
              />
              <FormControlLabel
                control={<Radio checked={codec === PCMU + Opus} onChange={handleCodecChange} name={PCMU + Opus} />}
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
