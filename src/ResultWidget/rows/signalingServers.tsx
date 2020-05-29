import React from 'react';

import { TestResults, TestWarnings } from '../../types';
import { Typography } from '@material-ui/core';
import { Link, Row } from './shared';

const row: Row = {
  label: 'Signaling Servers Reachable',
  getValue: (testResults: TestResults) => 'Yes',
  getWarning: (testResults: TestResults) => TestWarnings.none,
  tooltipContent: {
    label: (
      <Typography>
        Tests connectivity to the Signalling servers. See{' '}
        <Link href="https://www.twilio.com/docs/voice/client/javascript/voice-client-js-and-mobile-sdks-network-connectivity-requirements#signalling-connectivity-requirements">
          connectivity requirements
        </Link>{' '}
        for more information. Calls cannot be established without connectivity to the signalling servers
      </Typography>
    ),
    [TestWarnings.error]: (
      <Typography>
        The Signalling server could not be reached. Ensure your device has internet connectivity, DNS is configured
        correctly, and any firewalls allow access to Twilio’s{' '}
        <Link href="https://www.twilio.com/docs/voice/client/javascript/voice-client-js-and-mobile-sdks-network-connectivity-requirements#signalling-connectivity-requirements">
          Signalling Servers
        </Link>
      </Typography>
    ),
  },
};

export default row;
