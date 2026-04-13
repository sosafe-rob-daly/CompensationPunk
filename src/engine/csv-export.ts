import type { CurrencyCode, PercentileKey } from '../types/compensation';
import { CITIES } from '../data/cities';
import { PCT_KEYS } from '../data/percentiles';
import { computeComp, toDisplayCurrency } from './compute';

export function exportCSV(
  cat: string, sub: string, lvl: string, tier: string,
  citiesToExport: string[], cur: CurrencyCode,
) {
  const rows = [[
    'Category', 'Sub-Role', 'Level', 'Company Tier', 'City', 'Country', 'Currency',
    'P10 Base', 'P25 Base', 'P50 Base', 'P75 Base', 'P90 Base',
    'P10 Equity', 'P25 Equity', 'P50 Equity', 'P75 Equity', 'P90 Equity',
    'P10 Bonus', 'P25 Bonus', 'P50 Bonus', 'P75 Bonus', 'P90 Bonus',
    'P10 Total', 'P25 Total', 'P50 Total', 'P75 Total', 'P90 Total',
  ].join(',')];

  const d = (v: number) => toDisplayCurrency(v, cur);

  citiesToExport.forEach(c => {
    const pcts = PCT_KEYS.map(p => computeComp(cat, sub, lvl, tier, c, p as PercentileKey));
    rows.push([
      cat, sub, lvl, tier, c, CITIES[c].country, cur,
      ...pcts.map(p => d(p.base)),
      ...pcts.map(p => d(p.equity)),
      ...pcts.map(p => d(p.bonus)),
      ...pcts.map(p => d(p.total)),
    ].join(','));
  });

  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `comp-${sub.replace(/\s+/g, '-')}-${tier.replace(/\s+/g, '-')}-${lvl.split(' ')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
