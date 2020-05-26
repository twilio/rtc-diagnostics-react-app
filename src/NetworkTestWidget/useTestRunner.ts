import { useState, useCallback } from 'react';
import { Region } from '../utils';
import { createTestSuite } from './Tests';

export default function useTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTest, setActiveTest] = useState('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [activeRegion, setActiveRegion] = useState<Region>();

  const startTests = useCallback(async (token: string, iceServers: RTCIceServer[], regions: Region[]) => {
    setIsRunning(true);
    const testSuites = regions.map((region) => createTestSuite(token, iceServers, region));
    const r: any[] = [];

    for (const suite of testSuites) {
      const testResults: any = {
        region: suite.region,
        results: {},
      };

      setActiveRegion(suite.region);

      for (const test of suite.tests) {
        setProgress(((suite.tests.indexOf(test) + 0.2) / suite.tests.length) * 100);
        setActiveTest(test.name);
        const result = await test.start();
        testResults.results[test.kind] = result;
        setProgress(((suite.tests.indexOf(test) + 1) / suite.tests.length) * 100);
      }

      r.push(testResults);
    }

    setActiveTest('');
    setActiveRegion(undefined);
    setIsRunning(false);
    setResults(r);
    return r;
  }, []);

  return {
    isRunning,
    activeTest,
    progress,
    results,
    activeRegion,
    startTests,
  };
}
