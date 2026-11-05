import React, { useState } from 'react';
import searchIcon from '@dale/ui/assets/icons/search-icon.svg';
import bellIcon from '@dale/ui/assets/icons/notification-icon.svg';

const SEARCH = searchIcon;
const BELL = bellIcon;

function MaskIcon({ src, size, color }) {
  return <span style={{ display: 'block', width: size, height: size, flexShrink: 0, background: color, WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' }} />;
}

function AdminHeader({ title, avatar = 'var(--dale-black-pure)', query, onQuery, tabs }) {
  return (
    <header style={{
      height: 100, flexShrink: 0, alignSelf: 'stretch', boxSizing: 'border-box',
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'row', padding: '0 40px',
      justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 48, minWidth: 0, alignSelf: 'stretch' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 28, lineHeight: '100%', whiteSpace: 'nowrap', color: 'var(--dale-black)' }}>{title}</span>
        {tabs}
      </div>
      {!tabs && <div style={{ width: 81, height: 77, flexShrink: 0 }} />}
      <div style={{ width: 425, height: 60, display: 'flex', flexDirection: 'row', gap: 30, alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: 255, height: 50, boxSizing: 'border-box', borderRadius: 40, background: 'var(--surface-sunken)', display: 'flex', flexDirection: 'row', gap: 10, padding: '0 15px 0 25px', alignItems: 'center' }}>
          <MaskIcon src={SEARCH} size={20} color="var(--dale-gray-light)" />
          <input
            value={query}
            onChange={(e) => onQuery && onQuery(e.target.value)}
            placeholder="Search for something"
            style={{ border: 0, outline: 'none', background: 'transparent', flexGrow: 1, minWidth: 0, fontFamily: 'var(--font-ui)', fontWeight: 300, fontSize: 15, lineHeight: '100%', color: 'var(--dale-gray-light)' }}
          />
        </div>
        <div style={{ position: 'relative', width: 50, height: 50, borderRadius: 100, background: 'var(--surface-sunken)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
          <MaskIcon src={BELL} size={25} color="var(--dale-gray-light)" />
          <div style={{ position: 'absolute', left: 30, top: 12, width: 8, height: 8, borderRadius: '50%', background: 'var(--dale-accent-deep)' }} />
        </div>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: avatar, flexShrink: 0 }} />
      </div>
    </header>
  );
}

function ContentCard({ children, style }) {
  return (
    <div style={{
      overflow: 'hidden', borderRadius: 20, background: 'var(--surface-card)',
      display: 'flex', flexDirection: 'column', gap: 10, padding: '37px 30px',
      alignItems: 'flex-start', boxSizing: 'border-box', flexGrow: 1, alignSelf: 'stretch', ...style,
    }}>{children}</div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ position: 'relative', height: 30, overflow: 'hidden', flexShrink: 0, alignSelf: 'stretch' }}>
      <div style={{ display: 'flex', gap: 34, alignItems: 'flex-start' }}>
        {tabs.map((t) => (
          <button key={t} type="button" onClick={() => onChange(t)} style={{
            border: 0, background: 'none', padding: 0, cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 16, lineHeight: '100%',
            whiteSpace: 'nowrap', color: t === active ? 'var(--dale-tab-active)' : 'var(--dale-gray-light)',
          }}>{t}</button>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, top: 29, width: '100%', height: 1, background: 'var(--border-divider)' }} />
      <div style={{ position: 'absolute', left: 0, top: 27, width: 114, height: 3, borderRadius: '10px 10px 0 0', background: 'var(--dale-tab-active)' }} />
    </div>
  );
}

function DashboardBody({ children, style }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 30, padding: 40,
      alignItems: 'flex-start', boxSizing: 'border-box', flexGrow: 1, alignSelf: 'stretch', ...style,
    }}>{children}</div>
  );
}

export { AdminHeader, ContentCard, Tabs, DashboardBody, MaskIcon };
