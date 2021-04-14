import React from 'react';
import { Button } from '@material-ui/core';
import NetworkTestWidget from './NetworkTestWidget';
import EdgeResult from './EdgeResult/EdgeResult';
import { shallow } from 'enzyme';
import useTestRunner from './useTestRunner/useTestRunner';
import Alert from '../common/Alert/Alert';

jest.mock('./useTestRunner/useTestRunner');
const mockUseTestRunner = useTestRunner as jest.Mock<any>;

jest.mock('../constants', () => ({
  APP_NAME: 'foo',
  DEFAULT_CODEC_PREFERENCES: ['opus'],
  DEFAULT_EDGES: ['ashburn', 'dublin', 'roaming'],
  LOG_LEVEL: 'debug',
}));

describe('the NetworkTestWidget component', () => {
  it('should render EdgeResult components when there are no results', () => {
    mockUseTestRunner.mockImplementation(() => ({
      isRunning: false,
      results: [],
      activeEdge: undefined,
      activeTest: undefined,
      runTests: jest.fn(),
    }));

    const wrapper = shallow(
      <NetworkTestWidget
        getTURNCredentials={(() => {}) as any}
        getVoiceToken={(() => {}) as any}
        onComplete={() => {}}
      />
    );

    expect(wrapper.find(EdgeResult).exists()).toBe(true);
    expect(wrapper.find(Button).find({ disabled: false }).length).toBe(2);
  });

  it('should correctly render EdgeResult components while tests are active', () => {
    mockUseTestRunner.mockImplementation(() => ({
      isRunning: true,
      results: [],
      activeEdge: 'ashburn',
      activeTest: 'bitrate',
      runTests: jest.fn(),
    }));

    const wrapper = shallow(
      <NetworkTestWidget
        getTURNCredentials={(() => {}) as any}
        getVoiceToken={(() => {}) as any}
        onComplete={() => {}}
      />
    );

    expect(wrapper.find(EdgeResult).find({ edge: 'ashburn' }).props()).toEqual({
      activeTest: 'bitrate',
      codecPreferences: ['opus'],
      isActive: true,
      edge: 'ashburn',
      result: undefined,
    });
    expect(wrapper.find(Button).find({ disabled: true }).length).toBe(2);
  });

  it('should correctly render EdgeResult components when there are results', () => {
    mockUseTestRunner.mockImplementation(() => ({
      isRunning: false,
      results: [{ errors: {} }],
      activeEdge: undefined,
      activeTest: undefined,
      runTests: jest.fn(),
    }));

    const wrapper = shallow(
      <NetworkTestWidget
        getTURNCredentials={(() => {}) as any}
        getVoiceToken={(() => {}) as any}
        onComplete={() => {}}
      />
    );

    expect(wrapper.find(EdgeResult).at(0).props()).toEqual({
      activeTest: undefined,
      codecPreferences: ['opus'],
      isActive: false,
      edge: 'ashburn',
      result: { errors: {} },
    });
  });

  it('should call the onComplete function with the results when the tests are complete', (done) => {
    mockUseTestRunner.mockImplementation(() => ({
      isRunning: false,
      results: [],
      activeEdge: undefined,
      activeTest: undefined,
      runTests: jest.fn(() => Promise.resolve('mockResults')),
    }));

    const mockOnComplete = jest.fn();

    const wrapper = shallow(
      <NetworkTestWidget
        getTURNCredentials={(() => {}) as any}
        getVoiceToken={(() => {}) as any}
        onComplete={mockOnComplete}
      />
    );

    wrapper.find(Button).at(0).simulate('click');

    setImmediate(() => {
      expect(mockOnComplete).toHaveBeenCalledWith('mockResults');
      done();
    });
  });

  it('should correctly render an Alert when the bitrate test returns an "expired" error', () => {
    mockUseTestRunner.mockImplementation(() => ({
      isRunning: false,
      results: [{ errors: { bitrate: { message: 'expired' } } }],
      activeEdge: undefined,
      activeTest: undefined,
      runTests: jest.fn(),
    }));

    const wrapper = shallow(
      <NetworkTestWidget
        getTURNCredentials={(() => {}) as any}
        getVoiceToken={(() => {}) as any}
        onComplete={() => {}}
      />
    );

    expect(wrapper.find(Alert).at(0)).toMatchInlineSnapshot(`
      <Alert
        variant="error"
      >
        <WithStyles(ForwardRef(Typography))
          variant="body1"
        >
          <strong>
            App has expired
          </strong>
           Please redeploy the app and try again.
        </WithStyles(ForwardRef(Typography))>
      </Alert>
    `);
  });

  it('should correctly render an Alert when the preflight test returns an "expired" error', () => {
    mockUseTestRunner.mockImplementation(() => ({
      isRunning: false,
      results: [{ errors: { preflight: { message: 'expired' } } }],
      activeEdge: undefined,
      activeTest: undefined,
      runTests: jest.fn(),
    }));

    const wrapper = shallow(
      <NetworkTestWidget
        getTURNCredentials={(() => {}) as any}
        getVoiceToken={(() => {}) as any}
        onComplete={() => {}}
      />
    );

    expect(wrapper.find(Alert).at(0)).toMatchInlineSnapshot(`
      <Alert
        variant="error"
      >
        <WithStyles(ForwardRef(Typography))
          variant="body1"
        >
          <strong>
            App has expired
          </strong>
           Please redeploy the app and try again.
        </WithStyles(ForwardRef(Typography))>
      </Alert>
    `);
  });
});
