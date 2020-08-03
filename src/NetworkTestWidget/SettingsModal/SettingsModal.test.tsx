import React from 'react';
import { Button } from '@material-ui/core';
import { Connection } from 'twilio-client';
import { mount, ReactWrapper } from 'enzyme';
import { Region } from '../../types';
import SettingsModal from './SettingsModal';

jest.mock('../../constants', () => ({
  DEFAULT_CODEC_PREFERENCES: ['opus'],
  DEFAULT_REGIONS: ['ashburn', 'dublin', 'roaming'],
}));

const { PCMU, Opus } = Connection.Codec;

const changeCheckbox = (wrapper: ReactWrapper, region: Region, checked: boolean) =>
  wrapper
    .find('input')
    .find({ name: region, type: 'checkbox' })
    .simulate('change', { target: { checked, name: region } });

describe('the SettingsModal component', () => {
  const handleSettingsChange = jest.fn();
  beforeEach(jest.clearAllMocks);

  it('should remove regions', () => {
    const wrapper = mount(<SettingsModal isOpen={true} onSettingsChange={handleSettingsChange} />);
    changeCheckbox(wrapper, 'ashburn', false);
    wrapper.find(Button).simulate('click');
    expect(handleSettingsChange).toHaveBeenCalledWith({
      codecPreferences: [Opus],
      regions: ['dublin', 'roaming'],
    });
  });

  it('should add regions', () => {
    const wrapper = mount(<SettingsModal isOpen={true} onSettingsChange={handleSettingsChange} />);
    changeCheckbox(wrapper, 'tokyo', true);
    wrapper.find(Button).simulate('click');
    expect(handleSettingsChange).toHaveBeenCalledWith({
      codecPreferences: [Opus],
      regions: ['ashburn', 'dublin', 'roaming', 'tokyo'],
    });
  });

  it('should not add more than six regions', () => {
    const wrapper = mount(<SettingsModal isOpen={true} onSettingsChange={handleSettingsChange} />);
    changeCheckbox(wrapper, 'tokyo', true);
    changeCheckbox(wrapper, 'frankfurt-ix', true);
    changeCheckbox(wrapper, 'sydney', true);
    changeCheckbox(wrapper, 'sao-paolo', true); // ignored
    changeCheckbox(wrapper, 'singapore', true); // ignored
    wrapper.find(Button).simulate('click');
    expect(handleSettingsChange).toHaveBeenCalledWith({
      codecPreferences: [Opus],
      regions: ['ashburn', 'dublin', 'roaming', 'sydney', 'tokyo', 'frankfurt-ix'],
    });
  });

  it('should not remove the last region', () => {
    const wrapper = mount(<SettingsModal isOpen={true} onSettingsChange={handleSettingsChange} />);
    changeCheckbox(wrapper, 'ashburn', false);
    changeCheckbox(wrapper, 'roaming', false);
    changeCheckbox(wrapper, 'dublin', false); // ignored
    wrapper.find(Button).simulate('click');
    expect(handleSettingsChange).toHaveBeenCalledWith({
      codecPreferences: [Opus],
      regions: ['dublin'],
    });
  });

  it('should return the correct value when selecting PCMU + OPUS', () => {
    const wrapper = mount(<SettingsModal isOpen={true} onSettingsChange={handleSettingsChange} />);
    wrapper
      .find('input')
      .find({ name: PCMU + Opus, type: 'radio' })
      .simulate('change', { target: { name: PCMU + Opus } });
    wrapper.find(Button).simulate('click');
    expect(handleSettingsChange).toHaveBeenCalledWith({
      codecPreferences: [PCMU, Opus],
      regions: ['ashburn', 'dublin', 'roaming'],
    });
  });

  it('should return the correct value when selecting OPUS + PCMU', () => {
    const wrapper = mount(<SettingsModal isOpen={true} onSettingsChange={handleSettingsChange} />);
    wrapper
      .find('input')
      .find({ name: Opus + PCMU, type: 'radio' })
      .simulate('change', { target: { name: PCMU + Opus } });
    wrapper.find(Button).simulate('click');
    expect(handleSettingsChange).toHaveBeenCalledWith({
      codecPreferences: [PCMU, Opus],
      regions: ['ashburn', 'dublin', 'roaming'],
    });
  });
});
