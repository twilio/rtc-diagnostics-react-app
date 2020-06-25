import { Region, TestResults } from './types';

export const round = (num: number, decimals = 2) =>
  Math.round((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;

function regionalizeIceUrl(url: string, region: Region) {
  // 'roaming' region is equivalent to 'global' for NTS
  if (region === 'roaming') {
    return url;
  }

  return url.replace('global', region);
}

export function regionalizeIceUrls(region: Region, iceServers: RTCIceServer[]) {
  return iceServers.map((server: RTCIceServer) => {
    const result = {
      ...server,
    };

    if (result.url) {
      result.url = regionalizeIceUrl(result.url, region);
    }

    if (typeof result.urls === 'string') {
      result.urls = regionalizeIceUrl(result.urls, region);
    }

    if (Array.isArray(result.urls)) {
      result.urls = result.urls.map((url) => regionalizeIceUrl(url, region));
    }
    return result;
  });
}

export const regionNameMap = {
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

export function getRegionName(result: TestResults) {
  if (result.results.preflight?.selectedEdge === 'roaming') {
    return `Roaming (${regionNameMap[result.results.preflight?.edge as Region]})`;
  }

  return regionNameMap[result.region as Region];
}
