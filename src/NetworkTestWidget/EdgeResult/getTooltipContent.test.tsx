import React from 'react';
import getTooltipContent from './getTooltipContent';
import * as rowsObj from '../../ResultWidget/rows';
import { shallow } from 'enzyme';
import { TestWarnings } from '../../types';

describe('the getTooltipContent function', () => {
  describe('with a valid MOS score', () => {
    it('should correctly return an array of react components', () => {
      // We already have tests for the getValue and getWarning functions for all the rows.
      // Here we can mock the rows instead of passing mock data to the real rows.
      // As a result, nothing needs to be passed to the getTooltipContent function.

      // @ts-ignore
      rowsObj.rows = [
        {
          label: 'Expected Audio Quality (MOS)',
          getValue: () => 'Excellent (4.24)',
        },
        {
          getWarning: () => TestWarnings.warn,
          tooltipContent: { [TestWarnings.warn]: <span>Test Warning Content</span> },
        },
      ];

      // @ts-ignore
      const result = shallow(<div>{getTooltipContent({} as any)}</div>);
      expect(result).toMatchInlineSnapshot(`
        <div>
          <Component
            key="quality"
          >
            Expected call quality: 
            Excellent (4.24)
          </Component>
          <span>
            Test Warning Content
          </span>
        </div>
      `);
    });
  });

  describe('with no MOS score', () => {
    it('should correctly return an array of react components', () => {
      // @ts-ignore
      rowsObj.rows = [
        {
          label: 'Expected Audio Quality (MOS)',
          getValue: () => {},
        },
        {
          getWarning: () => TestWarnings.error,
          tooltipContent: { [TestWarnings.error]: <span>Test Error Content</span> },
        },
      ];

      // @ts-ignore
      const result = shallow(<div>{getTooltipContent({} as any)}</div>);
      expect(result).toMatchInlineSnapshot(`
        <div>
          <span>
            Test Error Content
          </span>
        </div>
      `);
    });
  });
});
