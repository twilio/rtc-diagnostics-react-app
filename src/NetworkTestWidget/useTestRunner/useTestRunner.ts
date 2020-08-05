import { Connection } from 'twilio-client';
import { bitrateTestRunner, preflightTestRunner } from '../Tests/Tests';
import { Edge, TestResults, NetworkTestName } from '../../types';
import { useState, useCallback } from 'react';

export default function useTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTest, setActiveTest] = useState<NetworkTestName>();
  const [results, setResults] = useState<TestResults[]>([]);
  const [activeEdge, setActiveEdge] = useState<Edge>();

  const runTests = useCallback(
    async (
      getVoiceToken: () => Promise<string>,
      getTURNCredentials: () => Promise<RTCIceServer[]>,
      edges: Edge[],
      codecPreferences: Connection.Codec[]
    ) => {
      setIsRunning(true);
      setResults([]);
      const allResults: TestResults[] = [];

      for (const edge of edges) {
        const testResults: TestResults = {
          edge,
          results: {},
          errors: {},
        };

        setActiveEdge(edge);
        setActiveTest('Preflight Test');

        try {
          const voiceToken = await getVoiceToken();
          const iceServers = await getTURNCredentials();
          testResults.results.preflight = await preflightTestRunner(edge, voiceToken, iceServers, codecPreferences);
        } catch (err) {
          testResults.errors.preflight = err;
        }

        if (!testResults.errors.preflight) {
          setActiveTest('Bitrate Test');
          try {
            const iceServers = await getTURNCredentials();
            testResults.results.bitrate = await bitrateTestRunner(edge, iceServers);
          } catch (err) {
            testResults.errors.bitrate = err;
          }
        }

        setResults((prevResults) => [...prevResults, testResults]);
        allResults.push(testResults);
      }

      setActiveTest(undefined);
      setActiveEdge(undefined);
      setIsRunning(false);
      return allResults;
    },
    []
  );

  return {
    isRunning,
    activeTest,
    results,
    activeEdge,
    runTests,
  };
}
