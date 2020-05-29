import { Region } from './types';

export const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

function replaceRegion(url: string, region: Region) {
  return url.replace('global', region);
}

export function replaceRegions(region: Region, iceServers: RTCIceServer[]) {
  return iceServers.map((server: RTCIceServer) => {
    const result = {
      ...server,
    };

    if (result.url) {
      result.url = replaceRegion(result.url, region);
    }

    if (typeof result.urls === 'string') {
      result.urls = replaceRegion(result.urls, region);
    }

    if (Array.isArray(result.urls)) {
      result.urls = result.urls.map((url) => replaceRegion(url, region));
    }
    return result;
  });
}

const regionMap = {
  sydney: 'Sydney',
  'sao-paolo': 'Sao Paolo',
  dublin: 'Dublin',
  frankfurt: 'Frankfurt',
  tokyo: 'Tokyo',
  singapore: 'Singapore',
  ashburn: 'Ashburn',
  roaming: 'Roaming',
  'ashburn-ix': 'Ashburn IX',
  'san-jose-ix': 'San Jose IX',
  'london-ix': 'London IX',
  'frankfurt-ix': 'Frankfurt IX',
  'singapore-ix': 'Singapore IX',
};

export function getRegionName(region: Region) {
  return regionMap[region];
}
