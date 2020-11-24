import React from 'react';
import Alert from '../common/Alert/Alert';
import { Device } from 'twilio-client';
import { Link as LinkImpl, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core';

const Link = styled(LinkImpl)({
  fontWeight: 600,
  textDecoration: 'underline',
});

export default function () {
  if (Device.isSupported) return null;

  return (
    <Alert variant="error">
      <Typography variant="body1">
        Browser not suported. Please open this application in one of the{' '}
        <Link
          href="https://www.twilio.com/docs/voice/client/javascript#supported-browsers"
          target="_blank"
          rel="noopener"
        >
          supported browsers
        </Link>
        .
      </Typography>
      <Typography variant="body1">
        If you are using a supported browser, please ensure that this app is served over a{' '}
        <Link
          href="https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts"
          target="_blank"
          rel="noopener"
        >
          secure context
        </Link>
        .
      </Typography>
    </Alert>
  );
}
