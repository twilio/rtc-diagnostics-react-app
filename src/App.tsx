import React, { useEffect, useState } from 'react';
import { AppBar, Container, Toolbar, Grid, Paper, CssBaseline, makeStyles } from '@material-ui/core';
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
  const [token, setToken] = useState<string>();
  const [turnCredentials, setTurnCredentials] = useState<{ iceServers: RTCIceServer[] }>();

  const [results, setResults] = useState();

  useEffect(() => {
    fetch('app/token')
      .then((res) => res.json())
      .then((res) => setToken(res.token));

    fetch('app/turn-credentials')
      .then((res) => res.json())
      .then((res) => setTurnCredentials(res));
  }, []);

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
                token={token}
                iceServers={turnCredentials?.iceServers}
                onResult={(results) => setResults(results)}
              />
            </Paper>
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
