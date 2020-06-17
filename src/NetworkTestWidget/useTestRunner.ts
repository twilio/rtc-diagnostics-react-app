import { useState, useCallback } from 'react';
import { Region, TestResults, NetworkTestName } from '../types';
import { createTestSuite } from './Tests';

export default function useTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTest, setActiveTest] = useState<NetworkTestName>();
  const [results, setResults] = useState<TestResults[]>([]);
  const [activeRegion, setActiveRegion] = useState<Region>();

  const startTests = useCallback(async (token: string, iceServers: RTCIceServer[], regions: Region[]) => {
    setIsRunning(true);
    setResults([]);
    const allResults: TestResults[] = [];
    const testSuites = regions.map((region) => createTestSuite(token, iceServers, region));

    for (const suite of testSuites) {
      const testResults: TestResults = {
        region: suite.region,
        results: {},
        errors: {},
      };

      setActiveRegion(suite.region);

      for (const test of suite.tests) {
        setActiveTest(test.name);
        try {
          const result = await test.start();
          testResults.results[test.kind] = result as any;
        } catch (err) {
          testResults.errors[test.kind] = err;
          break; // Stops remaining tests
        }
      }

      setResults((prevResults) => [...prevResults, testResults]);
      allResults.push(testResults);
    }

    setActiveTest(undefined);
    setActiveRegion(undefined);
    setIsRunning(false);
    return allResults;
  }, []);

  return {
    isRunning,
    activeTest,
    results,
    activeRegion,
    startTests,
  };
}
