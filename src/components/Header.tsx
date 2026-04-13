import type { CurrencyCode } from '../types/compensation';

interface HeaderProps {
  cur: CurrencyCode;
  isDark: boolean;
  onSetCurrency: (cur: CurrencyCode) => void;
  onToggleTheme: () => void;
}

export function Header({ cur, isDark, onSetCurrency, onToggleTheme }: HeaderProps) {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">CP</div>
        <span>CompensationPunk</span>
        <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 400, marginLeft: 4 }}>European Tech Comp</span>
      </div>
      <div className="header-right">
        <button className={'hdr-btn' + (cur === 'GBP' ? ' active' : '')} onClick={() => onSetCurrency('GBP')}>{'\u00A3'} GBP</button>
        <button className={'hdr-btn' + (cur === 'EUR' ? ' active' : '')} onClick={() => onSetCurrency('EUR')}>{'\u20AC'} EUR</button>
        <button className="hdr-btn" onClick={onToggleTheme} style={{ fontSize: 14, padding: '4px 10px' }}>{isDark ? '\u2600' : '\uD83C\uDF19'}</button>
      </div>
    </header>
  );
}
