import React, { useState } from 'react';
import { AppBar, Container, Toolbar, Grid, Paper, CssBaseline, makeStyles, Typography } from '@material-ui/core';
import CopyResultsWidget from './CopyResultsWidget/CopyResultsWidget';
import NetworkTestWidget from './NetworkTestWidget/NetworkTestWidget';
import ResultWidget from './ResultWidget/ResultWidget';
import SummaryWidget from './SummaryWidget/SummaryWidget';

const useStyles = makeStyles({
  container: {
    marginTop: '2em',
  },
  paper: {
    padding: '1.5em',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1em',
  },
});

function App() {
  const classes = useStyles();
  const [results, setResults] = useState();

  async function getTURNCredentials() {
    const iceServers: RTCIceServer[] = await fetch('app/turn-credentials')
      .then((res) => res.json())
      .then((res) => res.iceServers);

    return iceServers;
  }

  async function getVoiceToken() {
    const token: string = await fetch('app/token')
      .then((res) => res.json())
      .then((res) => res.token);

    return token;
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
                getVoiceToken={getVoiceToken}
                getTURNCredentials={getTURNCredentials}
                onComplete={(results) => setResults(results)}
                regions={['roaming', 'dublin']}
              />
              <SummaryWidget results={results} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              {results && (
                <div className={classes.tableHeader}>
                  <Typography variant="h5">Test Results:</Typography>
                  <CopyResultsWidget results={results} />
                </div>
              )}
              <ResultWidget results={results} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
