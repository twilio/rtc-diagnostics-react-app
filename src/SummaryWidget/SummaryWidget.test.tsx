import React from 'react';
import { mount } from 'enzyme';
import SummaryWidget from './SummaryWidget';

const results = [
  {
    edge: 'ashburn',
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
    edge: 'dublin',
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
  it('should choose the edge with the highest mos score and display it', () => {
    const wrapper = mount(<SummaryWidget results={results as any} />);
    expect(wrapper.at(0).text()).toBe('Expected Call Quality: Great (5)Recommended Edge Location: Dublin');
  });

  it('should not render when "results" is undefined', () => {
    const wrapper = mount(<SummaryWidget results={undefined} />);
    expect(wrapper.childAt(0).exists()).toBe(false);
  });

  it('should not render when the "results" array has no results', () => {
    const wrapper = mount(<SummaryWidget results={[{ results: {} }, { results: {} }] as any} />);
    expect(wrapper.childAt(0).exists()).toBe(false);
  });

  it('should not render recommended result if there is only one result', () => {
    const wrapper = mount(<SummaryWidget results={results.slice(1) as any} />);
    expect(wrapper.at(0).text()).toBe('Expected Call Quality: Great (5)');
  });
});
