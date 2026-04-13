export interface CompResult {
  base: number;
  equity: number;
  bonus: number;
  total: number;
}

export interface RoleCategory {
  base: number;
  equity: number;
  bonus: number;
  subs: Record<string, number>;
}

export interface LevelData {
  base: number;
  equity: number;
  bonus: number;
  short: string;
}

export interface TierData {
  base: number;
  equity: number;
  bonus: number;
  desc: string;
}

export interface CityData {
  country: string;
  mult: number;
  col: number;
  cur: CurrencyCode;
}

export type CurrencyCode = 'GBP' | 'EUR';
export type PercentileKey = 'P10' | 'P25' | 'P50' | 'P75' | 'P90';
export type Theme = 'dark' | 'light';
export type TabId = 'overview' | 'cities' | 'roles' | 'levels' | 'whatif' | 'heatmap';

export interface Preset {
  name: string;
  cat: string;
  sub: string;
  lvl: string;
  tier: string;
  country: string;
  city: string;
}
