import React from 'react';
import { Chips, Dropdown, Icon } from '@dale/ui';

/* Shared bits for Operations › Monitoring: formatters, pills, filter fields. */
const monFont = (w, s, lh, c) => ({ fontFamily: 'var(--font-ui)', fontWeight: w, fontSize: s, lineHeight: lh, color: c });
const fmtMoney = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const fmtDateLong = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const toLocalInput = (d) => { const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };

function StatusPill({ status, size = 'small' }) {
  return <Chips status={status} size={size} />;
}

function LinkText({ children, onClick, muted }) {
  return (
    <button type="button" onClick={onClick} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', ...monFont(500, 14, '20px', muted ? 'var(--dale-gray-medium)' : 'var(--dale-black)'), textDecoration: 'underline', textDecorationColor: 'var(--dale-border-cool)', textUnderlineOffset: 3 }}>{children}</button>
  );
}

const fieldLabel = { ...monFont(700, 12, '100%', 'var(--gray-900)') };
const fieldBox = { height: 40, borderRadius: 8, background: 'var(--dale-white)', border: '1px solid var(--gray-300)', boxSizing: 'border-box', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6, minWidth: 0 };
const fieldInput = { border: 0, outline: 'none', background: 'transparent', flexGrow: 1, minWidth: 0, width: '100%', padding: 0, ...monFont(400, 14, 1, 'var(--gray-900)') };

function FilterText({ label, value, onChange, placeholder, type = 'text', maxLength, inputMode, labelAction, trailing }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, height: 12 }}><span style={fieldLabel}>{label}</span>{labelAction}</span>
      <span style={fieldBox}>
        <input type={type} value={value} maxLength={maxLength} inputMode={inputMode} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={type === 'datetime-local' ? { ...fieldInput, fontSize: 13 } : fieldInput} />
        {value && type === 'text' && <button type="button" aria-label={'Clear ' + label} onClick={() => onChange('')} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', color: 'var(--gray-500)', display: 'flex' }}><Icon name="Close" size={16} /></button>}
        {trailing}
      </span>
    </div>
  );
}

/** Dropdown pinned to a fixed-height slot so its open panel floats over the table. */
function FilterSelect({ label, options, value, onChange }) {
  return (
    <div style={{ position: 'relative', height: 60, minWidth: 0 }}>
      <Dropdown dense key={value} label={label} options={options} defaultValue={value} onChange={onChange} style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 6 }} />
    </div>
  );
}

/** Customer picker — search by phone or name, never a raw UUID. */
function CustomerSearch({ customers, value, onChange }) {
  const [q, setQ] = React.useState('');
  const sel = customers.find((c) => c.id === value);
  const digits = q.replace(/\D/g, '');
  const hits = q.trim() ? customers.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || (digits && c.phone.replace(/\D/g, '').includes(digits))).slice(0, 5) : [];
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
      <span style={fieldLabel}>Customer</span>
      <span style={fieldBox}>
        {sel ? (
          <React.Fragment>
            <span style={{ ...monFont(400, 14, 1, 'var(--gray-900)'), flexGrow: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sel.name}</span>
            <button type="button" aria-label="Clear customer" onClick={() => onChange(null)} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', color: 'var(--gray-500)', display: 'flex' }}><Icon name="Close" size={16} /></button>
          </React.Fragment>
        ) : (
          <input value={q} placeholder="Phone or name" onChange={(e) => setQ(e.target.value)} style={fieldInput} />
        )}
      </span>
      {!sel && hits.length > 0 && (
        <div role="listbox" style={{ position: 'absolute', left: 0, right: 0, top: 68, zIndex: 8, borderRadius: 8, border: '1px solid var(--gray-300)', background: 'var(--dale-white)', overflow: 'hidden' }}>
          {hits.map((c) => (
            <div key={c.id} role="option" onClick={() => { onChange(c.id); setQ(''); }} style={{ padding: '10px 12px', background: 'var(--dale-sensitive-warm)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={monFont(400, 14, 1, 'var(--gray-900)')}>{c.name}</span>
              <span style={monFont(400, 13, 1, 'var(--dale-gray-medium)')}>{c.phone}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Skeleton({ w = 90 }) {
  return <span style={{ display: 'block', width: w, height: 10, borderRadius: 5, background: 'var(--dale-sensitive)' }} />;
}

export { monFont, fmtMoney, fmtDate, fmtDateLong, toLocalInput, StatusPill, LinkText, FilterText, FilterSelect, CustomerSearch, Skeleton };
