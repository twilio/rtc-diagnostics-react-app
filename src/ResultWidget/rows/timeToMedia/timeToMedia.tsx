import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Link, Row, Typography } from '../shared';

const row: Row = {
  label: 'Time to Media',
  getValue: (testResults: TestResults) => testResults.results.preflight?.networkTiming?.peerConnection?.duration,
  getWarning: (testResults: TestResults) =>
    (testResults.results.preflight?.networkTiming?.peerConnection?.duration ?? 0) < 1001
      ? TestWarnings.none
      : TestWarnings.warn,
  tooltipContent: {
    label: (
      <Typography>
        Tests connectivity to the Media servers. See{' '}
        <Link href="https://www.twilio.com/docs/voice/client/javascript/voice-client-js-and-mobile-sdks-network-connectivity-requirements#voice-media-servers-connectivity-requirements">
          media connectivity requirements
        </Link>{' '}
        for more information. Unreachable media servers cause the call to drop prematurely and could cause one way audio
        type issues.
      </Typography>
    ),
    [TestWarnings.warn]: (
      <Typography>
        The media server could not be reached. Ensure your device has internet connectivity, and any firewalls allow
        access to Twilio’s{' '}
        <Link href="https://www.twilio.com/docs/voice/client/javascript/voice-client-js-and-mobile-sdks-network-connectivity-requirements#voice-media-servers-connectivity-requirements">
          Media servers
        </Link>
      </Typography>
    ),
  },
};

export default row;
