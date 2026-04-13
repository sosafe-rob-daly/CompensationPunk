import { useState, useEffect, useMemo } from 'react';
import type { CurrencyCode, TabId, Preset } from './types/compensation';
import { ROLES, CITIES, LEVELS, CITY_NAMES, PRESETS } from './data';
import { computeComp, toDisplayCurrency } from './engine/compute';
import { fmtFull } from './engine/format';
import { exportCSV } from './engine/csv-export';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PromptBar } from './components/PromptBar';
import { OverviewTab } from './components/tabs/OverviewTab';
import { CityCompareTab } from './components/tabs/CityCompareTab';
import { RoleCompareTab } from './components/tabs/RoleCompareTab';
import { ProgressionTab } from './components/tabs/ProgressionTab';
import { WhatIfTab } from './components/tabs/WhatIfTab';
import { GeoHeatmapTab } from './components/tabs/GeoHeatmapTab';
import './App.css';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'cities', label: 'City Benchmark' },
  { id: 'roles', label: 'Role Benchmark' },
  { id: 'levels', label: 'Level Progression' },
  { id: 'whatif', label: 'What-If' },
  { id: 'heatmap', label: 'Geo Heatmap' },
];

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [cur, setCur] = useState<CurrencyCode>('GBP');
  const [tab, setTab] = useState<TabId>('overview');
  const [cat, setCat] = useState('Engineering');
  const [sub, setSub] = useState('Backend Engineer');
  const [lvl, setLvl] = useState('L3 Senior');
  const [tier, setTier] = useState('Big Tech');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('London');

  const isDark = theme === 'dark';

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => {
    const subs = Object.keys(ROLES[cat].subs);
    if (!subs.includes(sub)) setSub(subs[0]);
  }, [cat]);

  const filteredCities = useMemo(() =>
    country ? CITY_NAMES.filter(c => CITIES[c].country === country) : CITY_NAMES
  , [country]);
  useEffect(() => {
    if (!filteredCities.includes(city)) setCity(filteredCities[0]);
  }, [filteredCities]);

  function applyPreset(p: Preset) {
    setCat(p.cat); setSub(p.sub); setLvl(p.lvl); setTier(p.tier);
    setCountry(p.country); setCity(p.city);
  }

  function handleExportCSV() {
    const citiesToExport = filteredCities.length > 0 ? filteredCities : CITY_NAMES;
    exportCSV(cat, sub, lvl, tier, citiesToExport, cur);
  }

  const prompt = useMemo(() => {
    const d = (v: number) => toDisplayCurrency(v, cur);
    const p50 = computeComp(cat, sub, lvl, tier, city, 'P50');
    const p25 = computeComp(cat, sub, lvl, tier, city, 'P25');
    const p75 = computeComp(cat, sub, lvl, tier, city, 'P75');
    const cd = CITIES[city];
    const colAdj = fmtFull(Math.round(d(p50.total) * 100 / cd.col), cur);
    return `European Tech Compensation Benchmark\n${LEVELS[lvl].short} ${sub} | ${tier} | ${city}, ${cd.country}\n\nTotal Compensation (P25-P75): ${fmtFull(d(p25.total), cur)} \u2013 ${fmtFull(d(p75.total), cur)}\n  Base: ${fmtFull(d(p25.base), cur)} \u2013 ${fmtFull(d(p75.base), cur)}\n  Equity: ${fmtFull(d(p25.equity), cur)} \u2013 ${fmtFull(d(p75.equity), cur)}\n  Bonus: ${fmtFull(d(p25.bonus), cur)} \u2013 ${fmtFull(d(p75.bonus), cur)}\n\nMarket Position: ${Math.round(cd.mult * 100)}% of London equivalent\nCoL Index: ${cd.col}/100 (London=100)\nCoL-Adjusted Total: ${colAdj}`;
  }, [cat, sub, lvl, tier, city, cur]);

  return (
    <div className="app">
      <Header cur={cur} isDark={isDark} onSetCurrency={setCur} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <div className="main">
        <Sidebar
          cat={cat} sub={sub} lvl={lvl} tier={tier} country={country} city={city}
          filteredCities={filteredCities} presets={PRESETS}
          onSetCat={setCat} onSetSub={setSub} onSetLvl={setLvl} onSetTier={setTier}
          onSetCountry={setCountry} onSetCity={setCity}
          onApplyPreset={applyPreset} onExportCSV={handleExportCSV}
        />
        <main className="content">
          <div className="tab-bar">
            {TABS.map(t => (
              <button key={t.id} className={'tab-btn' + (tab === t.id ? ' active' : '')} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>
          {tab === 'overview' && <OverviewTab cat={cat} sub={sub} lvl={lvl} tier={tier} city={city} cur={cur} dark={isDark} />}
          {tab === 'cities' && <CityCompareTab cat={cat} sub={sub} lvl={lvl} tier={tier} cur={cur} dark={isDark} />}
          {tab === 'roles' && <RoleCompareTab cat={cat} lvl={lvl} tier={tier} city={city} cur={cur} dark={isDark} />}
          {tab === 'levels' && <ProgressionTab cat={cat} sub={sub} tier={tier} city={city} cur={cur} dark={isDark} />}
          {tab === 'whatif' && <WhatIfTab cat={cat} sub={sub} lvl={lvl} tier={tier} city={city} cur={cur} dark={isDark} />}
          {tab === 'heatmap' && <GeoHeatmapTab cat={cat} sub={sub} lvl={lvl} cur={cur} dark={isDark} />}
        </main>
      </div>
      <PromptBar prompt={prompt} />
    </div>
  );
}
