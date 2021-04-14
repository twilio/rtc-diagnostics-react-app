import React, { useState } from 'react';
import { getLogger } from 'loglevel';
import { AppBar, Container, Toolbar, Grid, Paper, CssBaseline, makeStyles, Typography } from '@material-ui/core';
import AudioDeviceTestWidget from './AudioDeviceTestWidget/AudioDeviceTestWidget';
import BrowserCompatibilityWidget from './BrowserCompatibilityWidget/BrowserCompatibilityWidget';
import CopyResultsWidget from './CopyResultsWidget/CopyResultsWidget';
import { Device } from 'twilio-client';
import { getJSON } from './utils';
import { APP_NAME, LOG_LEVEL } from './constants';
import NetworkTestWidget from './NetworkTestWidget/NetworkTestWidget';
import ResultWidget from './ResultWidget/ResultWidget';
import SummaryWidget from './SummaryWidget/SummaryWidget';

const log = getLogger(APP_NAME);
log.setLevel(LOG_LEVEL);

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

  function getTURNCredentials() {
    return getJSON('app/turn-credentials').then((res) => res.iceServers as RTCIceServer[]);
  }

  function getVoiceToken() {
    return getJSON('app/token').then((res) => res.token as string);
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
          {!Device.isSupported && (
            <Grid item xs={12}>
              <BrowserCompatibilityWidget />
            </Grid>
          )}
          {Device.isSupported && (
            <>
              <Grid item xs={12}>
                <Paper className={classes.paper} elevation={3}>
                  <AudioDeviceTestWidget />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paper} elevation={3}>
                  <NetworkTestWidget
                    getVoiceToken={getVoiceToken}
                    getTURNCredentials={getTURNCredentials}
                    onComplete={(res) => setResults(res)}
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
            </>
          )}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
