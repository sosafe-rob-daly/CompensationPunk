import type { TierData } from '../types/compensation';

export const TIERS: Record<string, TierData> = {
  'Big Tech':            { base: 1.00, equity: 1.00, bonus: 1.00, desc: 'Google, Meta, Microsoft, Amazon, Apple' },
  'Scale-up':            { base: 0.88, equity: 0.50, bonus: 0.72, desc: 'Revolut, Wise, Spotify, Klarna' },
  'Mid-stage Startup':   { base: 0.78, equity: 0.25, bonus: 0.40, desc: 'Series B-D, 50-500 employees' },
  'Early-stage Startup': { base: 0.68, equity: 0.10, bonus: 0.18, desc: 'Seed-Series A, <50 employees' },
};
