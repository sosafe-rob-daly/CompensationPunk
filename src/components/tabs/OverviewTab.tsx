import { useMemo } from 'react';
import type { CurrencyCode } from '../../types/compensation';
import { CITIES, PCT_KEYS } from '../../data';
import { computeComp, toDisplayCurrency } from '../../engine/compute';
import { fmt, fmtFull } from '../../engine/format';
import { chartColors } from '../../engine/chart-theme';
import { EChart } from '../EChart';

interface OverviewTabProps {
  cat: string; sub: string; lvl: string; tier: string; city: string;
  cur: CurrencyCode; dark: boolean;
}

export function OverviewTab({ cat, sub, lvl, tier, city, cur, dark }: OverviewTabProps) {
  const cc = chartColors(dark);
  const dispCur = cur;
  const p50 = computeComp(cat, sub, lvl, tier, city, 'P50');
  const p25 = computeComp(cat, sub, lvl, tier, city, 'P25');
  const p75 = computeComp(cat, sub, lvl, tier, city, 'P75');
  const d = (v: number) => toDisplayCurrency(v, dispCur);

  const boxData = useMemo(() =>
    (['base', 'equity', 'bonus', 'total'] as const).map(k =>
      PCT_KEYS.map(p => d(computeComp(cat, sub, lvl, tier, city, p)[k]))
    ), [cat, sub, lvl, tier, city, cur]);

  const boxOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item', backgroundColor: cc.tooltipBg, borderColor: cc.tooltipBorder,
      textStyle: { color: cc.tooltipText, fontSize: 12 },
      formatter: (p: unknown) => {
        const param = p as { data?: number[]; name?: string };
        if (!param.data) return '';
        const labels = ['P10', 'P25', 'P50', 'P75', 'P90'];
        return `<b>${param.name}</b><br/>` + labels.map((l, i) => `${l}: ${fmtFull(param.data![i], dispCur)}`).join('<br/>');
      },
    },
    grid: { left: 80, right: 30, top: 20, bottom: 40 },
    xAxis: { type: 'category', data: ['Base', 'Equity', 'Bonus', 'Total'], axisLabel: { color: cc.text, fontSize: 11 }, axisLine: { lineStyle: { color: cc.line } }, axisTick: { lineStyle: { color: cc.line } } },
    yAxis: { type: 'value', axisLabel: { color: cc.text, fontSize: 10, formatter: (v: number) => fmt(v, dispCur) }, splitLine: { lineStyle: { color: cc.split } }, axisLine: { show: false } },
    series: [{ type: 'boxplot', data: boxData, itemStyle: { color: 'rgba(99,102,241,.25)', borderColor: '#6366f1', borderWidth: 2 }, emphasis: { itemStyle: { borderColor: '#818cf8', borderWidth: 2.5 } } }],
  };

  const donutOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item', backgroundColor: cc.tooltipBg, borderColor: cc.tooltipBorder,
      textStyle: { color: cc.tooltipText, fontSize: 12 },
      formatter: (p: unknown) => {
        const param = p as { name: string; value: number; percent: number };
        return `${param.name}: ${fmtFull(d(param.value), dispCur)} (${param.percent}%)`;
      },
    },
    legend: { bottom: 0, textStyle: { color: cc.text, fontSize: 11 }, itemWidth: 12, itemHeight: 12 },
    series: [{
      type: 'pie', radius: ['48%', '72%'], center: ['50%', '45%'], avoidLabelOverlap: true, label: { show: false },
      data: [
        { value: p50.base, name: 'Base', itemStyle: { color: '#6366f1' } },
        { value: p50.equity, name: 'Equity', itemStyle: { color: '#22c55e' } },
        { value: p50.bonus, name: 'Bonus', itemStyle: { color: '#f59e0b' } },
      ],
    }],
  };

  const tableData = PCT_KEYS.map(p => {
    const c = computeComp(cat, sub, lvl, tier, city, p);
    return { pct: p, base: d(c.base), equity: d(c.equity), bonus: d(c.bonus), total: d(c.total) };
  });

  const cityData = CITIES[city];
  const colAdj = Math.round(d(p50.total) * 100 / cityData.col);

  return (
    <>
      <div className="cards">
        <div className="card">
          <div className="card-stripe" style={{ background: '#6366f1' }} />
          <div className="card-label">Base Salary</div>
          <div className="card-value" style={{ color: '#6366f1' }}>{fmtFull(d(p50.base), dispCur)}</div>
          <div className="card-sub">{fmt(d(p25.base), dispCur)} – {fmt(d(p75.base), dispCur)} P25–P75</div>
        </div>
        <div className="card">
          <div className="card-stripe" style={{ background: '#22c55e' }} />
          <div className="card-label">Equity (Annual)</div>
          <div className="card-value" style={{ color: '#22c55e' }}>{fmtFull(d(p50.equity), dispCur)}</div>
          <div className="card-sub">{fmt(d(p25.equity), dispCur)} – {fmt(d(p75.equity), dispCur)} P25–P75</div>
        </div>
        <div className="card">
          <div className="card-stripe" style={{ background: '#f59e0b' }} />
          <div className="card-label">Bonus</div>
          <div className="card-value" style={{ color: '#f59e0b' }}>{fmtFull(d(p50.bonus), dispCur)}</div>
          <div className="card-sub">{fmt(d(p25.bonus), dispCur)} – {fmt(d(p75.bonus), dispCur)} P25–P75</div>
        </div>
        <div className="card">
          <div className="card-stripe" style={{ background: 'linear-gradient(90deg,#6366f1,#22c55e,#f59e0b)' }} />
          <div className="card-label">Total Compensation</div>
          <div className="card-value">{fmtFull(d(p50.total), dispCur)}</div>
          <div className="card-sub">{fmt(d(p25.total), dispCur)} – {fmt(d(p75.total), dispCur)} P25–P75</div>
        </div>
      </div>
      <div className="grid-2">
        <div className="chart-container">
          <div className="chart-title">Compensation Distribution (P10–P90)</div>
          <EChart option={boxOption} height={280} />
        </div>
        <div className="chart-container">
          <div className="chart-title">Compensation Split (P50)</div>
          <EChart option={donutOption} height={280} />
        </div>
      </div>
      <div className="chart-container">
        <div className="chart-title">Percentile Table</div>
        <div className="chart-subtitle">CoL Index: {cityData.col}/100 (London=100) · CoL-Adjusted P50 Total: {fmtFull(colAdj, dispCur)}</div>
        <table className="data-table">
          <thead><tr><th>Percentile</th><th className="num">Base</th><th className="num">Equity</th><th className="num">Bonus</th><th className="num">Total</th></tr></thead>
          <tbody>
            {tableData.map(r => (
              <tr className={r.pct === 'P50' ? 'highlight' : ''} key={r.pct}>
                <td><span className="badge badge-accent">{r.pct}</span></td>
                <td className="num">{fmtFull(r.base, dispCur)}</td>
                <td className="num">{fmtFull(r.equity, dispCur)}</td>
                <td className="num">{fmtFull(r.bonus, dispCur)}</td>
                <td className="num" style={{ fontWeight: 600, color: 'var(--text-0)' }}>{fmtFull(r.total, dispCur)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
