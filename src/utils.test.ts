import {
  getAudioLevelPercentage,
  getBestEdge,
  getEdgeName,
  getStandardDeviation,
  regionalizeIceUrls,
  round,
} from './utils';
import { set } from 'lodash';
import { TestResults } from './types';

const testIceUrls: RTCIceServer[] = [
  {
    url: 'stun:global.stun.twilio.com:3478?transport=udp',
    urls: 'stun:global.stun.twilio.com:3478?transport=udp',
  },
  {
    url: 'turn:global.turn.twilio.com:3478?transport=tcp',
    urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
  },
];

describe('the round function', () => {
  it('should round to 2 decimal places by default', () => {
    expect(round(10.236)).toBe(10.24);
    expect(round(2.123)).toBe(2.12);
  });

  it('should round to the specified number of decimal places', () => {
    expect(round(23.678, 0)).toBe(24);
    expect(round(23.378, 0)).toBe(23);
    expect(round(23.378, 1)).toBe(23.4);
    expect(round(23.378124, 3)).toBe(23.378);
  });
});

describe('the regionalizeIceUrl function', () => {
  it('should replace "global" with the provided edge location', () => {
    expect(regionalizeIceUrls('ashburn', testIceUrls)).toEqual([
      {
        url: 'stun:ashburn.stun.twilio.com:3478?transport=udp',
        urls: 'stun:ashburn.stun.twilio.com:3478?transport=udp',
      },
      {
        url: 'turn:ashburn.turn.twilio.com:3478?transport=tcp',
        urls: 'turn:ashburn.turn.twilio.com:3478?transport=tcp',
      },
    ]);
  });

  it('should replace "global" with the provided edge when "urls" property is an array', () => {
    const iceServers = [
      {
        url: 'stun:global.stun.twilio.com:3478?transport=udp',
        urls: ['stun:global.stun.twilio.com:3478?transport=udp', 'stun:global.stun.twilio.com:443?transport=tcp'],
      },
    ];

    expect(regionalizeIceUrls('ashburn', iceServers)).toEqual([
      {
        url: 'stun:ashburn.stun.twilio.com:3478?transport=udp',
        urls: ['stun:ashburn.stun.twilio.com:3478?transport=udp', 'stun:ashburn.stun.twilio.com:443?transport=tcp'],
      },
    ]);
  });

  it('should not replace any text when edge is "roaming"', () => {
    expect(regionalizeIceUrls('roaming', testIceUrls)).toEqual(testIceUrls);
  });
});

describe('the getEdgeName function', () => {
  it('should return the capitalized edge name when the selected edge is not roaming', () => {
    const mockResult = set({ edge: 'ashburn' }, 'results.preflight.selectedEdge', 'ashburn') as TestResults;
    const edgeName = getEdgeName(mockResult);
    expect(edgeName).toBe('Ashburn');
  });

  it('should display the actual edge name when the selected edge is roaming', () => {
    let mockResult = set({ edge: 'roaming' }, 'results.preflight.selectedEdge', 'roaming') as TestResults;
    mockResult = set(mockResult, 'results.preflight.edge', 'ashburn');
    const edgeName = getEdgeName(mockResult);
    expect(edgeName).toBe('Roaming - Ashburn');
  });
});

describe('the getBestEdge function', () => {
  it('should return the capitalized edge name when the selected edge is not roaming', () => {
    const mockResult1 = set({ edge: 'ashburn' }, 'results.preflight.stats.mos.average', 5) as TestResults;
    const mockResult2 = set({ edge: 'roaming' }, 'results.preflight.stats.mos.average', 3) as TestResults;
    const bestEdge = getBestEdge([mockResult1, mockResult2]);
    expect(bestEdge).toEqual(mockResult1);
  });
});

describe('the getAudioLevelPercentage function', () => {
  [
    { inputLevel: 0, outputPercentage: 0 },
    { inputLevel: 1, outputPercentage: 0.5 },
    { inputLevel: 200, outputPercentage: 100 },
    { inputLevel: 30, outputPercentage: 15 },
  ].forEach(({ inputLevel, outputPercentage }) => {
    it(`should return ${outputPercentage} if input level is ${inputLevel}`, () => {
      expect(getAudioLevelPercentage(inputLevel)).toEqual(outputPercentage);
    });
  });
});

describe('the getStandardDeviation function', () => {
  [
    { stdDev: 0, values: [0, 0, 0, 0] },
    { stdDev: 0, values: [] },
    { stdDev: 12.03, values: [30, 20, 10, 10, 43, 32] },
  ].forEach(({ stdDev, values }) => {
    it(`should return ${stdDev}`, () => {
      expect(getStandardDeviation(values)).toEqual(stdDev);
    });
  });
});
