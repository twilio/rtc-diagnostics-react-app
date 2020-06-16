import React from 'react';

import { TestResults, TestWarnings } from '../../../types';
import { Link, Row, Typography } from '../shared';

const hasError = (testResults: TestResults) => {
  const code = testResults.errors.preflight?.code;
  return code === 31003;
};

const row: Row = {
  label: 'Media Servers Reachable',
  getValue: (testResults: TestResults) => {
    if (hasError(testResults)) {
      return 'No';
    }

    if (
      testResults.results.preflight?.samples?.slice(-1)[0].bytesReceived ||
      testResults.errors.preflight?.latestSample?.bytesReceived
    ) {
      if (testResults.results.preflight?.isTurnRequired) {
        const turnProtocol = testResults.results.preflight?.selectedIceCandidatePair?.localCandidate.relayProtocol;
        if (turnProtocol === 'tcp') {
          return 'Yes (TURN TCP)';
        }

        if (turnProtocol === 'udp') {
          return 'Yes (TURN UDP)';
        }

        return 'Yes (TURN)';
      }
      return 'Yes';
    }

    return 'Did not run';
  },
  getWarning: (testResults: TestResults) => {
    if (hasError(testResults)) {
      return TestWarnings.error;
    }

    if (
      testResults.results.preflight?.samples?.slice(-1)[0].bytesReceived ||
      testResults.errors.preflight?.latestSample?.bytesReceived
    ) {
      if (testResults.results.preflight?.isTurnRequired) {
        const turnProtocol = testResults.results.preflight?.selectedIceCandidatePair?.localCandidate.relayProtocol;
        if (turnProtocol === 'tcp') {
          return TestWarnings.warnTurnTCP;
        }

        if (turnProtocol === 'udp') {
          return TestWarnings.warnTurnUDP;
        }

        return TestWarnings.warnTurn;
      }
      return TestWarnings.none;
    }

    return TestWarnings.none;
  },
  tooltipContent: {
    label: (
      <Typography>
        Tests connectivity to the Media servers. See{' '}
        <Link href="https://www.twilio.com/docs/voice/client/javascript/voice-client-js-and-mobile-sdks-network-connectivity-requirements#voice-media-servers-connectivity-requirements">
          media connectivity requirements
        </Link>
        for more information. Unreachable media servers cause the call to drop prematurely and could cause one way audio
        type issues.
      </Typography>
    ),
    [TestWarnings.error]: (
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
