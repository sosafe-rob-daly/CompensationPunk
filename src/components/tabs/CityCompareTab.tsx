import { useState, useMemo } from 'react';
import type { CurrencyCode } from '../../types/compensation';
import { CITIES, CITY_NAMES, LEVELS } from '../../data';
import { computeComp, toDisplayCurrency } from '../../engine/compute';
import { fmt, fmtFull } from '../../engine/format';
import { chartColors } from '../../engine/chart-theme';
import { EChart } from '../EChart';

interface CityCompareTabProps {
  cat: string; sub: string; lvl: string; tier: string;
  cur: CurrencyCode; dark: boolean;
}

export function CityCompareTab({ cat, sub, lvl, tier, cur, dark }: CityCompareTabProps) {
  const [colAdjusted, setColAdjusted] = useState(false);
  const cc = chartColors(dark);
  const dispCur = cur;

  const data = useMemo(() => {
    return CITY_NAMES.map(c => {
      const p50 = computeComp(cat, sub, lvl, tier, c, 'P50');
      const cd = CITIES[c];
      const d = (v: number) => toDisplayCurrency(v, dispCur);
      const factor = colAdjusted ? (100 / cd.col) : 1;
      return {
        city: c, country: cd.country, col: cd.col,
        mult: Math.round(cd.mult * 100),
        base: Math.round(d(p50.base) * factor),
        equity: Math.round(d(p50.equity) * factor),
        bonus: Math.round(d(p50.bonus) * factor),
        total: Math.round(d(p50.total) * factor),
      };
    }).sort((a, b) => b.total - a.total);
  }, [cat, sub, lvl, tier, cur, colAdjusted]);

  const londonTotal = data.find(d => d.city === 'London')?.total || 1;

  const barOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis', backgroundColor: cc.tooltipBg, borderColor: cc.tooltipBorder,
      textStyle: { color: cc.tooltipText, fontSize: 12 },
      formatter: (params: unknown) => {
        const ps = params as Array<{ name: string; marker: string; seriesName: string; value: number }>;
        let s = `<b>${ps[0].name}</b><br/>`;
        let total = 0;
        ps.forEach(p => { s += `${p.marker} ${p.seriesName}: ${fmtFull(p.value, dispCur)}<br/>`; total += p.value; });
        s += `<b>Total: ${fmtFull(total, dispCur)}</b>`;
        return s;
      },
    },
    legend: { bottom: 0, textStyle: { color: cc.text, fontSize: 11 }, itemWidth: 12, itemHeight: 12 },
    grid: { left: 100, right: 30, top: 10, bottom: 40 },
    yAxis: { type: 'category', data: data.map(d => d.city).reverse(), axisLabel: { color: cc.text, fontSize: 11 }, axisLine: { lineStyle: { color: cc.line } }, axisTick: { show: false } },
    xAxis: { type: 'value', axisLabel: { color: cc.text, fontSize: 10, formatter: (v: number) => fmt(v, dispCur) }, splitLine: { lineStyle: { color: cc.split } }, axisLine: { show: false } },
    series: [
      { name: 'Base', type: 'bar', stack: 's', data: data.map(d => d.base).reverse(), itemStyle: { color: '#6366f1' }, barWidth: 16 },
      { name: 'Equity', type: 'bar', stack: 's', data: data.map(d => d.equity).reverse(), itemStyle: { color: '#22c55e' }, barWidth: 16 },
      { name: 'Bonus', type: 'bar', stack: 's', data: data.map(d => d.bonus).reverse(), itemStyle: { color: '#f59e0b' }, barWidth: 16 },
    ],
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="chart-title" style={{ margin: 0 }}>{LEVELS[lvl].short} {sub} · {tier}</div>
        <div className="toggle-group">
          <button className={'toggle-btn' + (colAdjusted ? '' : ' active')} onClick={() => setColAdjusted(false)}>Nominal</button>
          <button className={'toggle-btn' + (colAdjusted ? ' active' : '')} onClick={() => setColAdjusted(true)}>CoL-Adjusted</button>
        </div>
      </div>
      <div className="chart-container" style={{ padding: '16px 16px 8px' }}>
        <EChart option={barOption} height={Math.max(350, data.length * 32)} />
      </div>
      <div className="chart-container">
        <div className="chart-title">City Differential Table{colAdjusted ? ' (CoL-Adjusted)' : ''}</div>
        <table className="data-table">
          <thead><tr><th>City</th><th>Country</th><th className="num">P50 Total</th><th className="num">vs London</th><th className="num">CoL Index</th><th className="num">CoL-Adj Total</th></tr></thead>
          <tbody>
            {data.map(r => {
              const pctOfLondon = Math.round(r.total / londonTotal * 100);
              const colAdj = Math.round(r.total * 100 / r.col);
              const badge = pctOfLondon >= 95 ? 'badge-green' : pctOfLondon >= 75 ? 'badge-amber' : 'badge-rose';
              return (
                <tr key={r.city} className={r.city === 'London' ? 'highlight' : ''}>
                  <td style={{ fontWeight: 500 }}>{r.city}</td>
                  <td style={{ color: 'var(--text-2)' }}>{r.country}</td>
                  <td className="num">{fmtFull(r.total, dispCur)}</td>
                  <td className="num"><span className={'badge ' + badge}>{pctOfLondon}%</span></td>
                  <td className="num">{r.col}</td>
                  <td className="num" style={{ fontWeight: 500 }}>{fmtFull(colAdjusted ? r.total : colAdj, dispCur)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
