import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Link, Row, Typography } from '../shared';

const hasError = (testResults: TestResults) => {
  const code = testResults.errors?.preflight?.code;
  return code === 31901 || code === 31005 || code === 31000;
};

const row: Row = {
  label: 'Signalling Servers Reachable',
  getValue: (testResults: TestResults) => {
    if (hasError(testResults)) {
      return 'No';
    }

    if (testResults.results.preflight || testResults.errors.preflight?.hasConnected) {
      return 'Yes';
    }

    return 'Did not run';
  },
  getWarning: (testResults: TestResults) => {
    if (hasError(testResults)) {
      return TestWarnings.error;
    }

    return TestWarnings.none;
  },
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
