import type { Preset } from '../types/compensation';
import { ROLES, TIERS, CITIES, CATEGORY_KEYS, LEVEL_KEYS, TIER_KEYS, COUNTRIES } from '../data';

interface SidebarProps {
  cat: string;
  sub: string;
  lvl: string;
  tier: string;
  country: string;
  city: string;
  filteredCities: string[];
  presets: Preset[];
  onSetCat: (v: string) => void;
  onSetSub: (v: string) => void;
  onSetLvl: (v: string) => void;
  onSetTier: (v: string) => void;
  onSetCountry: (v: string) => void;
  onSetCity: (v: string) => void;
  onApplyPreset: (p: Preset) => void;
  onExportCSV: () => void;
}

export function Sidebar({
  cat, sub, lvl, tier, country, city, filteredCities, presets,
  onSetCat, onSetSub, onSetLvl, onSetTier, onSetCountry, onSetCity,
  onApplyPreset, onExportCSV,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="filter-section">
        <div className="filter-section-title">Filters</div>
        <div className="filter-group">
          <label className="filter-label">Role Category</label>
          <select className="filter-select" value={cat} onChange={e => onSetCat(e.target.value)}>
            {CATEGORY_KEYS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Sub-Role</label>
          <select className="filter-select" value={sub} onChange={e => onSetSub(e.target.value)}>
            {Object.keys(ROLES[cat].subs).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Level</label>
          <select className="filter-select" value={lvl} onChange={e => onSetLvl(e.target.value)}>
            {LEVEL_KEYS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Company Tier</label>
          <select className="filter-select" value={tier} onChange={e => onSetTier(e.target.value)}>
            {TIER_KEYS.map(t => <option key={t} value={t}>{t} {'\u2014'} {TIERS[t].desc}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Country</label>
          <select className="filter-select" value={country} onChange={e => onSetCountry(e.target.value)}>
            <option value="">All Countries</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">City</label>
          <select className="filter-select" value={city} onChange={e => onSetCity(e.target.value)}>
            {filteredCities.map(c => <option key={c} value={c}>{c} ({CITIES[c].country})</option>)}
          </select>
        </div>
      </div>
      <div className="filter-section">
        <div className="filter-section-title">Quick Presets</div>
        {presets.map(p => (
          <button key={p.name} className="preset-btn" onClick={() => onApplyPreset(p)}>
            <div className="preset-name">{p.name}</div>
          </button>
        ))}
      </div>
      <div className="filter-section">
        <div className="filter-section-title">Export</div>
        <button className="action-btn secondary" onClick={onExportCSV}>Export CSV</button>
      </div>
    </aside>
  );
}
