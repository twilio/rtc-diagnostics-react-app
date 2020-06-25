import { round } from './utils';

describe('the round function', () => {
  it('should round to 2 decimal places by default', () => {
    expect(round(10.236)).toBe(10.24);
    expect(round(2.123)).toBe(2.12);
  });

  it('should round to the specified number of decimal places', () => {
    expect(round(23.678, 0)).toBe(24);
    expect(round(23.378, 0)).toBe(23);
    expect(round(23.378, 1)).toBe(23.4);
    expect(round(23.378124, 3)).toBe(23.378);
  });
});
