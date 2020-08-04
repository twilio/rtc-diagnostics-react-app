import React from 'react';
import { mount } from 'enzyme';
import RegionResult from './RegionResult';
import ProgressBar from '../ProgressBar/ProgressBar';
import { Tooltip } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';

const testResult: any = {
  errors: {},
  results: { preflight: { warnings: [], samples: [{ bytesReceived: 1000 }] } },
} as any;

describe('the RegionResult component', () => {
  describe('child ProgressBar component', () => {
    it('should have the correct props with no active test', () => {
      const wrapper = mount(<RegionResult edge="ashburn" isActive={true} />);
      expect(wrapper.find(ProgressBar).props()).toEqual({ duration: 0, position: 0 });
    });

    it('should have the correct props when the active test is Preflight', () => {
      const wrapper = mount(<RegionResult edge="ashburn" isActive={true} activeTest="Preflight Test" />);
      expect(wrapper.find(ProgressBar).props()).toEqual({ duration: 25, position: 62.5 });
    });

    it('should have the correct props when the active test is Bitrate', () => {
      const wrapper = mount(<RegionResult edge="ashburn" isActive={true} activeTest="Bitrate Test" />);
      expect(wrapper.find(ProgressBar).props()).toEqual({ duration: 15, position: 100 });
    });
  });

  it('should not render a Tooltip or Progress bar when it is not active and there are no results', () => {
    const wrapper = mount(<RegionResult edge="ashburn" isActive={false} />);
    expect(wrapper.find(ProgressBar).exists()).toBe(false);
    expect(wrapper.find(Tooltip).exists()).toBe(false);
  });

  it('should render a Tooltip when results are present', () => {
    const wrapper = mount(<RegionResult edge="ashburn" isActive={false} result={testResult} />);
    expect(wrapper.find(Tooltip).exists()).toBe(true);
  });

  it('should render a CheckIcon when the results have no warnings or errors', () => {
    const wrapper = mount(<RegionResult edge="ashburn" isActive={false} result={testResult} />);
    expect(wrapper.find(CheckIcon).exists()).toBe(true);
  });

  it('should render a WarningIcon when the results have warnings and no errors', () => {
    const testResult: any = {
      errors: {},
      results: { preflight: { warnings: [{ name: 'high-rtt' }], samples: [{ bytesReceived: 1000 }] } },
    } as any;
    const wrapper = mount(<RegionResult edge="ashburn" isActive={false} result={testResult} />);
    expect(wrapper.find(WarningIcon).exists()).toBe(true);
  });

  it('should render a CloseIcon when the results have warnings and errors', () => {
    const testResult: any = {
      errors: { testError: 'error' },
      results: {},
    } as any;
    const wrapper = mount(<RegionResult edge="ashburn" isActive={false} result={testResult} />);
    expect(wrapper.find(CloseIcon).exists()).toBe(true);
  });
});
