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
      const result = shallow(<div>{getTooltipContent({ errors: {} } as any)}</div>);
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
      const result = shallow(<div>{getTooltipContent({ errors: {} } as any)}</div>);
      expect(result).toMatchInlineSnapshot(`
        <div>
          <span>
            Test Error Content
          </span>
        </div>
      `);
    });
  });

  it('should render an error when the bitrate test returns an "expired" error', () => {
    const result = shallow(<div>{getTooltipContent({ errors: { bitrate: { message: 'expired' } } } as any)}</div>);
    expect(result).toMatchInlineSnapshot(`
      <div>
        <Component
          key="expired"
        >
          App has expired. Please redeploy the app and try again.
        </Component>
      </div>
    `);
  });

  it('should render an error when the preflight test returns an "expired" error', () => {
    const result = shallow(<div>{getTooltipContent({ errors: { preflight: { message: 'expired' } } } as any)}</div>);
    expect(result).toMatchInlineSnapshot(`
      <div>
        <Component
          key="expired"
        >
          App has expired. Please redeploy the app and try again.
        </Component>
      </div>
    `);
  });
});
