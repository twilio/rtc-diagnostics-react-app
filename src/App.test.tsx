import React from 'react';
import App from './App';
import BrowserCompatibilityWidget from './BrowserCompatibilityWidget/BrowserCompatibilityWidget';
import AudioDeviceTestWidget from './AudioDeviceTestWidget/AudioDeviceTestWidget';
import NetworkTestWidget from './NetworkTestWidget/NetworkTestWidget';
import { shallow } from 'enzyme';

let mockDevice = { isSupported: true };
jest.mock('@twilio/voice-sdk', () => ({
  get Call() {
    return { Codec: { PCMU: 'pcmu', Opus: 'opus' } };
  },
  get Device() {
    return mockDevice;
  },
}));

// These components try to access real properties of @twilio/voice-sdk, but it doesn't
// work since @twilio/voice-sdk is mocked. These components dont actually need to be
// rendered, so we will mock them here.
jest.mock('./NetworkTestWidget/NetworkTestWidget', () => () => null);
jest.mock('./ResultWidget/ResultWidget', () => () => null);

describe('the App component', () => {
  describe('when the browser is supported', () => {
    beforeAll(() => (mockDevice.isSupported = true));

    it('should not render the BrowserCompatibilityWidget component', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.find(BrowserCompatibilityWidget).exists()).toBe(false);
    });

    it('should render the NetworkTestWidget component', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.find(NetworkTestWidget).exists()).toBe(true);
    });

    it('should render the AudioDeviceTestWidget component', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.find(AudioDeviceTestWidget).exists()).toBe(true);
    });
  });

  describe('when the browser is not supported', () => {
    beforeAll(() => (mockDevice.isSupported = false));

    it('should render the BrowserCompatibilityWidget component', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.find(BrowserCompatibilityWidget).exists()).toBe(true);
    });

    it('should not render the NetworkTestWidget component', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.find(NetworkTestWidget).exists()).toBe(false);
    });

    it('should not render the AudioDeviceTestWidget component', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.find(AudioDeviceTestWidget).exists()).toBe(false);
    });
  });
});
