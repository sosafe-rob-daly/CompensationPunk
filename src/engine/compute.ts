import type { CompResult, CurrencyCode, PercentileKey } from '../types/compensation';
import { ROLES } from '../data/roles';
import { LEVELS } from '../data/levels';
import { TIERS } from '../data/tiers';
import { CITIES } from '../data/cities';
import { PCTS } from '../data/percentiles';

export const GBP_EUR = 1.17;

export function computeComp(
  cat: string, sub: string, lvl: string, tier: string, city: string, pct: PercentileKey = 'P50'
): CompResult {
  const r = ROLES[cat];
  if (!r) return { base: 0, equity: 0, bonus: 0, total: 0 };
  const sm = r.subs[sub] || 1;
  const lm = LEVELS[lvl] || LEVELS['L3 Senior'];
  const tm = TIERS[tier] || TIERS['Big Tech'];
  const cm = CITIES[city] || CITIES['London'];
  const pm = PCTS[pct] || 1;
  const base = Math.round(r.base * sm * lm.base * tm.base * cm.mult * pm * 1000);
  const equity = Math.round(r.equity * sm * lm.equity * tm.equity * cm.mult * pm * 1000);
  const bonus = Math.round(r.bonus * sm * lm.bonus * tm.bonus * cm.mult * pm * 1000);
  return { base, equity, bonus, total: base + equity + bonus };
}

export function toDisplayCurrency(amountGBP: number, displayCur: CurrencyCode): number {
  return displayCur === 'EUR' ? Math.round(amountGBP * GBP_EUR) : amountGBP;
}
