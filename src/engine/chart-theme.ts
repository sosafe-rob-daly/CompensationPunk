export interface ChartColors {
  text: string;
  title: string;
  line: string;
  split: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  series: string[];
}

export function chartColors(isDark: boolean): ChartColors {
  return {
    text: isDark ? '#8b90a5' : '#6b7280',
    title: isDark ? '#e8eaf0' : '#111827',
    line: isDark ? '#252840' : '#e2e4eb',
    split: isDark ? '#1a1d2e' : '#f0f1f5',
    tooltipBg: isDark ? '#1e2130' : '#ffffff',
    tooltipBorder: isDark ? '#2f3350' : '#e2e4eb',
    tooltipText: isDark ? '#e8eaf0' : '#111827',
    series: ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4', '#a855f7', '#f43f5e', '#14b8a6'],
  };
}
