import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { mount, shallow } from 'enzyme';

import Alert from '../common/Alert/Alert';
import AudioDevice from './AudioDevice/AudioDevice';
import AudioDeviceTestWidget from './AudioDeviceTestWidget';
import useTestRunner from './useTestRunner/useTestRunner';

jest.mock('./AudioDevice/AudioDevice');
jest.mock('./useTestRunner/useTestRunner');
const mockAudioDevice = AudioDevice as jest.Mock<any>;
const mockUseTestRunner = useTestRunner as jest.Mock<any>;

describe('the AudioDeviceTestWidget component', () => {
  let hookProps: any;

  beforeEach(() => {
    hookProps = {
      error: '',
      inputLevel: 0,
      isRecording: false,
      isAudioInputTestRunning: false,
      isAudioOutputTestRunning: false,
      outputLevel: 0,
      playAudio: jest.fn(),
      playbackURI: '',
      readAudioInput: jest.fn(),
      testEnded: false,
    };
    mockUseTestRunner.mockImplementation(() => hookProps);
    mockAudioDevice.mockImplementation(() => null);
  });

  it('should render correct components on load', () => {
    const wrapper = shallow(<AudioDeviceTestWidget/>);
    expect(wrapper.find(AudioDevice).length).toEqual(2);

    const outputDevice = wrapper.find(AudioDevice).at(0);
    const inputDevice = wrapper.find(AudioDevice).at(1);
    const recordBtn = wrapper.find(Button).at(0);
    const playBtn = wrapper.find(Button).at(1);

    expect(wrapper.find(Alert).exists()).toBeFalsy();
    expect(outputDevice.prop('disabled')).toBeFalsy();
    expect(inputDevice.prop('disabled')).toBeFalsy();
    expect(recordBtn.prop('disabled')).toBeFalsy();
    expect(playBtn.prop('disabled')).toBeTruthy();
    expect(recordBtn.text()).toEqual('Record');
    expect(playBtn.text()).toEqual('Play');
  });

  describe('passive testing', () => {
    it('should start passive testing by default', () => {
      mount(<AudioDeviceTestWidget/>);
      expect(hookProps.readAudioInput).toHaveBeenCalledWith({ deviceId: '' });
    });

    [
      {
        shouldBeCalled: true, props: { error: '', isRecording: false, isAudioInputTestRunning: false }
      },{
        shouldBeCalled: false, props: { error: '', isRecording: true, isAudioInputTestRunning: false }
      },{
        shouldBeCalled: false, props: { error: '', isRecording: false, isAudioInputTestRunning: true }
      },{
        shouldBeCalled: false, props: { error: '', isRecording: true, isAudioInputTestRunning: true }
      },{
        shouldBeCalled: false, props: { error: 'foo', isRecording: false, isAudioInputTestRunning: false }
      },{
        shouldBeCalled: false, props: { error: 'foo', isRecording: true, isAudioInputTestRunning: false }
      },{
        shouldBeCalled: false, props: { error: 'foo', isRecording: false, isAudioInputTestRunning: true }
      },{
        shouldBeCalled: false, props: { error: 'foo', isRecording: true, isAudioInputTestRunning: true }
      }
    ].forEach(({shouldBeCalled, props}) => {
      it(`when props are ${JSON.stringify(props)}`, () => {
        hookProps = {...hookProps, ...props};
        mount(<AudioDeviceTestWidget/>);

        if (shouldBeCalled) {
          expect(hookProps.readAudioInput).toHaveBeenCalledWith({ deviceId: '' });
        } else {
          expect(hookProps.readAudioInput).not.toHaveBeenCalledWith({ deviceId: '' });
        }
      });
    });
  });

  describe('button clicks', () => {
    beforeEach(() => {
      hookProps = {...hookProps, isAudioInputTestRunning: true, playbackURI: 'foo'};
    });

    it('should start recording when record is clicked', () => {
      const wrapper = mount(<AudioDeviceTestWidget/>);
      const recordBtn = wrapper.find(Button).at(0);
      recordBtn.simulate('click');
      expect(hookProps.readAudioInput).toHaveBeenCalledWith({ deviceId: '', enableRecording: true });
    });

    it('should play recorded click when play is clicked', () => {
      const wrapper = mount(<AudioDeviceTestWidget/>);
      const playBtn = wrapper.find(Button).at(1);
      playBtn.simulate('click');
      expect(hookProps.playAudio).toHaveBeenCalledWith({ deviceId: '', testURI: 'foo' });
    });
  });

  describe('button labels', () => {
    it('should set record button label to Record', () => {
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      expect(wrapper.find(Button).at(0).text()).toEqual('Record');
    });

    it('should set record button label to Recording...', () => {
      hookProps = {...hookProps, isRecording: true};
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      expect(wrapper.find(Button).at(0).text()).toEqual('Recording...');
    });

    it('should set play button label to Play', () => {
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      expect(wrapper.find(Button).at(1).text()).toEqual('Play');
    });

    it('should set play button label to Playing...', () => {
      hookProps = {...hookProps, isAudioOutputTestRunning: true};
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      expect(wrapper.find(Button).at(1).text()).toEqual('Playing...');
    });
  });

  describe('audio levels', () => {
    it('should pass output levels to AudioDevice', () => {
      hookProps = {...hookProps, outputLevel: 32};
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      expect(wrapper.find(AudioDevice).at(0).props().level).toEqual(32);
    });

    it('should pass input levels to AudioDevice', () => {
      hookProps = {...hookProps, inputLevel: 64};
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      expect(wrapper.find(AudioDevice).at(1).props().level).toEqual(64);
    });
  });

  describe('alerts', () => {
    it('should render error', () => {
      hookProps = {...hookProps, error: 'foo'};
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      const alert = wrapper.find(Alert).at(0);

      expect(wrapper.find(Alert).length).toEqual(1);
      expect(alert.props().variant).toEqual('error');
      expect(alert.find(Typography).text()).toEqual('foo');
    });

    it('should render warning', () => {
      hookProps = {...hookProps, warning: 'foo'};
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      const alert = wrapper.find(Alert).at(0);

      expect(wrapper.find(Alert).length).toEqual(1);
      expect(alert.props().variant).toEqual('warning');
      expect(alert.find(Typography).text()).toEqual('foo');
    });

    it('should render success if there is no error', () => {
      hookProps = {...hookProps, error: '', testEnded: true};
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      const alert = wrapper.find(Alert).at(0);

      expect(wrapper.find(Alert).length).toEqual(1);
      expect(alert.props().variant).toEqual('success');
      expect(alert.find(Typography).text()).toEqual('No issues detected');
    });

    it('should render success if there is no warning', () => {
      hookProps = {...hookProps, warning: '', testEnded: true};
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      const alert = wrapper.find(Alert).at(0);

      expect(wrapper.find(Alert).length).toEqual(1);
      expect(alert.props().variant).toEqual('success');
      expect(alert.find(Typography).text()).toEqual('No issues detected');
    });

    it('should not render success if there is an error', () => {
      hookProps = {...hookProps, error: 'foo', testEnded: true};
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      const alert = wrapper.find(Alert).at(0);

      expect(wrapper.find(Alert).length).toEqual(1);
      expect(alert.props().variant).toEqual('error');
      expect(alert.find(Typography).text()).toEqual('foo');
    });

    it('should not render success if there is a warning', () => {
      hookProps = {...hookProps, warning: 'foo', testEnded: true};
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      const alert = wrapper.find(Alert).at(0);

      expect(wrapper.find(Alert).length).toEqual(1);
      expect(alert.props().variant).toEqual('warning');
      expect(alert.find(Typography).text()).toEqual('foo');
    });

    it('should disable all controls if there is an error', () => {
      hookProps = {...hookProps, error: 'foo', testEnded: true};
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      expect(wrapper.find(AudioDevice).length).toEqual(2);

      const outputDevice = wrapper.find(AudioDevice).at(0);
      const inputDevice = wrapper.find(AudioDevice).at(1);
      const recordBtn = wrapper.find(Button).at(0);
      const playBtn = wrapper.find(Button).at(1);

      expect(outputDevice.prop('disabled')).toBeTruthy();
      expect(inputDevice.prop('disabled')).toBeTruthy();
      expect(recordBtn.prop('disabled')).toBeTruthy();
      expect(playBtn.prop('disabled')).toBeTruthy();
    });

    it('should not disable all controls if there is a warning', () => {
      hookProps = {...hookProps, warning: 'foo', testEnded: true, playbackURI: 'bar' };
      const wrapper = shallow(<AudioDeviceTestWidget/>);
      expect(wrapper.find(AudioDevice).length).toEqual(2);

      const outputDevice = wrapper.find(AudioDevice).at(0);
      const inputDevice = wrapper.find(AudioDevice).at(1);
      const recordBtn = wrapper.find(Button).at(0);
      const playBtn = wrapper.find(Button).at(1);

      expect(outputDevice.prop('disabled')).toBeFalsy();
      expect(inputDevice.prop('disabled')).toBeFalsy();
      expect(recordBtn.prop('disabled')).toBeFalsy();
      expect(playBtn.prop('disabled')).toBeFalsy();
    });
  });
});
