import type { CurrencyCode } from '../types/compensation';

export function fmt(amount: number, cur: CurrencyCode): string {
  const sym = cur === 'EUR' ? '\u20AC' : '\u00A3';
  if (amount >= 1000000) return sym + (amount / 1000000).toFixed(1) + 'M';
  if (amount >= 1000) return sym + Math.round(amount / 1000) + 'k';
  return sym + amount.toLocaleString();
}

export function fmtFull(amount: number, cur: CurrencyCode): string {
  const sym = cur === 'EUR' ? '\u20AC' : '\u00A3';
  return sym + amount.toLocaleString();
}
