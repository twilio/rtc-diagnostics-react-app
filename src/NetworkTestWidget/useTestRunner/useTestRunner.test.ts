import { act, renderHook } from '@testing-library/react-hooks';
import { bitrateTestRunner, preflightTestRunner } from '../Tests/Tests';
import { Call } from '@twilio/voice-sdk';
import useTestRunner from './useTestRunner';

const resolvePromise = (value: any) => new Promise<any>((resolve) => setTimeout(() => resolve(value), 10));
const rejectPromise = (value: any) => new Promise<any>((_, reject) => setTimeout(() => reject(value), 10));

const mockGetVoiceToken = jest.fn(() => resolvePromise('mockToken'));
const mockGetTURNCredentils = jest.fn(() => resolvePromise([{ url: 'mockTurnURL', urls: 'mockTurnURLs' }]));

jest.mock('../Tests/Tests');

const mockBitrateTestRunner = bitrateTestRunner as jest.Mock<any>;
const mockPreflightTestRunner = preflightTestRunner as jest.Mock<any>;

describe('the useTestRunner hook', () => {
  beforeEach(jest.clearAllMocks);

  it('should correcly run all tests and update its state accordingly', async () => {
    mockBitrateTestRunner.mockImplementation(() => resolvePromise('mockBitrateResult'));
    mockPreflightTestRunner.mockImplementation(() => resolvePromise('mockPreflightResult'));

    const { result, waitForNextUpdate } = renderHook(useTestRunner);

    expect(result.current.isRunning).toBe(false);

    // Start the tests
    act(() => {
      result.current.runTests(mockGetVoiceToken, mockGetTURNCredentils, ['ashburn', 'tokyo'], [Call.Codec.Opus]);
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.activeTest).toBe('Preflight Test');
    expect(result.current.activeEdge).toBe('ashburn');

    await waitForNextUpdate(); // Wait for preflight test to complete

    expect(result.current.activeTest).toBe('Bitrate Test');

    await waitForNextUpdate(); // Wait for bitrate test to complete

    // Expect results for first reigon
    expect(result.current.results).toEqual([
      { errors: {}, edge: 'ashburn', results: { bitrate: 'mockBitrateResult', preflight: 'mockPreflightResult' } },
    ]);

    // Prepare for next edge
    expect(result.current.activeEdge).toBe('tokyo');
    expect(result.current.activeTest).toBe('Preflight Test');

    await waitForNextUpdate(); // Wait for preflight test to complete

    expect(result.current.activeTest).toBe('Bitrate Test');

    await waitForNextUpdate(); // Wait for bitrate test to complete

    // Expect all results
    expect(result.current.results).toEqual([
      { errors: {}, edge: 'ashburn', results: { bitrate: 'mockBitrateResult', preflight: 'mockPreflightResult' } },
      { errors: {}, edge: 'tokyo', results: { bitrate: 'mockBitrateResult', preflight: 'mockPreflightResult' } },
    ]);

    // Expect hook to reset its state
    expect(result.current.isRunning).toBe(false);
    expect(result.current.activeTest).toBe(undefined);
    expect(result.current.activeEdge).toBe(undefined);

    // Expect this function to be called once for every edge
    expect(mockGetVoiceToken).toHaveBeenCalledTimes(2);

    // Expect this function to be called twice for every edge
    expect(mockGetTURNCredentils).toHaveBeenCalledTimes(4);
  });

  it('should not run bitrate test when preflight test fails', async () => {
    mockBitrateTestRunner.mockImplementation(() => resolvePromise('mockBitrateReport'));
    mockPreflightTestRunner.mockImplementation(() => rejectPromise('mockPreflightError'));

    const { result, waitForNextUpdate } = renderHook(useTestRunner);
    expect(result.current.isRunning).toBe(false);

    // Start tests
    act(() => {
      result.current.runTests(mockGetVoiceToken, mockGetTURNCredentils, ['ashburn'], [Call.Codec.Opus]);
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.activeEdge).toBe('ashburn');

    await waitForNextUpdate(); // Wait for preflight test to fail

    // Expect results object with error
    expect(result.current.results).toEqual([
      { errors: { preflight: 'mockPreflightError' }, edge: 'ashburn', results: {} },
    ]);

    expect(result.current.isRunning).toBe(false);

    expect(mockGetVoiceToken).toHaveBeenCalledTimes(1);
    expect(mockGetTURNCredentils).toHaveBeenCalledTimes(1);
  });

  it('should correctly report bitrate errors when the preflight test succeeds', async () => {
    mockBitrateTestRunner.mockImplementation(() => rejectPromise('mockBitrateError'));
    mockPreflightTestRunner.mockImplementation(() => resolvePromise('mockPreflightReport'));

    const { result, waitForNextUpdate } = renderHook(useTestRunner);
    expect(result.current.isRunning).toBe(false);

    // Start tests
    act(() => {
      result.current.runTests(mockGetVoiceToken, mockGetTURNCredentils, ['ashburn'], [Call.Codec.Opus]);
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.activeEdge).toBe('ashburn');

    await waitForNextUpdate(); // Wait for preflight test to complete

    expect(result.current.activeTest).toBe('Bitrate Test');

    await waitForNextUpdate(); // Wait for bitrate test to fail

    // Expect results with bitrate error
    expect(result.current.results).toEqual([
      { errors: { bitrate: 'mockBitrateError' }, edge: 'ashburn', results: { preflight: 'mockPreflightReport' } },
    ]);

    expect(result.current.isRunning).toBe(false);

    expect(mockGetVoiceToken).toHaveBeenCalledTimes(1);
    expect(mockGetTURNCredentils).toHaveBeenCalledTimes(2);
  });
});
