import React from 'react';
import { Select, Typography } from '@material-ui/core';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';

import AudioDevice from './AudioDevice';
import ProgressBar from '../../NetworkTestWidget/ProgressBar/ProgressBar';

const mediaInfoProps = { groupId: 'foo', toJSON: () => {} };
const mockDevices = [{
  deviceId: 'input1',
  label: 'deviceinput1',
  kind: 'audioinput',
  ...mediaInfoProps,
},{
  deviceId: 'output1',
  label: 'deviceoutput1',
  kind: 'audiooutput',
  ...mediaInfoProps,
}];

jest.mock('../useDevices/useDevices', () => ({
  useDevices: () => mockDevices,
}));

describe('the AudioDevice component', () => {
  const noop = () => {};
  let originalAudio: any;
  let mockAudio: any;

  beforeEach(() => {
    mockAudio = {
      prototype: {
        setSinkId: true
      }
    };
    originalAudio = global.Audio;
    global.Audio = mockAudio;
  });

  afterEach(() => {
    global.Audio = originalAudio;
  });

  it('should render default audio output if audio redirect is not supported', () => {
    mockAudio.prototype.setSinkId = false;
    const wrapper = shallow(<AudioDevice disabled={false} level={1} kind="audiooutput" onDeviceChange={noop} />);
    expect(wrapper.find(Select).exists()).toBeFalsy();
    expect(wrapper.find(Typography).at(2).text()).toEqual('System Default Audio Output');
  });

  describe('props.disabled', () => {
    it('should disable dropdown if disabled=true', () => {
      const { container } = render(<AudioDevice disabled={true} level={1} kind="audioinput" onDeviceChange={noop} />);
      const el = container.querySelector('.MuiInputBase-root') as HTMLDivElement;
      expect(el.className.includes('Mui-disabled')).toBeTruthy();
    });
    it('should not disable dropdown if disabled=false', () => {
      const { container } = render(<AudioDevice disabled={false} level={1} kind="audioinput" onDeviceChange={noop} />);
      const el = container.querySelector('.MuiInputBase-root') as HTMLDivElement;
      expect(el.className.includes('Mui-disabled')).toBeFalsy();
    });
  });

  describe('props.level', () => {
    it('should set progress to 0 if level is 0', () => {
      const wrapper = shallow(<AudioDevice disabled={false} level={1} kind="audioinput" onDeviceChange={noop} />);
      expect(wrapper.find(ProgressBar).prop('position')).toBe(1);
    });
    it('should set progress to 20 if level is 20', () => {
      const wrapper = shallow(<AudioDevice disabled={false} level={20} kind="audioinput" onDeviceChange={noop} />);
      expect(wrapper.find(ProgressBar).prop('position')).toBe(20);
    });
  });

  describe('props.kind', () => {
    it('should render input devices if kind is audioinput', () => {
      const wrapper = shallow(<AudioDevice disabled={false} level={1} kind="audioinput" onDeviceChange={noop} />);
      expect(wrapper.find(Select).at(0).text()).toEqual('deviceinput1');
    });
    it('should render output devices if kind is audiooutput', () => {
      const wrapper = shallow(<AudioDevice disabled={false} level={1} kind="audiooutput" onDeviceChange={noop} />);
      expect(wrapper.find(Select).at(0).text()).toEqual('deviceoutput1');
    });
  });

  describe('props.style', () => {
    it('should should apply style', () => {
      const { container } = render(<AudioDevice style={{ width: '100px' }} disabled={false} level={1} kind="audioinput" onDeviceChange={noop} />);
      const el = container.querySelector('.MuiFormControl-root') as HTMLDivElement;
      expect(el.parentElement?.style.width).toEqual('100px');
    });
  });
});
