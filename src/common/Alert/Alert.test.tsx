import React from 'react';
import Alert from './Alert';
import { shallow } from 'enzyme';

describe('the Alert component', () => {
  it('should render the "info" variant correctly', () => {
    const wrapper = shallow(
      <Alert variant="info">
        <span>Test Info Content</span>
      </Alert>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render the "error" variant correctly', () => {
    const wrapper = shallow(
      <Alert variant="error">
        <span>Test Error Content</span>
      </Alert>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
