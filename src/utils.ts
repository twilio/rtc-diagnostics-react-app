import { maxBy } from 'lodash';
import { Edge, TestResults } from './types';
import { AUDIO_LEVEL_THRESHOLD } from './constants';

export function getAudioLevelPercentage (level: number) {
  return (level * 100) / AUDIO_LEVEL_THRESHOLD; // 0 to 100
};

export function getStandardDeviation (values: number[]): number {
  // Same method used in client sdks
  // https://github.com/twilio/twilio-client.js/blob/master/lib/twilio/statsMonitor.ts#L88

  if (values.length <= 0) {
    return 0;
  }

  const valueAverage: number = values.reduce(
    (partialSum: number, value: number) => partialSum + value,
    0,
  ) / values.length;

  const diffSquared: number[] = values.map(
    (value: number) => Math.pow(value - valueAverage, 2),
  );

  const stdDev: number = Math.sqrt(diffSquared.reduce(
    (partialSum: number, value: number) => partialSum + value,
    0,
  ) / diffSquared.length);

  return round(stdDev);
}

export function getJSON(url: string) {
  return fetch(url).then(async (res) => {
    if (res.status === 401) {
      throw new Error('expired');
    }

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return await res.json();
  });
}

export const getBestEdge = (results: TestResults[]) =>
  maxBy(results, (result) => result.results.preflight?.stats?.mos?.average);

export const round = (num: number, decimals = 2) =>
  Math.round((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;

export function regionalizeIceUrls(edge: Edge, iceServers: RTCIceServer[]) {
  if (edge === 'roaming') {
    return iceServers;
  }

  return iceServers.map((server: RTCIceServer) => {
    const result = {
      ...server,
    };

    if (result.url) {
      result.url = result.url.replace('global', edge);
    }

    if (typeof result.urls === 'string') {
      result.urls = result.urls.replace('global', edge);
    }

    if (Array.isArray(result.urls)) {
      result.urls = result.urls.map((url) => url.replace('global', edge));
    }
    return result;
  });
}

export const codecNameMap = {
  opus: 'Opus',
  pcmu: 'PCMU',
};

export const edgeNameMap = {
  sydney: 'Sydney',
  'sao-paulo': 'Sao Paulo',
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

export function getEdgeName(result: TestResults) {
  if (result.results.preflight?.selectedEdge === 'roaming') {
    return `Roaming - ${edgeNameMap[result.results.preflight?.edge as Edge]}`;
  }

  return edgeNameMap[result.edge as Edge];
}
