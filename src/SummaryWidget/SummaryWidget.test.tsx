import React from 'react';
import SummaryWidget from './SummaryWidget';
import { shallow } from 'enzyme';

const results = [
  {
    region: 'ashburn',
    results: {
      preflight: {
        callQuality: 'Good',
        stats: {
          mos: {
            average: 4,
          },
        },
      },
    },
  },
  {
    region: 'dublin',
    results: {
      preflight: {
        callQuality: 'Great',
        stats: {
          mos: {
            average: 5,
          },
        },
      },
    },
  },
];

describe('the SummaryWidget component', () => {
  it('should choose the region with the highest mos score and display it', () => {
    const wrapper = shallow(<SummaryWidget results={results as any} />);
    expect(wrapper.at(0).text()).toBe('Expected Call Quality: Great (5)Recommended Region: Dublin');
  });

  it('should not render when "results" is null', () => {
    const wrapper = shallow(<SummaryWidget results={undefined} />);
    expect(wrapper.get(0)).toBe(null);
  });

  it('should not render when the "results" array has no results', () => {
    const errors = [{ results: {} }, { results: {} }];
    const wrapper = shallow(<SummaryWidget results={errors as any} />);
    expect(wrapper.get(0)).toBe(null);
  });
});
