import { act, renderHook } from '@testing-library/react-hooks';
import { useDevices } from './useDevices';

describe('the useDevices hook', () => {
  const mediaInfoProps = { groupId: 'foo', toJSON: () => {} };
  const root = global as any;
  let mockGetUserMedia: () => Promise<any>;
  let mockDevices: any;
  let originalMediaDevices: any;

  beforeEach(() => {
    mockDevices = [
      {
        deviceId: 'input1',
        label: '',
        kind: 'audioinput',
        ...mediaInfoProps,
      },
      {
        deviceId: 'output1',
        label: '',
        kind: 'audiooutput',
        ...mediaInfoProps,
      },
    ];

    mockGetUserMedia = () => {
      mockDevices[0].label = 'deviceinput1';
      mockDevices[1].label = 'deviceoutput1';
      return Promise.resolve();
    };

    originalMediaDevices = root.navigator.mediaDevices;
    root.navigator.mediaDevices = {
      enumerateDevices: () => Promise.resolve(mockDevices),
      getUserMedia: mockGetUserMedia,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as any;
  });

  afterAll(() => {
    root.navigator.mediaDevices = originalMediaDevices;
  });

  it('should call getUserMedia if labels do not exist', async () => {
    const { result, waitForNextUpdate } = renderHook(useDevices);
    await waitForNextUpdate();
    expect(result.current.length).toBeTruthy();
    expect(result.current[0].label).toEqual('deviceinput1');
    expect(result.current[1].label).toEqual('deviceoutput1');
  });

  it('should not call getUserMedia if audio labels exist', async () => {
    mockDevices[0].label = 'foo';
    mockDevices[1].label = 'bar';
    mockDevices.push({
      deviceId: 'video1',
      label: '',
      kind: 'videoinput',
      ...mediaInfoProps,
    });

    const { result, waitForNextUpdate } = renderHook(useDevices);
    await waitForNextUpdate();
    expect(result.current.length).toEqual(3);
    expect(result.current[0].label).toEqual('foo');
    expect(result.current[1].label).toEqual('bar');
  });

  it('should respond to "devicechange" events', async () => {
    const { result, waitForNextUpdate } = renderHook(useDevices);
    await waitForNextUpdate();
    expect(root.navigator.mediaDevices.addEventListener).toHaveBeenCalledWith('devicechange', expect.any(Function));
    act(() => {
      root.navigator.mediaDevices.enumerateDevices = () =>
        Promise.resolve([
          {
            deviceId: 'inputFoo',
            label: 'labelBar',
            kind: 'audioinput',
            ...mediaInfoProps,
          },
        ]);
      root.navigator.mediaDevices.addEventListener.mock.calls[0][1]();
    });
    await waitForNextUpdate();
    expect(result.current).toEqual([
      {
        deviceId: 'inputFoo',
        label: 'labelBar',
        kind: 'audioinput',
        ...mediaInfoProps,
      },
    ]);
  });
});
