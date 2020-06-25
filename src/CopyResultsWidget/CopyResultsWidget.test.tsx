import React from 'react';
import { act } from 'react-dom/test-utils';
import { Button, SnackbarContent, Snackbar } from '@material-ui/core';
import CopyResultsWidget from './CopyResultsWidget';
import { mount } from 'enzyme';
import { TestResults } from '../types';

Object.defineProperty(navigator, 'clipboard', { value: { writeText: jest.fn(() => Promise.resolve('ok')) } });
const mockResults = ([{ results: 'test' }] as any) as TestResults[];

describe('the CopyResultsWidget', () => {
  it('should not render when there are no results', () => {
    const wrapper = mount(<CopyResultsWidget />);
    expect(wrapper.find(Button).exists()).toBe(false);
  });

  it('should render a button when results are available', () => {
    const wrapper = mount(<CopyResultsWidget results={mockResults} />);
    expect(wrapper.find(Button).exists()).toBe(true);
  });

  it('should copy results to the clipboard when clicked and then display a snackbar', async () => {
    const wrapper = mount(<CopyResultsWidget results={mockResults} />);
    expect(wrapper.find(Snackbar).prop('open')).toBe(false);

    await act(async () => {
      wrapper.find(Button).simulate('click');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`[
  {
    \"results\": \"test\"
  }
]`);

    wrapper.update();
    expect(wrapper.find(Snackbar).prop('open')).toBe(true);
  });
});
