import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Link, Row, Typography } from '../shared';

const hasError = (testResults: TestResults) => {
  const code = testResults.errors.preflight?.code;
  return code === 31901 || code === 31005;
};

const row: Row = {
  label: 'Signalling Servers Reachable',
  getValue: (testResults: TestResults) => (hasError(testResults) ? 'No' : 'Yes'),
  getWarning: (testResults: TestResults) => (hasError(testResults) ? TestWarnings.error : TestWarnings.none),
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
