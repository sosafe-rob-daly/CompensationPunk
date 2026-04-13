import type { PercentileKey } from '../types/compensation';

export const PCTS: Record<PercentileKey, number> = {
  P10: 0.78,
  P25: 0.88,
  P50: 1.00,
  P75: 1.15,
  P90: 1.35,
};

export const PCT_KEYS: PercentileKey[] = ['P10', 'P25', 'P50', 'P75', 'P90'];
