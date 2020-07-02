import { useState, useCallback } from 'react';
import { Region, TestResults, NetworkTestName } from '../../types';
import { bitrateTestRunner, preflightTestRunner } from '../Tests/Tests';

export default function useTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTest, setActiveTest] = useState<NetworkTestName>();
  const [results, setResults] = useState<TestResults[]>([]);
  const [activeRegion, setActiveRegion] = useState<Region>();

  const runTests = useCallback(
    async (
      getVoiceToken: () => Promise<string>,
      getTURNCredentials: () => Promise<RTCIceServer[]>,
      regions: Region[]
    ) => {
      setIsRunning(true);
      setResults([]);
      const allResults: TestResults[] = [];

      for (const region of regions) {
        const testResults: TestResults = {
          region: region,
          results: {},
          errors: {},
        };

        setActiveRegion(region);
        setActiveTest('Preflight Test');

        try {
          const voiceToken = await getVoiceToken();
          testResults.results.preflight = await preflightTestRunner(region, voiceToken);
        } catch (err) {
          testResults.errors.preflight = err;
        }

        if (!testResults.errors.preflight) {
          setActiveTest('Bitrate Test');
          try {
            const TURNCredentials = await getTURNCredentials();
            testResults.results.bitrate = await bitrateTestRunner(region, TURNCredentials);
          } catch (err) {
            testResults.errors.bitrate = err;
          }
        }

        setResults((prevResults) => [...prevResults, testResults]);
        allResults.push(testResults);
      }

      setActiveTest(undefined);
      setActiveRegion(undefined);
      setIsRunning(false);
      return allResults;
    },
    []
  );

  return {
    isRunning,
    activeTest,
    results,
    activeRegion,
    runTests,
  };
}
