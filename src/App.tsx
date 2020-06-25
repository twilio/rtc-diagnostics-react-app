import React, { useState } from 'react';
import { AppBar, Container, Toolbar, Grid, Paper, CssBaseline, makeStyles } from '@material-ui/core';
import CopyResultsWidget from './CopyResultsWidget/CopyResultsWidget';
import NetworkTestWidget from './NetworkTestWidget/NetworkTestWidget';
import ResultWidget from './ResultWidget/ResultWidget';

const useStyles = makeStyles({
  container: {
    marginTop: '2em',
  },
  paper: {
    padding: '1.5em',
  },
});

function App() {
  const classes = useStyles();
  const [results, setResults] = useState();

  async function getCredentials() {
    const token: string = await fetch('app/token')
      .then((res) => res.json())
      .then((res) => res.token);

    const iceServers: RTCIceServer[] = await fetch('app/turn-credentials')
      .then((res) => res.json())
      .then((res) => res.iceServers);

    return { token, iceServers };
  }

  return (
    <div>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <img src="twilio-logo.png" style={{ maxHeight: '64px' }} alt="Logo"></img>
        </Toolbar>
      </AppBar>
      <Container className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={3}>
              <NetworkTestWidget
                getCredentials={getCredentials}
                onComplete={(results) => setResults(results)}
                regions={['roaming', 'sydney']}
              />
            </Paper>
          </Grid>
          <Grid container justify="center">
            <CopyResultsWidget results={results} />
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <ResultWidget results={results} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
