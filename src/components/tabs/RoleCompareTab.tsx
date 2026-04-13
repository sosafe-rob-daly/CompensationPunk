import { useMemo } from 'react';
import type { CurrencyCode } from '../../types/compensation';
import { ROLES, LEVELS, CATEGORY_KEYS } from '../../data';
import { computeComp, toDisplayCurrency } from '../../engine/compute';
import { fmt, fmtFull } from '../../engine/format';
import { chartColors } from '../../engine/chart-theme';
import { EChart } from '../EChart';

interface RoleCompareTabProps {
  cat: string; lvl: string; tier: string; city: string;
  cur: CurrencyCode; dark: boolean;
}

export function RoleCompareTab({ cat, lvl, tier, city, cur, dark }: RoleCompareTabProps) {
  const cc = chartColors(dark);
  const subs = Object.keys(ROLES[cat].subs);
  const dispCur = cur;

  const data = useMemo(() => {
    return subs.map(s => {
      const p50 = computeComp(cat, s, lvl, tier, city, 'P50');
      const d = (v: number) => toDisplayCurrency(v, dispCur);
      return { sub: s, base: d(p50.base), equity: d(p50.equity), bonus: d(p50.bonus), total: d(p50.total) };
    }).sort((a, b) => b.total - a.total);
  }, [cat, lvl, tier, city, cur]);

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
    grid: { left: 140, right: 30, top: 10, bottom: 40 },
    yAxis: { type: 'category', data: data.map(d => d.sub).reverse(), axisLabel: { color: cc.text, fontSize: 11 }, axisLine: { lineStyle: { color: cc.line } }, axisTick: { show: false } },
    xAxis: { type: 'value', axisLabel: { color: cc.text, fontSize: 10, formatter: (v: number) => fmt(v, dispCur) }, splitLine: { lineStyle: { color: cc.split } }, axisLine: { show: false } },
    series: [
      { name: 'Base', type: 'bar', stack: 's', data: data.map(d => d.base).reverse(), itemStyle: { color: '#6366f1' }, barWidth: 18 },
      { name: 'Equity', type: 'bar', stack: 's', data: data.map(d => d.equity).reverse(), itemStyle: { color: '#22c55e' }, barWidth: 18 },
      { name: 'Bonus', type: 'bar', stack: 's', data: data.map(d => d.bonus).reverse(), itemStyle: { color: '#f59e0b' }, barWidth: 18 },
    ],
  };

  const crossData = useMemo(() => {
    return CATEGORY_KEYS.map(c => {
      const firstSub = Object.keys(ROLES[c].subs)[0];
      const p50 = computeComp(c, firstSub, lvl, tier, city, 'P50');
      const d = (v: number) => toDisplayCurrency(v, dispCur);
      return { cat: c, sub: firstSub, total: d(p50.total) };
    }).sort((a, b) => b.total - a.total);
  }, [lvl, tier, city, cur]);

  const crossOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis', backgroundColor: cc.tooltipBg, borderColor: cc.tooltipBorder,
      textStyle: { color: cc.tooltipText, fontSize: 12 },
      formatter: (p: unknown) => {
        const ps = p as Array<{ name: string; value: number }>;
        return ps[0] ? `<b>${ps[0].name}</b><br/>Total: ${fmtFull(ps[0].value, dispCur)}` : '';
      },
    },
    grid: { left: 130, right: 30, top: 10, bottom: 20 },
    yAxis: { type: 'category', data: crossData.map(d => d.cat).reverse(), axisLabel: { color: cc.text, fontSize: 11 }, axisLine: { lineStyle: { color: cc.line } }, axisTick: { show: false } },
    xAxis: { type: 'value', axisLabel: { color: cc.text, fontSize: 10, formatter: (v: number) => fmt(v, dispCur) }, splitLine: { lineStyle: { color: cc.split } }, axisLine: { show: false } },
    series: [{ type: 'bar', data: crossData.map(d => d.total).reverse(), itemStyle: { color: '#6366f1' }, barWidth: 16 }],
  };

  return (
    <>
      <div className="chart-title">{cat} Roles · {LEVELS[lvl].short} · {tier} · {city}</div>
      <div className="chart-container" style={{ marginBottom: 16 }}>
        <div className="chart-title" style={{ fontSize: 12 }}>Sub-Role Comparison</div>
        <EChart option={barOption} height={Math.max(200, subs.length * 36)} />
      </div>
      <div className="chart-container">
        <div className="chart-title" style={{ fontSize: 12 }}>Cross-Category Comparison (top sub-role per category)</div>
        <EChart option={crossOption} height={Math.max(250, CATEGORY_KEYS.length * 30)} />
      </div>
    </>
  );
}
