import React from 'react';
import { mount } from 'enzyme';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import WarningIcon from '@material-ui/icons/ReportProblemOutlined';

import ResultIcon from './ResultIcon';

jest.mock('../rows', () => ({
  rows: [{
    getWarning: (result: any) => result.warnings && result.warnings.length
  }]
}));

const components = [CloseIcon, CheckIcon, WarningIcon];

describe('the ResultIcon component', () => {
  [
    {
      testName: 'With errors and no warnings',
      data: {errors: ['foo']},
      assertions: [true, false, false]
    },{
      testName: 'With warnings and no errors',
      data: {warnings: ['foo']},
      assertions: [false, false, true]
    },{
      testName: 'With errors and warnings',
      data: {errors: ['foo'], warnings: ['foo']},
      assertions: [true, false, false]
    },{
      testName: 'Without errors and warnings',
      data: {},
      assertions: [false, true, false]
    },
  ].forEach(test => {
    it(test.testName, () => {
      const wrapper = mount(<ResultIcon result={test.data as any} />);
      test.assertions.forEach((value, i) => {
        expect(wrapper.find(components[i]).exists()).toBe(value);
      });
    });
  });
});
