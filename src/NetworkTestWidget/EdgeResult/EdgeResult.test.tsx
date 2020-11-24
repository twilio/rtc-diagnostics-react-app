import React from 'react';
import { mount } from 'enzyme';
import EdgeResult from './EdgeResult';
import ProgressBar from '../ProgressBar/ProgressBar';
import { Tooltip } from '@material-ui/core';

import ResultIcon from '../../ResultWidget/ResultIcon/ResultIcon';

const testResult: any = {
  errors: {},
  results: { preflight: { warnings: [], samples: [{ bytesReceived: 1000 }] } },
} as any;

describe('the EdgeResult component', () => {
  describe('child ProgressBar component', () => {
    it('should have the correct props with no active test', () => {
      const wrapper = mount(<EdgeResult codecPreferences={[]} edge="ashburn" isActive={true} />);
      expect(wrapper.find(ProgressBar).props()).toEqual({ duration: 0, position: 0 });
    });

    it('should have the correct props when the active test is Preflight', () => {
      const wrapper = mount(
        <EdgeResult codecPreferences={[]} edge="ashburn" isActive={true} activeTest="Preflight Test" />
      );
      expect(wrapper.find(ProgressBar).props()).toEqual({ duration: 25, position: 62.5 });
    });

    it('should have the correct props when the active test is Bitrate', () => {
      const wrapper = mount(
        <EdgeResult codecPreferences={[]} edge="ashburn" isActive={true} activeTest="Bitrate Test" />
      );
      expect(wrapper.find(ProgressBar).props()).toEqual({ duration: 15, position: 100 });
    });
  });

  it('should not render a Tooltip or Progress bar when it is not active and there are no results', () => {
    const wrapper = mount(<EdgeResult codecPreferences={[]} edge="ashburn" isActive={false} />);
    expect(wrapper.find(ProgressBar).exists()).toBe(false);
    expect(wrapper.find(Tooltip).exists()).toBe(false);
  });

  it('should render a Tooltip when results are present', () => {
    const wrapper = mount(<EdgeResult codecPreferences={[]} edge="ashburn" isActive={false} result={testResult} />);
    expect(wrapper.find(Tooltip).exists()).toBe(true);
  });

  it('should render ResultIcon when results are present', () => {
    const wrapper = mount(<EdgeResult codecPreferences={[]} edge="ashburn" isActive={false} result={testResult} />);
    expect(wrapper.find(ResultIcon).exists()).toBe(true);
  });

  it('should not render ResultIcon when there are not results', () => {
    const wrapper = mount(<EdgeResult codecPreferences={[]} edge="ashburn" isActive={false} />);
    expect(wrapper.find(ResultIcon).exists()).toBe(false);
  });
});
