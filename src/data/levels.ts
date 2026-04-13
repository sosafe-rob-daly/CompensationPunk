import type { LevelData } from '../types/compensation';

export const LEVELS: Record<string, LevelData> = {
  'L1 Junior':       { base: 0.55, equity: 0.10, bonus: 0.35, short: 'Junior' },
  'L2 Mid':          { base: 0.75, equity: 0.38, bonus: 0.62, short: 'Mid' },
  'L3 Senior':       { base: 1.00, equity: 1.00, bonus: 1.00, short: 'Senior' },
  'L4 Staff/Lead':   { base: 1.28, equity: 1.90, bonus: 1.35, short: 'Staff' },
  'L5 Principal/Dir': { base: 1.58, equity: 3.20, bonus: 1.85, short: 'Principal' },
  'L6 VP/Exec':      { base: 2.05, equity: 5.50, bonus: 2.60, short: 'VP' },
};
