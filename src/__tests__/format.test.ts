import { describe, it, expect } from 'vitest';
import { fmt, fmtFull } from '../engine/format';

describe('fmt', () => {
  it('formats values under 1000', () => {
    expect(fmt(500, 'GBP')).toBe('\u00A3500');
  });

  it('formats thousands with k suffix', () => {
    expect(fmt(105000, 'GBP')).toBe('\u00A3105k');
  });

  it('formats millions with M suffix', () => {
    expect(fmt(1500000, 'GBP')).toBe('\u00A31.5M');
  });

  it('uses EUR symbol for EUR currency', () => {
    expect(fmt(105000, 'EUR')).toBe('\u20AC105k');
  });
});

describe('fmtFull', () => {
  it('formats GBP with pound symbol', () => {
    expect(fmtFull(105000, 'GBP')).toBe('\u00A3105,000');
  });

  it('formats EUR with euro symbol', () => {
    expect(fmtFull(105000, 'EUR')).toBe('\u20AC105,000');
  });
});
