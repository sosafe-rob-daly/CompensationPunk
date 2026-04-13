import { useMemo } from 'react';
import type { CurrencyCode } from '../../types/compensation';
import { LEVELS, LEVEL_KEYS } from '../../data';
import { computeComp, toDisplayCurrency } from '../../engine/compute';
import { fmt, fmtFull } from '../../engine/format';
import { chartColors } from '../../engine/chart-theme';
import { EChart } from '../EChart';

interface ProgressionTabProps {
  cat: string; sub: string; tier: string; city: string;
  cur: CurrencyCode; dark: boolean;
}

export function ProgressionTab({ cat, sub, tier, city, cur, dark }: ProgressionTabProps) {
  const cc = chartColors(dark);
  const dispCur = cur;

  const data = useMemo(() => {
    return LEVEL_KEYS.map(l => {
      const p50 = computeComp(cat, sub, l, tier, city, 'P50');
      const d = (v: number) => toDisplayCurrency(v, dispCur);
      return { level: LEVELS[l].short, base: d(p50.base), equity: d(p50.equity), bonus: d(p50.bonus), total: d(p50.total) };
    });
  }, [cat, sub, tier, city, cur]);

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
    grid: { left: 70, right: 30, top: 30, bottom: 40 },
    xAxis: { type: 'category', data: data.map(d => d.level), axisLabel: { color: cc.text, fontSize: 11 }, axisLine: { lineStyle: { color: cc.line } }, axisTick: { show: false } },
    yAxis: { type: 'value', axisLabel: { color: cc.text, fontSize: 10, formatter: (v: number) => fmt(v, dispCur) }, splitLine: { lineStyle: { color: cc.split } }, axisLine: { show: false } },
    series: [
      { name: 'Base', type: 'bar', stack: 's', data: data.map(d => d.base), itemStyle: { color: '#6366f1' }, barWidth: 40 },
      { name: 'Equity', type: 'bar', stack: 's', data: data.map(d => d.equity), itemStyle: { color: '#22c55e' }, barWidth: 40 },
      { name: 'Bonus', type: 'bar', stack: 's', data: data.map(d => d.bonus), itemStyle: { color: '#f59e0b' }, barWidth: 40 },
      { name: 'Total', type: 'line', data: data.map(d => d.total), lineStyle: { color: '#ec4899', width: 2.5 }, symbol: 'circle', symbolSize: 8, itemStyle: { color: '#ec4899' }, z: 10 },
    ],
  };

  const growthData = data.map((d, i) => ({
    ...d,
    growth: i > 0 ? Math.round((d.total - data[i - 1].total) / data[i - 1].total * 100) : null,
    equityPct: Math.round(d.equity / d.total * 100),
  }));

  return (
    <>
      <div className="chart-title">{sub} · {tier} · {city}</div>
      <div className="chart-container" style={{ marginBottom: 16 }}>
        <div className="chart-title" style={{ fontSize: 12 }}>Total Comp by Level</div>
        <EChart option={barOption} height={350} />
      </div>
      <div className="chart-container">
        <div className="chart-title" style={{ fontSize: 12 }}>Level Progression Detail</div>
        <table className="data-table">
          <thead><tr><th>Level</th><th className="num">Base</th><th className="num">Equity</th><th className="num">Bonus</th><th className="num">Total</th><th className="num">Growth</th><th className="num">Equity %</th></tr></thead>
          <tbody>
            {growthData.map(r => (
              <tr key={r.level}>
                <td style={{ fontWeight: 600 }}>{r.level}</td>
                <td className="num">{fmtFull(r.base, dispCur)}</td>
                <td className="num">{fmtFull(r.equity, dispCur)}</td>
                <td className="num">{fmtFull(r.bonus, dispCur)}</td>
                <td className="num" style={{ fontWeight: 600, color: 'var(--text-0)' }}>{fmtFull(r.total, dispCur)}</td>
                <td className="num">{r.growth !== null ? <span className={'badge ' + (r.growth >= 40 ? 'badge-green' : r.growth >= 20 ? 'badge-amber' : 'badge-accent')}>+{r.growth}%</span> : '–'}</td>
                <td className="num" style={{ color: 'var(--text-2)' }}>{r.equityPct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
