import React from 'react';
import { Button } from '@material-ui/core';
import { Connection } from 'twilio-client';
import { mount, ReactWrapper } from 'enzyme';
import { Edge } from '../../types';
import SettingsModal from './SettingsModal';

jest.mock('../../constants', () => ({
  DEFAULT_CODEC_PREFERENCES: ['opus'],
  DEFAULT_EDGES: ['ashburn', 'roaming'],
  MAX_SELECTED_EDGES: 3,
  MIN_SELECTED_EDGES: 1,
}));

const { PCMU, Opus } = Connection.Codec;

const changeCheckbox = (wrapper: ReactWrapper, edge: Edge, checked: boolean) =>
  wrapper
    .find('input')
    .find({ name: edge, type: 'checkbox' })
    .simulate('change', { target: { checked, name: edge } });

describe('the SettingsModal component', () => {
  const handleSettingsChange = jest.fn();
  beforeEach(jest.clearAllMocks);

  it('should remove edges', () => {
    const wrapper = mount(<SettingsModal isOpen={true} onSettingsChange={handleSettingsChange} />);
    changeCheckbox(wrapper, 'ashburn', false);
    wrapper.find(Button).simulate('click');
    expect(handleSettingsChange).toHaveBeenCalledWith({
      codecPreferences: [Opus],
      edges: ['roaming'],
    });
  });

  it('should add edges', () => {
    const wrapper = mount(<SettingsModal isOpen={true} onSettingsChange={handleSettingsChange} />);
    changeCheckbox(wrapper, 'tokyo', true);
    wrapper.find(Button).simulate('click');
    expect(handleSettingsChange).toHaveBeenCalledWith({
      codecPreferences: [Opus],
      edges: ['ashburn', 'roaming', 'tokyo'],
    });
  });

  it('should not add more than 3 edges', () => {
    const wrapper = mount(<SettingsModal isOpen={true} onSettingsChange={handleSettingsChange} />);
    changeCheckbox(wrapper, 'sao-paulo', true);
    changeCheckbox(wrapper, 'singapore', true); // ignored
    wrapper.find(Button).simulate('click');
    expect(handleSettingsChange).toHaveBeenCalledWith({
      codecPreferences: [Opus],
      edges: ['ashburn', 'roaming', 'sao-paulo'],
    });
  });

  it('should not remove the last edge', () => {
    const wrapper = mount(<SettingsModal isOpen={true} onSettingsChange={handleSettingsChange} />);
    changeCheckbox(wrapper, 'ashburn', false);
    changeCheckbox(wrapper, 'roaming', false); // ignored
    wrapper.find(Button).simulate('click');
    expect(handleSettingsChange).toHaveBeenCalledWith({
      codecPreferences: [Opus],
      edges: ['roaming'],
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
      edges: ['ashburn', 'roaming'],
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
      edges: ['ashburn', 'roaming'],
    });
  });
});
