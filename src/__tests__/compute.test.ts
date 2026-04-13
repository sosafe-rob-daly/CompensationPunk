import { describe, it, expect } from 'vitest';
import { computeComp, toDisplayCurrency } from '../engine/compute';

describe('computeComp', () => {
  it('returns correct P50 for Senior Backend at Big Tech London', () => {
    const result = computeComp('Engineering', 'Backend Engineer', 'L3 Senior', 'Big Tech', 'London', 'P50');
    expect(result.base).toBe(105000);
    expect(result.equity).toBe(55000);
    expect(result.bonus).toBe(18000);
    expect(result.total).toBe(178000);
  });

  it('applies city multiplier correctly', () => {
    const london = computeComp('Engineering', 'Backend Engineer', 'L3 Senior', 'Big Tech', 'London');
    const berlin = computeComp('Engineering', 'Backend Engineer', 'L3 Senior', 'Big Tech', 'Berlin');
    expect(berlin.total).toBeLessThan(london.total);
    // Berlin mult is 0.82
    expect(berlin.base).toBe(Math.round(105 * 1.00 * 1.00 * 1.00 * 0.82 * 1.00 * 1000));
  });

  it('applies sub-role multiplier', () => {
    const backend = computeComp('Engineering', 'Backend Engineer', 'L3 Senior', 'Big Tech', 'London');
    const ml = computeComp('Engineering', 'ML/AI Engineer', 'L3 Senior', 'Big Tech', 'London');
    // ML/AI multiplier is 1.15 vs Backend 1.00
    expect(ml.base).toBe(Math.round(105 * 1.15 * 1000));
    expect(ml.total).toBeGreaterThan(backend.total);
  });

  it('applies level multiplier', () => {
    const senior = computeComp('Engineering', 'Backend Engineer', 'L3 Senior', 'Big Tech', 'London');
    const staff = computeComp('Engineering', 'Backend Engineer', 'L4 Staff/Lead', 'Big Tech', 'London');
    expect(staff.total).toBeGreaterThan(senior.total);
    expect(staff.base).toBe(Math.round(105 * 1.28 * 1000));
  });

  it('applies percentile multiplier', () => {
    const p10 = computeComp('Engineering', 'Backend Engineer', 'L3 Senior', 'Big Tech', 'London', 'P10');
    const p50 = computeComp('Engineering', 'Backend Engineer', 'L3 Senior', 'Big Tech', 'London', 'P50');
    const p90 = computeComp('Engineering', 'Backend Engineer', 'L3 Senior', 'Big Tech', 'London', 'P90');
    expect(p10.total).toBeLessThan(p50.total);
    expect(p90.total).toBeGreaterThan(p50.total);
  });

  it('returns zeroes for unknown category', () => {
    const result = computeComp('Nonexistent', 'Foo', 'L3 Senior', 'Big Tech', 'London');
    expect(result).toEqual({ base: 0, equity: 0, bonus: 0, total: 0 });
  });

  it('defaults to L3 Senior when level is unknown', () => {
    const result = computeComp('Engineering', 'Backend Engineer', 'Unknown Level', 'Big Tech', 'London');
    const expected = computeComp('Engineering', 'Backend Engineer', 'L3 Senior', 'Big Tech', 'London');
    expect(result).toEqual(expected);
  });
});

describe('toDisplayCurrency', () => {
  it('returns GBP amount unchanged', () => {
    expect(toDisplayCurrency(100000, 'GBP')).toBe(100000);
  });

  it('converts GBP to EUR', () => {
    expect(toDisplayCurrency(100000, 'EUR')).toBe(117000);
  });
});
