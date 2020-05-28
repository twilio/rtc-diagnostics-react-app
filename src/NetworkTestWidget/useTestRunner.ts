import { useState, useCallback } from 'react';
import { Region } from '../types';
import { createTestSuite } from './Tests';

export default function useTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTest, setActiveTest] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [activeRegion, setActiveRegion] = useState<Region>();

  const startTests = useCallback(async (token: string, iceServers: RTCIceServer[], regions: Region[]) => {
    setIsRunning(true);
    const testSuites = regions.map((region) => createTestSuite(token, iceServers, region));

    for (const suite of testSuites) {
      const testResults: any = {
        region: suite.region,
        results: {},
        errors: {},
      };

      setActiveRegion(suite.region);

      for (const test of suite.tests) {
        setActiveTest(test.name);
        try {
          const result = await test.start();
          testResults.results[test.kind] = result;
        } catch (err) {
          testResults.errors[test.kind] = err;
          break; // Stops remaining tests
        }
      }

      setResults((prevResults) => [...prevResults, testResults]);
    }

    setActiveTest('');
    setActiveRegion(undefined);
    setIsRunning(false);
  }, []);

  return {
    isRunning,
    activeTest,
    results,
    activeRegion,
    startTests,
  };
}
