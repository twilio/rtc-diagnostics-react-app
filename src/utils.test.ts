import { round, regionalizeIceUrls, getRegionName } from './utils';

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
  it('should replace "global" with the provided region', () => {
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

  it('should replace "global" with the provided region when "urls" property is an array', () => {
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

  it('should not replace any text when region is "roaming"', () => {
    expect(regionalizeIceUrls('roaming', testIceUrls)).toEqual(testIceUrls);
  });
});
