import { useState, useMemo } from 'react';
import type { CurrencyCode, PercentileKey } from '../../types/compensation';
import { TIER_KEYS, PCT_KEYS } from '../../data';
import { computeComp, toDisplayCurrency, GBP_EUR } from '../../engine/compute';
import { fmt, fmtFull } from '../../engine/format';
import { chartColors } from '../../engine/chart-theme';
import { EChart } from '../EChart';

interface WhatIfTabProps {
  cat: string; sub: string; lvl: string; tier: string; city: string;
  cur: CurrencyCode; dark: boolean;
}

export function WhatIfTab({ cat, sub, lvl, tier, city, cur, dark }: WhatIfTabProps) {
  const cc = chartColors(dark);
  const dispCur = cur;
  const [baseAdj, setBaseAdj] = useState(0);
  const [equityAdj, setEquityAdj] = useState(0);
  const [bonusAdj, setBonusAdj] = useState(0);
  const [headcount, setHeadcount] = useState(1);
  const [offerBase, setOfferBase] = useState('');
  const [offerEquity, setOfferEquity] = useState('');
  const [offerBonus, setOfferBonus] = useState('');

  const original = useMemo(() => computeComp(cat, sub, lvl, tier, city, 'P50'), [cat, sub, lvl, tier, city]);
  const d = (v: number) => toDisplayCurrency(v, dispCur);

  const adjusted = useMemo(() => {
    const base = Math.round(original.base * (1 + baseAdj / 100));
    const equity = Math.round(original.equity * (1 + equityAdj / 100));
    const bonus = Math.round(original.bonus * (1 + bonusAdj / 100));
    return { base, equity, bonus, total: base + equity + bonus };
  }, [original, baseAdj, equityAdj, bonusAdj]);

  const delta = adjusted.total - original.total;
  const deltaPct = ((adjusted.total / original.total - 1) * 100).toFixed(1);
  const annualImpact = delta * headcount;

  const compareOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: cc.tooltipBg, borderColor: cc.tooltipBorder, textStyle: { color: cc.tooltipText, fontSize: 12 } },
    legend: { bottom: 0, textStyle: { color: cc.text, fontSize: 11 }, itemWidth: 12, itemHeight: 12 },
    grid: { left: 80, right: 30, top: 20, bottom: 40 },
    xAxis: { type: 'category', data: ['Current', 'Adjusted'], axisLabel: { color: cc.text, fontSize: 12 }, axisLine: { lineStyle: { color: cc.line } }, axisTick: { show: false } },
    yAxis: { type: 'value', axisLabel: { color: cc.text, fontSize: 10, formatter: (v: number) => fmt(v, dispCur) }, splitLine: { lineStyle: { color: cc.split } }, axisLine: { show: false } },
    series: [
      { name: 'Base', type: 'bar', stack: 's', data: [d(original.base), d(adjusted.base)], itemStyle: { color: '#6366f1' }, barWidth: 50 },
      { name: 'Equity', type: 'bar', stack: 's', data: [d(original.equity), d(adjusted.equity)], itemStyle: { color: '#22c55e' }, barWidth: 50 },
      { name: 'Bonus', type: 'bar', stack: 's', data: [d(original.bonus), d(adjusted.bonus)], itemStyle: { color: '#f59e0b' }, barWidth: 50 },
    ],
  };

  const offerPercentiles = useMemo(() => {
    if (!offerBase && !offerEquity && !offerBonus) return null;
    const ob = parseFloat(offerBase) || 0;
    const oe = parseFloat(offerEquity) || 0;
    const obon = parseFloat(offerBonus) || 0;
    const toGBP = (v: number) => dispCur === 'EUR' ? v / GBP_EUR : v;
    const obGBP = toGBP(ob * 1000);
    const oeGBP = toGBP(oe * 1000);
    const obonGBP = toGBP(obon * 1000);
    const ototalGBP = obGBP + oeGBP + obonGBP;

    function findPercentile(value: number, component: 'base' | 'equity' | 'bonus' | 'total') {
      const pctValues = PCT_KEYS.map(p => computeComp(cat, sub, lvl, tier, city, p as PercentileKey)[component]);
      if (value <= pctValues[0]) return 10;
      if (value >= pctValues[4]) return 90;
      for (let i = 0; i < 4; i++) {
        if (value >= pctValues[i] && value <= pctValues[i + 1]) {
          const pctNums = [10, 25, 50, 75, 90];
          const frac = (value - pctValues[i]) / (pctValues[i + 1] - pctValues[i]);
          return Math.round(pctNums[i] + frac * (pctNums[i + 1] - pctNums[i]));
        }
      }
      return 50;
    }
    return {
      base: findPercentile(obGBP, 'base'),
      equity: findPercentile(oeGBP, 'equity'),
      bonus: findPercentile(obonGBP, 'bonus'),
      total: findPercentile(ototalGBP, 'total'),
    };
  }, [offerBase, offerEquity, offerBonus, cat, sub, lvl, tier, city, cur]);

  function pctColor(p: number) {
    if (p >= 70) return 'var(--green)';
    if (p >= 40) return 'var(--amber)';
    return 'var(--rose)';
  }

  return (
    <div className="grid-2">
      <div>
        <div className="chart-container">
          <div className="chart-title">Compensation Adjustments</div>
          <div className="slider-group">
            <div className="slider-label"><span>Base Salary</span><span>{baseAdj > 0 ? '+' : ''}{baseAdj}%</span></div>
            <input type="range" className="slider" min="-30" max="30" step="1" value={baseAdj} onInput={e => setBaseAdj(+(e.target as HTMLInputElement).value)} />
          </div>
          <div className="slider-group">
            <div className="slider-label"><span>Equity</span><span>{equityAdj > 0 ? '+' : ''}{equityAdj}%</span></div>
            <input type="range" className="slider" min="-50" max="50" step="1" value={equityAdj} onInput={e => setEquityAdj(+(e.target as HTMLInputElement).value)} />
          </div>
          <div className="slider-group">
            <div className="slider-label"><span>Bonus</span><span>{bonusAdj > 0 ? '+' : ''}{bonusAdj}%</span></div>
            <input type="range" className="slider" min="-30" max="30" step="1" value={bonusAdj} onInput={e => setBonusAdj(+(e.target as HTMLInputElement).value)} />
          </div>
          <div className="slider-group">
            <div className="slider-label"><span>Headcount</span><span>{headcount}</span></div>
            <input type="range" className="slider" min="1" max="100" step="1" value={headcount} onInput={e => setHeadcount(+(e.target as HTMLInputElement).value)} />
          </div>
          <div style={{ marginTop: 16, padding: '12px', background: 'var(--bg-3)', borderRadius: 'var(--radius)', fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-2)' }}>Per-person impact</span>
              <span style={{ fontWeight: 600, color: delta >= 0 ? 'var(--green)' : 'var(--rose)' }}>{delta >= 0 ? '+' : ''}{fmtFull(d(Math.abs(delta)), dispCur)}/yr ({deltaPct}%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-2)' }}>Total budget impact ({headcount} HC)</span>
              <span style={{ fontWeight: 700, color: delta >= 0 ? 'var(--green)' : 'var(--rose)' }}>{delta >= 0 ? '+' : ''}{fmtFull(d(Math.abs(annualImpact)), dispCur)}/yr</span>
            </div>
          </div>
        </div>
        <div className="chart-container">
          <div className="chart-title">Before / After</div>
          <EChart option={compareOption} height={280} />
        </div>
      </div>
      <div>
        <div className="chart-container">
          <div className="chart-title">Benchmark My Offer</div>
          <div className="chart-subtitle">Enter an offer to see where it falls in the market distribution</div>
          <div className="offer-row">
            <span className="offer-label">Base (k)</span>
            <input className="offer-input" type="number" placeholder={'e.g. ' + Math.round(d(original.base) / 1000)} value={offerBase} onInput={e => setOfferBase((e.target as HTMLInputElement).value)} />
          </div>
          <div className="offer-row">
            <span className="offer-label">Equity (k)</span>
            <input className="offer-input" type="number" placeholder={'e.g. ' + Math.round(d(original.equity) / 1000)} value={offerEquity} onInput={e => setOfferEquity((e.target as HTMLInputElement).value)} />
          </div>
          <div className="offer-row">
            <span className="offer-label">Bonus (k)</span>
            <input className="offer-input" type="number" placeholder={'e.g. ' + Math.round(d(original.bonus) / 1000)} value={offerBonus} onInput={e => setOfferBonus((e.target as HTMLInputElement).value)} />
          </div>
          {offerPercentiles && (
            <div style={{ marginTop: 16, padding: '16px', background: 'var(--bg-3)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: 'var(--text-1)' }}>Market Position</div>
              {(['base', 'equity', 'bonus', 'total'] as const).map(k => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'capitalize', width: 50 }}>{k}</span>
                  <div style={{ flex: 1, height: 6, background: 'var(--bg-4)', borderRadius: 3, margin: '0 12px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: offerPercentiles[k] + '%', background: pctColor(offerPercentiles[k]), borderRadius: 3, transition: 'width .3s' }} />
                  </div>
                  <span className="percentile-marker" style={{ color: pctColor(offerPercentiles[k]), background: offerPercentiles[k] >= 70 ? 'var(--green-m)' : offerPercentiles[k] >= 40 ? 'var(--amber-m)' : 'var(--rose-m)' }}>P{offerPercentiles[k]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="chart-container">
          <div className="chart-title">Tier Comparison (P50 Total)</div>
          <table className="data-table">
            <thead><tr><th>Company Tier</th><th className="num">Total Comp</th><th className="num">vs Big Tech</th></tr></thead>
            <tbody>
              {TIER_KEYS.map(t => {
                const c = computeComp(cat, sub, lvl, t, city, 'P50');
                const bt = computeComp(cat, sub, lvl, 'Big Tech', city, 'P50');
                const pct = Math.round(c.total / bt.total * 100);
                return (
                  <tr key={t} className={t === tier ? 'highlight' : ''}>
                    <td style={{ fontWeight: 500 }}>{t}</td>
                    <td className="num">{fmtFull(d(c.total), dispCur)}</td>
                    <td className="num"><span className={'badge ' + (pct >= 90 ? 'badge-green' : pct >= 70 ? 'badge-amber' : 'badge-rose')}>{pct}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
