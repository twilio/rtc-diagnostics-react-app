import React from 'react';
import Alert from '../common/Alert/Alert';
import BrowserCompatibilityWidget from './BrowserCompatibilityWidget';
import { Device } from 'twilio-client';
import { shallow } from 'enzyme';

jest.mock('twilio-client', () => ({ Device: {} }));

describe('the BrowserCompatibilityWidget component', () => {
  it('should render null when the browser is supported', () => {
    // @ts-ignore
    Device.isSupported = true;
    const wrapper = shallow(<BrowserCompatibilityWidget />);
    expect(wrapper.getElement()).toBe(null);
  });

  it('should render an Alert when the browser is not supported', () => {
    // @ts-ignore
    Device.isSupported = false;
    const wrapper = shallow(<BrowserCompatibilityWidget />);
    expect(wrapper.find(Alert).exists()).toBe(true);
  });
});
