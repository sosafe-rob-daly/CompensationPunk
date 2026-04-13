import { useMemo } from 'react';
import type { CurrencyCode } from '../../types/compensation';
import { LEVELS, TIER_KEYS, CITY_NAMES } from '../../data';
import { computeComp, toDisplayCurrency } from '../../engine/compute';
import { fmt, fmtFull } from '../../engine/format';
import { chartColors } from '../../engine/chart-theme';
import { EChart } from '../EChart';

interface GeoHeatmapTabProps {
  cat: string; sub: string; lvl: string;
  cur: CurrencyCode; dark: boolean;
}

export function GeoHeatmapTab({ cat, sub, lvl, cur, dark }: GeoHeatmapTabProps) {
  const cc = chartColors(dark);
  const dispCur = cur;

  const data = useMemo(() => {
    const rows: [number, number, number][] = [];
    TIER_KEYS.forEach((t, ti) => {
      CITY_NAMES.forEach((c, ci) => {
        const p50 = computeComp(cat, sub, lvl, t, c, 'P50');
        rows.push([ci, ti, toDisplayCurrency(p50.total, dispCur)]);
      });
    });
    return rows;
  }, [cat, sub, lvl, cur]);

  const maxVal = Math.max(...data.map(d => d[2]));
  const minVal = Math.min(...data.map(d => d[2]));

  const heatmapOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      backgroundColor: cc.tooltipBg, borderColor: cc.tooltipBorder,
      textStyle: { color: cc.tooltipText, fontSize: 12 },
      formatter: (p: unknown) => {
        const param = p as { data: [number, number, number] };
        return `<b>${CITY_NAMES[param.data[0]]}</b><br/>${TIER_KEYS[param.data[1]]}<br/>Total: ${fmtFull(param.data[2], dispCur)}`;
      },
    },
    grid: { left: 140, right: 60, top: 10, bottom: 80 },
    xAxis: { type: 'category', data: CITY_NAMES, axisLabel: { color: cc.text, fontSize: 10, rotate: 45 }, axisLine: { lineStyle: { color: cc.line } }, axisTick: { show: false } },
    yAxis: { type: 'category', data: TIER_KEYS, axisLabel: { color: cc.text, fontSize: 10 }, axisLine: { lineStyle: { color: cc.line } }, axisTick: { show: false } },
    visualMap: {
      min: minVal, max: maxVal, calculable: true, orient: 'vertical', right: 0, top: 'center',
      textStyle: { color: cc.text, fontSize: 10 },
      inRange: { color: ['#1e1b4b', '#3730a3', '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'] },
    },
    series: [{
      type: 'heatmap', data: data,
      label: {
        show: true, color: '#fff', fontSize: 9,
        formatter: (p: unknown) => {
          const param = p as { data: [number, number, number] };
          return fmt(param.data[2], dispCur);
        },
      },
      emphasis: { itemStyle: { shadowBlur: 5, shadowColor: 'rgba(0,0,0,.3)' } },
      itemStyle: { borderColor: dark ? '#0f1117' : '#ffffff', borderWidth: 2 },
    }],
  };

  return (
    <>
      <div className="chart-title">{LEVELS[lvl].short} {sub} · Total Compensation Heatmap</div>
      <div className="chart-container">
        <EChart option={heatmapOption} height={220} />
      </div>
      <div className="chart-container">
        <div className="chart-title">Geo Differential Matrix (% of London, Big Tech)</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>City</th>
                {TIER_KEYS.map(t => <th key={t} className="num" style={{ fontSize: 9 }}>{t}</th>)}
              </tr>
            </thead>
            <tbody>
              {CITY_NAMES.map(c => {
                const londonBT = computeComp(cat, sub, lvl, 'Big Tech', 'London', 'P50').total;
                return (
                  <tr key={c}>
                    <td style={{ fontWeight: 500, fontSize: 11 }}>{c}</td>
                    {TIER_KEYS.map(t => {
                      const val = computeComp(cat, sub, lvl, t, c, 'P50').total;
                      const pct = Math.round(val / londonBT * 100);
                      const bg = pct >= 80 ? 'var(--green-m)' : pct >= 50 ? 'var(--amber-m)' : 'var(--rose-m)';
                      const color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--rose)';
                      return <td key={t} className="num" style={{ background: bg, color, fontWeight: 600, fontSize: 11 }}>{pct}%</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
