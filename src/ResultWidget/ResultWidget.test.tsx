import React from 'react';
import ResultWidget from './ResultWidget';
import { shallow } from 'enzyme';
import { TableContainer, Table } from '@material-ui/core';

import toJson, { OutputMapper } from 'enzyme-to-json';

const testResults: any = [
  {
    region: 'roaming',
    results: {
      preflight: {
        callSid: 'CA12345',
        edge: 'ashburn',
        networkTiming: {
          peerConnection: {
            duration: 1618,
          },
        },
        samples: [
          {
            bytesReceived: 6296,
          },
        ],
        selectedEdge: 'roaming',
        selectedIceCandidatePair: {
          localCandidate: {
            relayProtocol: 'udp',
          },
        },
        stats: {
          jitter: {
            average: 5.4444,
            max: 9,
            min: 2,
          },
          mos: {
            average: 4.3868,
            max: 4.4067161340069765,
            min: 4.171315102552577,
          },
          rtt: {
            average: 69.667,
            max: 212,
            min: 54,
          },
        },
        testTiming: {
          start: 1593709997840,
          end: 1593710025637,
          duration: 27797,
        },
        totals: {
          packetsLostFraction: 2,
        },
        warnings: [{ name: 'high-latency' }],
        isTurnRequired: true,
        callQuality: 'excellent',
      },
      bitrate: {
        averageBitrate: 2875.4694113266423,
      },
    },
    errors: {},
  },
  {
    region: 'tokyo',
    results: {},
    errors: {
      preflight: {
        code: 31000,
      },
    },
  },
];

// This function is used to clean up the jest snapshot, making it easier to read.
const snapshotMapper: OutputMapper = (json) => {
  const match = json.type.match(/WithStyles\(ForwardRef\((\w+)\)\)/);
  if (match) {
    json.type = match[1];
  }
  return json;
};

describe('the ResultWidget component', () => {
  it('should not render when results are not present', () => {
    const wrapper = shallow(<ResultWidget />);
    expect(wrapper.find(TableContainer).exists()).toBe(false);
  });

  it('should render correctly when results are present', () => {
    const wrapper = shallow(<ResultWidget results={testResults} />);
    expect(toJson(wrapper.find(Table), { map: snapshotMapper })).toMatchSnapshot();
  });
});
