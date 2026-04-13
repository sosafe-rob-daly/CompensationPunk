import { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

interface EChartProps {
  option: echarts.EChartsOption;
  height?: number;
}

export function EChart({ option, height = 400 }: EChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (!chart.current) {
      chart.current = echarts.init(ref.current);
      const ro = new ResizeObserver(() => chart.current?.resize());
      ro.observe(ref.current);
      (ref.current as HTMLDivElement & { _ro?: ResizeObserver })._ro = ro;
    }
    chart.current.setOption(option, { notMerge: true });
  }, [option]);

  useEffect(() => {
    return () => {
      const el = ref.current as HTMLDivElement & { _ro?: ResizeObserver } | null;
      if (el?._ro) el._ro.disconnect();
      if (chart.current) { chart.current.dispose(); chart.current = null; }
    };
  }, []);

  return <div ref={ref} style={{ width: '100%', height: height + 'px' }} />;
}
